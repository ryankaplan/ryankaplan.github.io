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

What is a Voronoi diagram? Suppose you have a clean, blank canvas. I rudely walk up to it and paint three dots on it: one blue, one red, one purple. Then I ask you to fill in the rest of the canvas - every inch - with the color of the closest dot. That's a Voronoi diagram! You start with a few dots, and then you color in the rest by using the color of the closest dot.

The demo below does just that. You paint the dots on the first canvas, and some code I wrote will fill in the second canvas with a Voronoi diagram. If you're curious, you can find the code  <a target="_blank" href="https://github.com/ryankaplan/gpu-voronoi">here</a>.

<div id="paint-demo-container" style="height: 263px; margin: 40px auto;"></div>

Anyway, Voronoi diagrams can be pretty cool. In the demo below, the first canvas has some yellow dots moving in some blue dots and the second canvas shows the corresponding Voronoi diagram. I like to pretend that it's a yellow fish swimming in water.

You can move your mouse over either canvas to control the fish.

<div id="fish-demo-container" style="height: 263px; margin: 40px auto;"></div>

Okay, I know you're probably getting sick of demos, but here's one more that I think is fun...

In the first canvas there are seeds in a radial pattern overlaid on top of a photo. Each seed takes the color of the underlying pixel in the image. Drag the circle to move the seeds and drag the square to rotate them.

<div id="photo-demo-container" style="height: 263px; margin: 40px auto;"></div>

# How does it work?

If you just want to play with Voronoi diagrams, you can skip to the end of this post. If you wanna know how to generate them really quickly, read on!

The code generating Voronoi diagrams on this page uses an approach called 'Jump Flooding'. It's from a paper called <a href="http://www.comp.nus.edu.sg/~tants/jfa.html" target="_blank">Jump Flooding in GPU with Applications to Voronoi Diagram and Distance Transform</a>. We'll call it JFA because that's a lot to write out.

The input to JFA is a canvas with some colored seeds on it. Since we're dealing with computers, the canvas is an array of pixels.

The algorithm works in "rounds". In a given round you iterate through each pixel in the canvas and look at 8 pixels around it. When I say '8 pixels around it' you're probably thinking of the 8 direct neighbours but THAT'S NOT QUITE RIGHT! When I try to explain this algorithm to friends, this is the main place everyone gets tripped up. So this is a good place to pay attention carefully, I'm going to back-track a bit.

The algorithm works in "rounds". In a given round, you iterate through each pixel in the canvas and look at 8 pixels around it. The 8 pixels that you look at depend on something called the step length, and the step length is different in each round. In round 1, the step length is N / 2 (where N is the width/height of the canvas). In round 2, the step length is N / 4. In step 3, the step length is N / 8, and so on.

The diagram below shows what 'neighbours' we look at when we process each pixel in a round. It uses `k` to represent the step length.

<div style="width: 100%; text-align: center; margin: 40px auto;">
<div style="margin: auto; max-width: 400px;">
<img style="width: 100%; height: 100%;" src="/images/step-k.svg" alt="">
<div>If your step length is 1, then you look at your immediate neighbours. If your step length is 10, then you look 10 pixels in each cardinal and inter-cardinal direction.</div>
</div>
</div>

Every pixel remembers the location - not just the color - of the closest seed that it’s seen so far. When you process a pixel, you compare the location of the seed it remembers (if any) against that of each pixel it visits. If it finds a closer seed, it remembers that instead.

A pixel doesn't need to visit a seed to find out about it. It just needs to visit another pixel that visited it. Or a pixel that visited another pixel that visited it, and so on.

The first round of JFA has step length N / 2, where N is the size of the grid. The next one has step length N / 4. The following has N / 8, and so on until N / k is 1. In total there are log(N) rounds. Below is an interactive demo showing the pattern in which JFA moves through the grid for each round. At each step, it shows the grid cell that we're currently processing and the 8 cells around it that it visits to look for seeds. Use the slider to change which round you're on.

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

*Like thinking about graphics? We’re hiring creative people at <a href="https://www.figma.com/careers" target="_blank">Figma</a> to work on collaborative graphic design tools.*
