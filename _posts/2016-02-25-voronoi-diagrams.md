---
layout: post
title:  "Voronoi Diagrams on the GPU"
date:   2016-02-25 23:26:26
summary: I implemented a method of generating Voronoi diagrams on the GPU. It runs in real time with WebGL. Play with some fun demos, or read an explanation of how it works.
categories:
 - graphics
 - skew
---

<link rel="stylesheet" href="/submodules/gpu-voronoi/www/nouislider.css" type="text/css">
<script type="text/javascript" src="/submodules/gpu-voronoi/www/nouislider.min.js"></script>
<script type="text/javascript" src="/compiled/voronoi-demo.js" ></script>

---

*Disclaimer: the demos on this page use WebGL features that aren't available on many mobile devices. For the best experience, read this on a Desktop computer.*

---

What is a Voronoi diagram? Suppose you have a clean, blank canvas. I rudely paint three dots on it: one blue, one red, one purple. Then I ask you to paint the rest of the canvas by painting 1mm by 1mm squares at a time. Before you color each square, you find the closest dot that I painted and you use that dot's color to fill in the square. What you'd end up with is a Voronoi diagram!

The demo below does just that. You paint the dots on the first canvas, and this webpage will fill in the second canvas with a Voronoi diagram. If you're curious, you can find the code  <a target="_blank" href="https://github.com/ryankaplan/gpu-voronoi">here</a>.

<div id="paint-demo-container" style="height: 263px; margin: 40px auto;"></div>

The rest of this section gives a few more demos of Voronoi diagrams. Afterward, I explain how the code on this webpage is generating them. You can skip ahead if you like!

In the demo below, the first canvas has a yellow dot moving in a sea of blue dots. The second canvas shows the corresponding Voronoi diagram. I like to pretend that it's a yellow fish swimming in water.

You can move your mouse over either canvas to control the fish.

<div id="fish-demo-container" style="height: 263px; margin: 40px auto;"></div>

In the first canvas below there are dots in a radial pattern overlaid on top of a photo. Each dot takes the color of the underlying pixel in the image. Drag the circle to move the dots and drag the square to rotate them.

<div id="photo-demo-container" style="height: 263px; margin: 40px auto;"></div>

# How does it work?

If you just want to play with Voronoi diagrams, you can skip to the end of this post. If you wanna know how to generate them really quickly, read on!

The Voronoi diagrams on this page are generated using an approach called 'Jump Flooding'. It's from a paper called <a href="http://www.comp.nus.edu.sg/~tants/jfa.html" target="_blank">Jump Flooding in GPU with Applications to Voronoi Diagram and Distance Transform</a>. We'll call it JFA because that's a lot to write out.

The input to JFA is a canvas with some colored seeds (aka dots) on it. Since we're dealing with computers, the canvas is an array of transparent pixels and the dots are pixels with color.

The algorithm works in "rounds". In a given round you iterate through each pixel in the canvas and look at 8 pixels around it. When I say '8 pixels around it' you're probably thinking of the 8 direct neighbours but THAT'S NOT QUITE RIGHT! When I explain this algorithm to friends, this is the main place they get tripped up. I'll explain this in detail later, but for now just know that...

 - the algorithm works in 'rounds'
 - in each round, you visit each pixel in the grid
 - when visiting a pixel, you look at SOME 8 pixels around it, but not its direct neighbours

Suppose you're in round 1, you're processing a pixel at location (i, j), and you're busy visiting 8 pixels around it. This is what you do at each pixel: if you see a seed closer to (i, j) than one you've seen before, you store its color and location. Also if you visit a non-seed that's seen a nearby seed which is closer than one you've seen before - you store that seed's color and location.

Here's the second thing almost everyone finds tricky in this algorithm: a pixel doesn't need to visit a seed to find out about it. It just needs to visit another pixel that visited it. Or a pixel that visited another pixel that visited it, and so on.

Take a second to make sure you understand that! Next, I'll talk about how many rounds there are, and what the '8 surrounding pixels' are.

First, I'm going to define something called 'step length'. 'Step length' is a number associated with each round. It starts off as half the size of the board (N / 2) and divides by two each round. We'll use the letter `k` to represent step length in diagrams below.

The 8 'neighbours' that you visit around each pixel depend on the step length. They are the 8 pixels `k` to the left, `k` to the right, `k` up, `k` down, etc. as shown in this diagram:

<div style="width: 100%; text-align: center; margin: 40px auto;">
<div style="margin: auto; max-width: 400px;">
<img style="width: 100%; height: 100%;" src="/images/step-k.svg" alt="">
<div>If your step length is 1, then you look at your immediate neighbours. If your step length is 10, then you look 10 pixels in each cardinal and inter-cardinal direction.</div>
</div>
</div>

Below is an interactive demo showing the pattern in which JFA moves through the grid for each round. At each step, it shows the grid cell that we're currently processing and the 8 cells around it that it visits to look for seeds. Use the slider to change which round you're on.

<div id="jfa-pattern-demo-container" style="height: 357px; margin: 40px auto;"></div>

To summarize, JFA works as follows: you walk through every pixel in the grid log(N) times. The first time, you look for seeds in the 8 'neighbours' roughly N / 2 pixels away from the current pixel. The next round you look at the neighbours roughly N / 4 pixels away, and so on. Every pixel holds on to the closest seed that it's found so far and during the course of the algorithm passes that information on to other cells in the grid.

Sometimes you'll give JFA a set of input seeds and it'll produce a subtly wrong result. I won't go into the details of how that happens (<a href="http://www.comp.nus.edu.sg/~tants/jfa/i3d06.pdf" target="_blank">the paper</a> discusses it in sections 5 and 6). I'm bringing it up only so that you don't feel bad for not seeing how the algorithm is totally correct - it's not. But it works well most of the time, like for the demos on this page.

It's interesting to see what the JFA grid looks like at the end of each round. Below is a demo like the one at the top of the page, except there's a slider to set the maximum JFA round number. If you set it to 5, then we stop computing JFA at round 5 and show the result in the second canvas. Try adding a few seeds and moving the slider slowly from round 0 to see what JFA does at each step. I find it really interesting how it all comes together in the last two steps -- before that it doesn't look much like a Voronoi diagram at all.

<div id="slider-demo-container" style="height: 330px; margin: 40px auto;"></div>

# Distance fields

JFA gives us two things for every pixel: the color of the closest seed (which we used above to draw Voronoi diagrams) and the location of the closest seed. To demonstrate the latter, here's the same 'fish' simulation as above except we're coloring pixels by how close they are to their closest seed. Light pixels are close to a seed and dark pixels are far from one.

<div id="distance-demo-container" style="height: 263px; margin: 40px auto;"></div>

<a target="_blank" href="https://github.com/evanw">Evan Wallace</a> gave me the idea to use this to render 2D drop shadows on the GPU. One of the tricky parts of rendering CSS drop shadows is that they have a 'spread' value. The bigger the spread, the farther the shadow reaches before fading out. This means that you can't implement a drop shadow just by blurring the shape casting the shadow.

So how does it work? We render the shape that we want to cast a shadow (in the example below its the text 'Voronoi') and we treat each rendered pixel as a seed for JFA. Then we run JFA, which gives us the distance from every pixel in the image to some pixel in the shape. This is exactly what we need to render a drop shadow with spread: pixels close to the shape are in shadow and pixels far from the shape are not.

<div id="shadow-demo-container" style="height: 357px; margin: 40px auto;"></div>

You can drag the canvas above the move the drop shadow, or use the sliders to control spread and blur.

# So... where's the GPU?

JFA runs in 'constant time' in the sense that it doesn't get slower with more seeds. But that doesn't fully explain why it's fast. When you run JFA on a 512px by 512px image it processes each pixel (i.e. checks its neighbours for seeds) more than 2 million times. If you implement that naively in Javascript, it's going to be too slow to compute on every frame of an interactive demo.

What makes JFA efficient is that it's really well suited to being run on the GPU. So the 2 million computations are done mostly in parallel. I just got started with WebGL, so I'm not confident giving a deep dive on how that works. I might do a follow up post once I learn more. If you're curious in the mean time, <a href="http://nullprogram.com/blog/2014/06/10" target="_blank">this article by Chris Wellons</a> is a great, detailed, explanation of how to build Conway's Game of Life on the GPU. It's a similar problem and if you understand that post you'll be on your way to understanding why JFA is fast.

Thanks for making it this far in the post! As a reward, here's one more demo. The first canvas shows two grids of dots. One of them is moving toward the bottom right. The second canvas shows the corresponding Voronoi diagram. Click and drag on either canvas to control the position of the moving grid.

<div id="grid-demo-container" style="height: 263px; margin: 40px auto;"></div>

---

*Interested in more posts like this one? <a href="https://twitter.com/ryanjkaplan" target="_blank">Follow me on Twitter!</a>*