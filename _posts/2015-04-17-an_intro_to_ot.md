---
layout: post
title:  "An Intro to OT"
date:   2015-04-17 17:17:15
summary: Operational Transformation is a method of building real-time collaborative editors (like Google Docs). It's a big field of research and it can be hard to know where to start. Here are links to a few resources that I found helpful.
categories:
 - academic-papers
 - collaboration
 - operational-transformation
---

I've been reading about real-time collaborative editing. One popular approach is OT (operational transformation). Most OT resources online reference [this old paper on the Jupiter Collaboration system](http://dl.acm.org/citation.cfm?id=215706). It's one of the first to introduce OT as a technique for building collaborative editors and while it's easy to read, it's light on details and spends more time than I'd like describing what real-time collaboration is (I guess you couldn't take that for granted in 1995).

If you're interested in OT, I'd recommend starting instead with [this article by Daniel Spiewak](http://www.codecommit.com/blog/java/understanding-and-applying-operational-transformation). It describes OT at a high level and gets into some of the complexities of using it to build a server/client pair.

 When I was done with Spiewak's article, I still didn't have a solid idea of how to implement OT on text or XML or any  particular datatype. He directs to you to the Google Wave whitepapers to find out more, but I found [the ot.py implementation](https://github.com/Operational-Transformation) to be a better explanation. It's pretty  small and easy to read in entirety. There are more implementations at that link (js, Haskell, lua) but I haven't dug into them. If you find one that you think is great, let me know!