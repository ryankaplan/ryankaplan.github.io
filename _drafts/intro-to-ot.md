# An intro to OT

## First steps

There are lots of articles on OT online. Why another one? Most that I've read focus on the very basics (e.g. references) or they dive deep into one particular OT algorithm.

But the primary barrier I've experienced in getting started with OT is that there are *many* OT algorithms out there, each with their own advantages and challenges, and most of them are buried away in academic papers. I've found it difficult to get a bird's eye view of the field.

So, this post aims to give you a brief history of OT and how a few popular OT algorithms evolved. I'll also talk about a few algorithms that I consider "modern" and their trade-offs.

Of course, it's not useful to talk about this without any understanding of what OT is. So the first section focuses on explaining OT at a high level - in a similar way to many other articles online - and then I talk about the history of field. After that I talk about modern OT algorithms and their trade-offs.

Caveat: I'm not an expert. What is covered here is just what I've picked up by reading. It may be wrong or incomplete. If you have feedback, please let me know!

Caveat #2: I'm interested in OT algorithms that involve a central server (aren't purely p2p). So that's what I'll talk about.

## What problem does OT solve?

**Problem:** suppose you have an application that runs on many computers at once, like a collaborative text editor, where multiple users can edit some shared document at the same time. You want each user to be able to edit the document unhindered by the actions of other users. For example, I might be editing a document at the same time that Bob and Claire are editing it. I should be able to focus on the changes that I'm making to the document, while Bob and Claire focus on the changes that *they're* making, and when we're all done our computers should show the same document emcompassing all of our changes. This document should be, more or less, what we each expect it to be.

OT is a field of research - more than two decades old - that talks about solutions to this problem. It applies to a variety of data types ('collaborative text editor' in the paragraph above could just as well be 'collaborative CAD application' or 'collaborative spreadsheet') and it's not the only field of research that solves this problem. It's one of a few, but it's one that's been successful for some well known products (most notably Google Docs).

## An example

We'll keep going with the 'collaborative text editor' example, since that's easiest to understand. Suppose there are two clients, A and B. Each client has a copy of the entire document content which is `Funky monkey`. Suppose that A changes the text to `Funky monk` and B changes it to `Funkiest monkey`. Here's an example of what might happen:

- A generates two operations to describe the changes made by A. They are `Delete(10)` and `Delete(11)` which delete characters 10 and 11 which are the `ey` at the end of `Funky monkey`.
- B generates 5 operations. The first one deletes the `y` at the end of `Funky`. The next four insert `iest` in its place. The operations are: `Delete(4)`, `Insert('i', 4)`, `Insert('e', 5)`, `Insert('s', 6)`, `Insert('t', 7)`.
- A sends its operations to B. B's text is `Funkiest monkey` so it can't just apply `Delete(10)` and `Delete(11)` to its document. That would delete characters 'o' and 'n' changing it to 'Funkiest mkey'! When the operations were created, the document text (at client A) was `Funky monkey`. They don't make sense on the new document content. The solution is to *transform* these delete operations against the five operations that B has applied in the mean-time - the delete and four insert operations. What is this transformation, specifically? Since we deleted a charcater before characters 10 and 11, we should change them to 9 and 10. And since we inserted four characters before index 10, we should incremenet them each by four, changing them to 13 and 14. This makes sure that applying them to the document does the right thing.
- A similar process happens on client A when it receives client B's operations. It transforms the incoming operations, if necessary, so that when they're applied the resulting document is the same as on client B. In this particular case, none of client B's operations need to be transformed, because all the operations on client A happened at a higher index in the document than those in client B.

The above description is vague, but hopefully it gives you a rough idea of how OT is structured. To make it slightly more concrete, here's an example in python of what these transformation functions look like (again for text editing, which is just an example data type and not the only problem that OT solves):

```
def transform(insert, insert):
    # TODO(ryan)
    pass
```

The above description is also flawed in that I gloss over when/how to transform functions against each other. I said something like the following: 'when a client receives some operations, transform them against all operations that have been applied on the client in the mean time'. This isn't entirely true, and 'in the mean time' isn't very specific.

The part of OT that determines when and how to transform operations against each other can be very complex and is a big part of OT research. It's called the OT 'control' algorithm and is often cleanly separable from the transformation functions which are specific to the data type that you're working with.

That's a lot to take in, so just to be clear: there are two cleanly separable parts to most OT solutions. One is the control algorithm, which is used to determine when to send operations to other sites and whether/how to transform them when they get there. Example names of some control algorithms are 'dOPT', 'GOT' and 'pattern-based OT'.

The other part is the transformation functions that we use with a particular data type. The transformation function that I described above is for text. You might have a different one for the data type used in a CAD application. And yet another for a data type used in a spreadsheet application.

Often (although not always) your choice of control algorithm is independent on your transformation functions. I can use the same text transformation functions with dOPT as with 'pattern-based OT'. You'll find that most academic papers focus on improving a particular control algorithm, or a particular set of transformation functions. Rarely both.

Before continuing, you should try to understand vector clocks and 'causal ordering'. See more *here*.

## An incomplete history of OT control algorithms

As mentioned above, I'm interested in a subset of OT algorithms. I'll talk about the ones that lead to, what I think, are the common approaches used today.

In 1989, C. Ellis and S. Gibbs published a paper detailing an algorithm called *distributed operational transform* (aka dOPT). They used it in a collaborative editor that they named GROVE. Here's a sketch of dOPT...

```
When site A generates an operation, it executes it immediately. It stamps it to indicate what operations have been executed at site A, and it broadcasts the operation (along with the stamp) to other sites.

When the operation gets from site A to B, the site does different things depending on the stamp of the operation. If the stamp indicates that the operation was created when site A had executed operations that still need to be executed at site B, then it puts the operation in a queue and waits until those operations arrive.

Otherwise, all operations that had executed at site A when the op was created are *already* at site B. In this case, site B transforms the operation against all operations in its history which weren't at site A when the op was created.
```

This seemed to work. They built GROVE, and they dedicated a section of their paper to the correctness of the algorithm. But it had a subtle bug where clients didn't converge when messages were delivered between them in a very particular way. [2] refers to this as the dOPT puzzle.

In response, a few research groups independently found new control algorithms that solved the dOPT puzzle. One was known as the REDUCE approach (which involved the GOT and GOTO algorithms) and another was a system called Jupiter (which was a pre-cursor to Google Wave OT). [2] talks about these in depth, along with another (adOPTed). I'll give a brief overview of the two.

**REDUCE** is undo/redo. Introduced the idea of 'operation context' (which is close to, but not exactly, the state vectors used in GROVE). I'll talk more about operation context later. GOTO is an optimized version of GOT. Won't go into that here.

**Jupiter** Talk about 1d state thing. The problem with this is that it involves a lot of work by the server. Google Wave OT was developed so that the server could do less work. See [4] for more detail on that.

Up until here is contained in 2. If you're interested in more detail, I recommend checking it out.

---

Next I'll talk about two other approaches, one of which is pretty new. They're called Context-based OT (COT) and Pattern-based OT (POT). First, I should explain what I mean by 'operation context'.

### Operation context

### COT

### POT

## Other approaches

-Mention adOPTed again
- SOCT4 and SOCT3
- TIBOT
- TIBOT 2

## How about transformation algorithms?

- Strings
- ordered tree
- share.js json

## So what's the latest?

- Quip uses something reminiscent of CRDT
- GDocs is supposed to use OT, but not public what control algorithm they use. Problably some internal flavor never to be released. Grr.
- Etherpad? -> hackpad, coding editors, etc.
- share.js

## References

1. Ellis, C.A.; Gibbs, S.J. (1989). "Concurrency control in groupware systems". ACM SIGMOD Record 18 (2): 399–407. doi:10.1145/66926. Retrieved 2007-07-26.
2.  Sun, C.; Ellis, C. (1998). "Operational transformation in real-time group editors: issues, algorithms, and achievements". Proceedings of the 1998 ACM conference on Computer supported cooperative work. ACM Press New York, NY, USA. pp. 59–68.
3.  Yi Xu, Chengzheng Sun, "Conditions and Patterns for Achieving Convergence in OT-based Co-Editors", IEEE Transactions on Parallel & Distributed Systems, , no. 1, pp. 1, PrePrints PrePrints, doi:10.1109/TPDS.2015.2412938
4.  [*Understanding and Applying Operational Transformation* - Daniel Spiewak](http://www.codecommit.com/blog/java/understanding-and-applying-operational-transformation)