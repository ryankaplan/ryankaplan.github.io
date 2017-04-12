---
layout: post
title: Rendering Grid Transformations with WebGL
date:   2017-03-22 00:00:00
summary: A method for rendering grid transformations in a fragment shader.
categories:
 - math
 - computer graphics
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" integrity="sha384-wITovz90syo1dJWVh32uuETPVEtGigN07tkttEqPv+uR2SE/mbQcG7ATL28aI9H0" crossorigin="anonymous">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js" integrity="sha384-/y1Nn9+QQAipbNQWU65krzJralCnuOasHncUFXGkdwntGeSvQicrYkiUBwsgUqc1" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js" integrity="sha384-dq1/gEHSxPZQ7DdrM82ID4YVol9BYyU7GbWlIwnwyPzotpoc57wDw/guX8EaYGPx" crossorigin="anonymous"></script>

I'm trying out this thing where I don't agonize over my blog posts before I publish them. I wrote this one up quickly. I'm sure it has mistakes, and it's not quite done. Hopefully it's useful anyway!

## What are 2D grid transformations?

Often it's useful to think of functions as transformations of the 2D plane. Suppose I have a pair of functions like this:

<div>
@
\begin{aligned}
f(x) & = x \\
g(y) & = y
\end{aligned}
@
</div>

Picture taking each point in the 2D plane, plugging it into these equations, and re-assembling the output. You'd get a new plane. In the case of these functions, you'd get the same thing out as you put in because they map every point to itself. You can picture it kind of like this:

<img src="/images/grid-transformations/simple.png" />

What if we change $f$ slightly, so that it multiplies the x-value by two?

<div>
@
\begin{aligned}
f(x) & = 2 x \\
g(y) & = y
\end{aligned}
@
</div>

This transformation takes each point in the input plane and stretches it farther to the left (if it's negative) and farther to the right (if it's positive). Here's what it looks like:

<img src="/images/grid-transformations/expand.png" />

You can't see, but there are vertical purple bars juuuuuust outside of the viewport in the second image. I might come back and fix that.

In the previous example, $f$ took in $x$ and generated a new $x$. Similarly for $g$ and $y$. You can makes things more complicated by letting $f$ and $g$ each take in both $x$ AND $y$.

<div>
@
\begin{aligned}
f(x, y) & = x + 2 y \\
g(x, y) & = 3 x + y
\end{aligned}
@
</div>

This is what it looks like:

<img src="/images/grid-transformations/skew.png" />

This feels pretty unintuitive (to me). I almost expect unrecognizeable garbage to come out, but we get a pretty cohesive (skewed) plane.

There are some really interesting and complex transformations of the 2D plane. Here's a really cool one:

<div>
@
\begin{aligned}
f(x, y) & = x + sin(y) \\
g(x, y) & = y + cos(x)
\end{aligned}
@
</div>

<div style="text-align: center;">
  <img style="border: 2px solid #999; width: 284px; height: 284px;" src="/images/grid-transformations/sincos.gif" />
</div>

This post isn't about the math behind these transformations. If you're interested in learning more about that, I've heard really good things about <a href="https://www.youtube.com/watch?v=kjBOesZCoqc" target="_blank">this Youtube series</a> (although I haven't watched it myself).

This post is about a wacky approach that I found to rendering 2D grid transformations. It works for some equations (like the ones above), but also barfs out sometimes. Maybe someone will read this and help me fix it :-)

## High Level Approaches

I've been playing with THREE.js and WebGL recently, and they're the tools that I used to solve this. So this section is going to require some familiarity with them.

Also, before we get started it's worth talking about my requirements for a solution. I want to build something that lets users type in an equation to be visualized as a grid transformation. If I wanted to generate one image ever - based on one equation I had in mind - I would throw something scrappy together and call it day. But I want a robust approach that is fast and doesn't break down for large classes of user input.

My first thought was to render a quad mesh to the screen and to texture it with a 2D grid. The mesh would have some large number of vertices (like 200 by 200). And I would use a vertex shader to move those vertices. The vertex shader would be generated at run-time to perform the user's inputted transformation on each vertex.

I think this would work for simple transformations, but I didn't implement it because it has a fatal flaw. The quad mesh has a fixed size, so the user's transformation is likely to move parts of it out of view.

For example, suppose the quad mesh is positioned from $(-10, -10)$ to $(10, 10)$ and that this is also the camera viewport. The following very reasonable equation will move the grid off screen.

<div>
@
\begin{aligned}
f(x, y) & = x + 21 \\
g(x, y) & = y + 21
\end{aligned}
@
</div>

In this particular case, you could examine the equation and move the camera so that it's over the transformed grid. But I want to support a wide range of possible equations so that approach isn't tenable in general.

My second idea - and the one I've gone with so far - is to render everything in a fragment shader. I render a rectangle to the screen from units $(-10, -10)$ to $(10, 10)$. The camera always looks at this rectangle, and the rectangle never moves.

For our purposes, fragment shaders work as follows. You're given a screen co-ordinate $(x, y)$ and you're asked to generate a color for that co-ordinate. You're asked this for every pixel and the colors you return end up on screen.

Here's the key: each pixel on screen represents some point in the plane *after* the grid transformation. It could technically represent multiple points, but let's not worry about that for now. For each pixel passed to the fragment shader, we want to find the grid-coordinate that was *transformed to end up at that point*. If the transformed point lay on a grid line, then we should render a grid line. Otherwise we should render white background.

## Some math

All in all, this breaks down to a pretty standard math problem. You have two user-defined equations $f(x, y)$ and $g(x, y)$. Given some point $(x_p, y_p)$ - the point you're rendering on screen - you want to find $x$ and $y$ such that $f(x, y) = x_p$ and $y$ such that $g(x, y) = y_p$ (again, we're ignoring that there are often multiple solutions to this equation).

Another way to write this is by defining $F(x, y) = (f(x, y), g(x, y)) - (x_p, y_p)$ and saying that we want to solve the equation $F(x, y) = \vec 0$.

For our purposes, we don't need to solve it exactly -- it'd be enough to get as close to zero as we can. This is great, because there are well-researched methods for numerically minimizing 2D equations.

A common approach is called Newton's method. Given an initial guess for $(x, y)$, it iteratively transforms it into a better guess.

Specifically, given some guess $\vec x_1 = (x_1, y_1)$ you can generate the second guess $\vec x_2 = (x_2, y_2)$ as follows...

<div>
@
\vec x_2 = \vec x_1 - J^{-1}(\vec x_1) F(\vec x_1)
@
</div>

I start with the guess $(x_p, y_p)$ and run this $60$ times per pixel. This gives me an approximation of the $(x, y)$ co-ordinates that minimize $F$, which are likely my untransformed grid co-ordinates. For many equations, this seems to work!

## Problems

This approach works very well for linear equations. But it runs into issues with non-linear equations. I get weird fractal-like visual bugs in some places that look like this:

<div style="text-align: center;">
  <img style="border: 2px solid #999; width: 284px; height: 284px;" src="/images/grid-transformations/error.png" />
</div>

There are definitely classes of equations which have multiple solutions, and where my optimization strategy will find a local minimum that isn't the one I want. But I don't think that's happening here, because increasing the number of Newton's method iterations fixes the issue. Unfortunately, doing so also makes my fragment shader too slow. My next steps are to investigate methods for solving non-linear equations which converge faster than Newton's method.

THE END! :D

<script>
document.addEventListener('DOMContentLoaded', function () {
  renderMathInElement(document.body, {
    delimiters: [{
        left: "$",
        right: "$",
        display: false
      }, {
        left: "@",
        right: "@",
        display: true,
      }],
  });
});
</script>
