---
layout: post
title:  "An Intro to OT"
date:   2015-04-17 17:17:15
categories:
 - academic-papers
 - collaboration
 - operational-transformation
---

I've been trying to learn about real-time collaborative editing. One common approach is operational trasnformation (OT) algorithms,
and most OT resources online reference [Nichols, David A., et al. "High-latency, low-bandwidth windowing in the Jupiter collaboration system."](http://dl.acm.org/citation.cfm?id=215706).

 That paper one of the first to introduce OT as a technique for building collaborative editors. It's pretty light on
 implementation details and spends more time than I'd like describing what real-time collaboration is (I guess you couldn't take that
 for granted in 1995). It's an interesting read, but if you're interested in getting started with OT, I'd recommend starting
 instead with [this article by Daniel Spiewak](http://www.codecommit.com/blog/java/understanding-and-applying-operational-transformation).
 It describes the OT algorithm at a high level and gets into some of the complexities of using it to build an OT server/client.

 When I was done with Spiewak's article, I still didn't have a solid idea of how to implement OT on text or XML or any
  particular datatype. He directs to you to the Google Wave whitepapers to find out more, but I found
  [the ot.py implementation](https://github.com/Operational-Transformation) to be a better explanation. It's pretty
  small and easy to read in entirety. There are more implementations at that link (js, Haskell, lua) but I haven't dug
  into them. If you find one that you think is great, let me know!