---
layout: post
title: Building a 3D Point class in Rust
date:   2018-12-02 00:00:00
summary: I just got started with Rust and wanted to make a 3D Vector class. This is some stuff I learned!
categories:
 - rust
---

I recently started using Rust for one of my side projects. One of the first things I wanted to do was to build a 3d point class. There are great open source Rust libraries that do this, but I wanted to learn the language so I decided to build it myself. I ran into more trouble than I thought I would, so I decided to write up what I learned!

## What I wanted

I wanted a point 3d type whose values I could treat just like native Rust numbers. Given some vectors `x`, `y` and `z`, I want to be able to do math on them like `x * y / (x + z)`. And since my points store their co-ordinates as `f32`, I also wanted to be able to write code like `10.0 * x`.

The first thing I did was declare my `Point3D` struct...

```rust
#[derive(Copy, Clone, Debug, PartialEq)]
struct Point3D {
  pub x: f32,
  pub y: f32,
  pub z: f32,
}
```

In Rust, the way to implement math operators for your custom type is to have it implement special traits in the `std::ops` module. For example, if you want `Point3D` to handle the `+` operator, you need to implement the `std::ops::Add` trait for it. Other relevant traits are `std::ops::{Sub, Mul, Div, Neg}`.

Here's an [example from the Rust docs](https://doc.rust-lang.org/std/ops/index.html) of how you might implement `Add` for your type.

```rust
impl Add for Point3D {
    type Output = Point3D;

    fn add(self, other: Point3D) -> Point3D {
        Point3D {
          x: self.x + other.x,
          y: self.y + other.y,
          z: self.z + other.z,
        }
    }
}
```

The above code tells rust when you see code like `x + y` and `x` and `y` are both `Point3D`, it can replace it with `std::ops::Add::add(x, y)`!

Likewise if you want to be able to add `Point3D` to floats, you can implement `Add` for `f32` and `Point3D`...

```rust
impl Add for f32 {
    type Output = Point3D;

    fn add(self, other: Point3D) -> Point3D {
        Point3D {
          x: self + other.x,
          y: self + other.y,
          z: self + other.z,
        }
    }
}
```

This will handle stuff like `3.0 + x`. If you want `x + 3.0` you'll have to implement this in the reverse order too.

## The problem

I was pretty happy with the code above but soon realized that there's an annoying issue with it: both implementations of `Add` above consume `Point3D`, so if you have a reference to `Point3D` there's no way to use them!

```rust
fn do_things_with_points(a: &Point, b: &Point) -> Point {
  // This won't compile because we implemented
  // std::ops::Add only for types `Point` and
  // `Point`. Not `&Point` and `&Point`!
  a + b
}
```

One approach to fixing this is that instead of implementing `add` on `Point3D` and `Point3D`, you can implement it on `&Point3D` and `&Point3D`, like so...

```rust
impl<'a, 'b> Add<&'a Point3D> for &'b Point3D {
  type Output = Point3D;

  fn add(self, other: &Point3D) -> Point3D {
    Point3D {
      x: self.x + other.x,
      y: self.y + other.y,
      z: self.z + other.z,
    }
  }
}
```

Unfortunately this won't work if you're writing code like `x + Point3D { x: 0.0, y: 1.0, z: 2.0 }` because the right hand side of that expression is `Point3D`, not `&Point3D`! You'd also have to pepper your math expressions with `&` symbols, which is not in itself a dealbreaker but doesn't meet my goal of having a point type that behaves like native numbers in Rust!

At this point it seemed like the solution was to...

1. Implement `Add` four times for each combination of argument types `Point3D` and `&Point3D`
2. Implement it another for times for the pairs `(f32, Point3D)`, `(f32, &Point3D)` and the reverse of each.
3. Do all of that for `Mul`, `Div` and `Sub`!!!!

In total that's `32` trait implementations! 😭

## Generics??

At this point I was sure that there's a better way to do this and I just don't know what it is. I had heard that Rust has a good macro system, and I could imagine implementing this with macros, but for some reason I thought it'd be more interesting to implement this with generics. I tried something like this...

```rust
trait HasXYZ {
  pub x: f32,
  pub y: f32,
  pub z: f32,
}

impl<A: HasXYZ, B: HasXYZ> Add<A> for B {
  type Output = Point3D;

  fn add(self, other: &Point3D) -> Point3D {
    Point3D {
      x: self.x + other.x,
      y: self.y + other.y,
      z: self.z + other.z,
    }
  }
}
```

The code above doesn't compile for a few reasons. One is that traits can't have fields on them, as far as I know. But another more important reason - that I didn't find at the time - is that you can't implement traits on generics. Saying `impl<T> Add<Whatever> on <T> {...}` is not ok!

Apparently I'm [not the only person to run into this](https://www.reddit.com/r/rust/comments/5115o2/type_parameter_t_must_be_used_as_the_type/) and there are good reasons for it. But I didn't find this second explanation for a while, so I kept digging around, got frustrated, and gave up. 🤷‍♂️

Eventually I [asked folks](https://www.reddit.com/r/learnrust/comments/a2ly2h/writing_code_that_applies_to_a_value_type_as_well/) [on reddit](https://www.reddit.com/r/rust/comments/a0haqj/hey_rustaceans_got_an_easy_question_ask_here/eazdznw) and it turns out that the standard library indeed uses macros to solve this problem! So I guess that is the sanctioned way to solve this in Rust. If this were a real project this would have been a great time to copy/paste code from the standard library. But since my goal was to learn I decided to write the macros myself. This is what I came up with...

## Using macros!

My first step was to figure out what I wanted my macro invocation to look like. I decided it should look something like this...

```
impl_binary_operations!(Point3D Add add +)
```

I probably don't need to take `Point3D` as an argument, since all my macros apply to Point3D, but I like the idea of re-using them for other point types later. If this were production code and not a side project, [I would probably not have done this](https://www.quora.com/What-does-the-acronym-YAGN-in-software-engineering-mean).

Anyway, I futzed around with a macro definitions until the following compiled...

```rust
macro_rules! impl_binary_operations {
  // $PointType is something like `Point3D`
  // $Operation is something like `Add`
  // $op_fn is something like `add`
  // $op_symbol is something like `+`
  ($PointType:ident $Operation:ident $op_fn:ident $op_symbol:tt) => {
    // My macro implemenation will go here!
  }
}
```

In the above code, `$PointType`, etc. are metavariables and `:ident`, `:tt` are their types. `:ident` is short for "identifier" and I don't yet know what `:tt` is but it seemed to work.

Inside the macro, I put my eight implementations of `Add` and then replaced all instances of `Add` with `$Operation`, all instances of `add` with `$op_fn`, etc. Then I added the following to the bottom of my code and it all worked!!!

```rust
impl_binary_operations!(Vec3 Add add +);
impl_binary_operations!(Vec3 Sub sub -);
impl_binary_operations!(Vec3 Mul mul *);
impl_binary_operations!(Vec3 Div div /);
```

I also ended up implementing assign operations (stuff like `x += y`) and negation (e.g. `- x`). The code got pretty long, so instead of posting it here you can see it [here](...).

So I took my code above with my four implementations of `Add` for various types `Point3D` and `&Point3D` and put them in a macro. Below is what I ended up with! It's worked pretty well for me and I ended up adding an implementation for code like `a += b` and `- a`. If you're curious to see the whole thing, I put it up here. Feel free to do with it what you will.

## Conclusion

This was much more work than I thought it would be! Hopefully it saves a few other folks some time. And despite the effort this took, Rust has been pretty pleasant to work with. A lot of other stuff I've needed to do with it has gone more smoothly, and coming from C++, the ownership semantics are less confusing that I thought they would be.

Thanks for reading!
