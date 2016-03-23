---
layout: post
title:  "More than you want to know about @synchronized"
date:   2015-05-9 17:46:15
summary: I searched online for the internals of the @synchronized construct in Objective-C and didn't find an answer at the depth that I wanted. Here's what I found.
categories:
 - Objective-C
---

If you've done any concurrent programming in Objective-C, then you've seen the `@synchronized` construct. The `@synchronized` construct does just what a lock does: it prevents different threads from executing the same code at the same time. But it's more convenient and more readible in some cases compared to allocating, locking and unlocking an `NSLock`.

If you've never used `@synchronized` before, below is an example of how to use it. The meat of this article will talk about a short investigation that I made into how `@synchronized` is implemented.

<!--end-excerpt-->

# Example using @synchronized

Suppose that we're implementing a thread-safe queue in Objective-C. We might start it like this:

~~~
@implementation ThreadSafeQueue
{
    NSMutableArray *_elements;
    NSLock *_lock;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _elements = [NSMutableArray array];
        _lock = [[NSLock alloc] init];
    }
    return self;
}

- (void)push:(id)element
{
    [_lock lock];
    [_elements addObject:element];
    [_lock unlock];
}

@end
~~~

The `ThreadSafeQueue` class above has an `init` method which initializes two ivars: an `_elements` array and an `NSLock`. It has a `push:` method which acquires the lock, inserts an element into the array, and then releases the lock. Many threads can call `push:` at the same time, but the line `[_elements addObject:element]` will only ever be run on one thread at a time. The steps might go something like this:

1. Thread A calls the `push:` method
2. Thread B calls the `push:` method
3. Thread B calls `[_lock lock]` - since nobody else is holding the lock, Thread B acquires the lock
4. Thread A calls `[_lock lock]` but the lock is held by Thread B so the method call doesn't return - this pauses execution in thread A
5. Thread B adds its element to `_elements` and calls `[_lock unlock]`. When this happens, Thread A's `[_lock lock]` method returns and it goes on to insert its own element

We can implement this more succinctly using the `@synchronized` construct:

~~~
@implementation ThreadSafeQueue
{
    NSMutableArray *_elements;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _elements = [NSMutableArray array];
    }
    return self;
}

- (void)increment
{
    @synchronized (self) {
        [_elements addObject:element];
    }
}

@end
~~~

The synchronized block has the same effect as the `[_lock lock]` and `[_lock unlock]` in the previous example. You can think of it as locking on `self` as if `self` is an `NSLock`. A lock is aqcuired before any code after the opening `{` is run, and the lock is released before any code after the closing `}` is run. This is really handy because it means that you can never forget to call `unlock`!

You can `@synchronize` on any Objective-C object. So we could just as well have used `@synchronized(_elements)` instead of `@synchronized(self)` in the example above and the effect would be the same.

# Back to the investigation

I was curious about the implementation of `@sychronized` and I googled around for some details on it. I [found](http://stackoverflow.com/questions/1215330/how-does-synchronized-lock-unlock-in-objective-c) [some](http://stackoverflow.com/questions/1215765/changing-the-locking-object-insde-synchronized-section) [answers](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/Multithreading/ThreadSafety/ThreadSafety.html#//apple_ref/doc/uid/10000057i-CH8-SW3) but none of them gave me an explanation at the depth that I wanted. How is a lock associated with the object that you pass into `@synchronized`? Does `@synchronize` retain the object that it's locking? What if the object that you pass to `@synchronized` gets deallocated or set to `nil` inside the `@synchronized` block? These are all questions that I wanted answers to. In this post, I'll show you what I found.

[The documentation](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/Multithreading/ThreadSafety/ThreadSafety.html#//apple_ref/doc/uid/10000057i-CH8-SW3) for `@synchronized` tells us that the `@synchronized` block implicitly adds an exception handler to the protected code. This is so that the lock is released if an exception is thrown while synchronizing on a particular object.

[This SO post](http://stackoverflow.com/a/6047218/1026198) says that a `@synchronized` block transforms into paired calls to `objc_sync_enter` and `objc_sync_exit`. We don't know what these functions do, but given these facts we may think that the compiler takes code like this:

~~~
@synchronized(obj) {
    // do work
}
~~~

and turns it into something like this:

~~~
@try {
    objc_sync_enter(obj);
    // do work
} @finally {
    objc_sync_exit(obj);
}
~~~

What are `objc_sync_enter` and `object_sync_exit` and how are they implemented? Command-clicking them in XCode takes us to `<objc/objc-sync.h>` which has the two functions that we're interested in:

~~~
// Begin synchronizing on 'obj'.
// Allocates recursive pthread_mutex associated with 'obj' if needed.
int objc_sync_enter(id obj)

// End synchronizing on 'obj'.
int objc_sync_exit(id obj)
~~~

At the bottom fo the file there's a reminder that Apple engineers are humans too ;)

~~~
// The wait/notify functions have never worked correctly and no longer exist.
int objc_sync_wait(id obj, long long milliSecondsMaxWait);
int objc_sync_notify(id obj);
~~~

Anyway, the documentation of `objc_sync_enter` tells us something new: the `@synchronized` construct works by allocating a recursive lock[1] for the passed in object. When and how does the allocation happen? And how does it handle `nil` values? Luckily for us, the Objective-C runtime is open source, so we can just read the code and find out!

You can see the full source of `objc-sync` over [here](http://www.opensource.apple.com/source/objc4/objc4-646/runtime/objc-sync.mm), but I'll walk you through it at a high level. Let's start by looking at the data structures at the top of the file. I'll explain them just below this code block, so don't spend too long trying to decipher them.

~~~
typedef struct SyncData {
    id object;
    recursive_mutex_t mutex;
    struct SyncData* nextData;
    int threadCount;
} SyncData;

typedef struct SyncList {
    SyncData *data;
    spinlock_t lock;
} SyncList;

static SyncList sDataLists[16];
~~~

First off, we have a definition of `struct SyncData`. This struct contains an `object` (which is the object that we passed into `@synchronized`) and an associated `recursive_mutex_t` which is the lock associated with that `object`. Each `SyncData` also contains a pointer to another `SyncData` object called `nextData`, so you can think of each `SyncData` struct as an element in a linked list. Lastly, each `SyncData` contains a `threadCount` which is the number of threads which are either using or waiting on the lock in this particular `SyncData` object. This is useful because `SyncData` structs are cached and `threadCount == 0` indicates that a `SyncData` instance can be reused.

Next we have the definition of `struct SyncList`. As I mentioned above, you can think of a `SyncData` as a node in a list. Each `SyncList` struct has a pointer to the head of a list of `SyncData` nodes, as well as a lock to prevent concurrent modification of the list from multiple threads.

The last line of the code block above is a declaration of `sDataLists` - an array of `SyncList` structs. It may not look like it at first, but this `sDataList` array is a hash table (like an `NSDictionary`) that maps Objective-C objects to their corresponding lock.

When you call `objc_sync_enter(obj)`, it uses a hash of the memory address of `obj` to look up the appropriate `SyncData`, and then locks it. When you call `objc_sync_exit`, it looks up the appropriate `SyncData` and unlocks it.

Great! Now we know how `@synchronized` associates a lock with the object that you're synchronizing on, I'd like to talk about what happens when an object is deallocated or goes to `nil` in the middle of a `@synchronized` block.

If you looked at the source, you'll notice that there are no `retains` or `releases` inside `objc_sync_enter`. So it either doesn't retain the objects passed to it, or its compiled under arc. We can test this with the following code:

~~~
NSDate *test = [NSDate date];
// This should always be `1`
NSLog(@"%@", @([test retainCount]));

@synchronized (test) {

    // This will be `2` if `@synchronized` somehow
    // retains `test`
    NSLog(@"%@", @([test retainCount]));
}
~~~

This outputs `1` and `1` for each retain count. So it seems like `objc_sync_enter` doesn't retain the object that it's passed. This is interesting. If the object that you're synchronizing on gets deallocated, then it's possible that another, new, object will be allocated in its place. It's possible that some other thread tries to synchronize on that *new* object with the same memory address as the old one. In this case, the other thread will block until the current thread finishes its synchronized block. That doesn't seem so bad. It sounds like something the implementers might have known about and been okay with. I don't see any great alternatives.

What if the object gets set to `nil` in the synchronized block? Let's look again at our naive implementation:

~~~
NSString *test = @"test";
@try {
    // Allocates a lock for test and locks it
    objc_sync_enter(test);
    test = nil;
} @finally {
    // Passed `nil`, so the lock allocated in `objc_sync_enter`
    // above is never unlocked or deallocated
    objc_sync_exit(test);
}
~~~

`objc_sync_enter` will be called with `test` and `objc_sync_exit` will be called with `nil`. Well `objc_sync_exit` no-ops when passed `nil`, so nobody will ever release the lock. That sounds bad!

Do we know if `Objective-C` is susceptible to this issue? The following code calls `@synchronized` with a pointer that goes to `nil` in the `@synchronized` block. It then schedules work on a background thread that calls `@synchronized` with a pointer to the same object. If setting an object to `nil` in a `@synchronized` block leaves the lock locked, then the code inside the second `@synchronized` will never be run. We shouldn't see anything printed to the console.

~~~
NSNumber *number = @(1);
NSNumber *thisPtrWillGoToNil = number;

@synchronized (thisPtrWillGoToNil) {
    /**
     * Here we set the thing that we're synchronizing on to `nil`. If
     * implemented naively, the object would be passed to `objc_sync_enter`
     * and `nil` would be passed to `objc_sync_exit`, causing a lock to
     * never be released.
     */
    thisPtrWillGoToNil = nil;
}

dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0), ^ {

    NSCAssert(![NSThread isMainThread], @"Must be run on background thread");

    /**
     * If, as mentioned in the comment above, the synchronized lock is never
     * released, then we expect to wait forever below as we try to acquire
     * the lock associated with `number`.
     *
     * This doesn't happen, so we conclude that `@synchronized` must deal
     * with this correctly.
     */
    @synchronized (number) {
        NSLog(@"This line does indeed get printed to stdout");
    }

});
~~~

When we run the code above, the line **does** get printed to the console! So Objective-C handles this case just fine. My bet is that this is fixed by having the compiler do something more like the following.

~~~
NSString *test = @"test";
id synchronizeTarget = (id)test;
@try {
    objc_sync_enter(synchronizeTarget);
    test = nil;
} @finally {
    objc_sync_exit(synchronizeTarget);
}
~~~

With this implementation, the same object will always be passed to `objc_sync_enter` and `objc_sync_exit`. They both no-op when passed `nil`. This brings up a tricky debugging scenario: if you're passing `nil` to `@synchronized`, then you're not taking any locks and your code may not be thread-safe! If you're wondering why you're getting unexpected races, be sure that you're not ever passing `nil` to your `@synchronized` blocks. You can do this by setting a symbolic breakpoint on `objc_sync_nil`, which is an empty function that `objc_sync_enter` calls when it is passed `nil` to make debugging easier.

This answers my questions for now.

1. For each object that you call `sychronized` on, the Objective-C runtime allocates a recursive lock for that object and stores it in a hash table.
2. It appears to be OK if an object that's being `sychronized` on gets deallocated or set to `nil`. Although this isn't documented, so I wouldn't rely on it in production code.
3. Be careful not to pass `nil` to your `sychronized` block! This will remove thread safety from your code. You can see if this is happening by setting a breakpoint on `objc_sync_nil`.

A next step in the investigation would be to investigate the assembly outputted by a synchronized block to see if it's similar to my example above. My bet is that the assembly output of a `@synchronized` block is not the same as *any* Objective-C code that we dream up and that the code above is at best a model of how `@synchronized` works. Can you think of a better model? Are there cases where mine is flawed? Let me know!

-

[1] A recursive lock is one that does not deadlock if it is re-aquired by a thread that already holds it. You can find a neat example of how it works [here](http://en.wikipedia.org/wiki/Reentrant_mutex#Example). There's a handy class called `NSRecursiveLock` that behaves this way if you want to try it out.



