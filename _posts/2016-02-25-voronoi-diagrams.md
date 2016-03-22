---
layout: post
title:  "Voronoi Diagrams on the GPU"
date:   2016-02-25 23:26:26
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

What is a Voronoi diagram? Try the demo below to find out. When you click in the first canvas, you plant a colored 'seed'. In the second canvas, every pixel takes the color of the closest seed. You can drag to plant lots of seeds.

<div id="paint-demo-container"></div>

Demo #2: the first canvas displays a few moving dots. The second canvas shows the corresponding Voronoi diagram. Move your mouse over either canvas to control the location of the yellow dot. I like to pretend that it's a yellow fish swimming in water.

<div id="fish-demo-container"></div>

Here's one more demo that I think is fun. In the first canvas there are seeds in a radial pattern overlaid on top of a photo. Each seed takes the color of the underlying pixel in the image. Move the circular handle to move the seeds and move the square handle to rotate them.

<div id="photo-demo-container"></div>

# How does it work?

There are a few popular algorithms for computing Voronoi diagrams. I'll talk about the one that I used to build the demos above (you can find the code for them <a target="_blank" href="https://github.com/ryankaplan/gpu-voronoi">here</a>). The approach is from a paper called <a href="http://www.comp.nus.edu.sg/~tants/jfa.html" target="_blank">Jump Flooding in GPU with Applications to Voronoi Diagram and Distance Transform</a>. We'll call it JFA - short for Jump Flooding Algorithm.

The input to JFA is a blank background with some colored seeds on it (like in the first demo above). You iterate over the image in *rounds*, each with a *step length*, k. In a given round you iterate through each pixel (i, j) and look at 8 pixels around it. The 8 pixels that you look at aren't the immediate neighbours. They depend on the step length of the round that you're in. If your round has step length k, then you look at nearby pixels in the pattern shown in the diagram below.

<div style="width: 100%; text-align: center; margin: 40px auto;">
<div style="margin: auto; max-width: 400px;">
<img style="width: 100%; height: 100%;" src="/images/step-k.svg" alt="">
<div>For each pixel that you process, you look for seeds in each cardinal and intercardinal direction.</div>
</div>
</div>

If your round has step length 1, then you look at your immediate neighbours. But if your step length is 10, then you look 10 pixels North, North-West, West, South-West, etc.

At each stage of JFA, each pixel remembers the location of the closest seed that it's seen so far. In each round, it compares the location of the closest seed its found so far against that of each pixel it visits. That way a pixel doesn't need to visit a nearby seed to find out about it - it just needs to visit another pixel that is also close to that seed.

The first round of JFA has step length N / 2, where N is the size of the grid. The next one has step length N / 4. The following has N / 8, and so on until N / k is 1. In total there are log(N) rounds. Below is an interactive demo showing the pattern in which JFA moves through the grid for each round. At each step, it shows the grid cell that we're currently processing and the 8 cells around it that it visits to look for seeds. Use the slider to change which round you're on.

<div id="jfa-pattern-demo-container"></div>

To summarize, JFA works as follows: you walk through every pixel in the grid log(N) times. The first time, you look for seeds in the 8 'neighbours' roughly N / 2 pixels away from the current pixel. The next round you look at the neighbours roughly N / 4 pixels away, and so on. Every pixel holds on to the closest seed that it's found so far and during the course of the algorithm passes that information on to other cells in the grid.

It's interesting to see what the JFA grid looks like at the end of each round. Below is a demo like the one at the top of the page, except there's a slider to set the maximum JFA round number. If you set it to 5, then we stop computing JFA at round 5 and show the result in the second canvas. Try adding a few seeds and moving the slider slowly from round 0 to see what JFA does at each step. I find it really interesting how it all comes together in the last two steps -- before that it doesn't look much like a Voronoi diagram at all.

<div id="slider-demo-container"></div>

# Distance fields

JFA gives us two things for every pixel: the color of the closest seed (which we used above to draw Voronoi diagrams) and the location of the closest seed. To demonstrate the latter, here's the same 'fish' simulation as above except we're coloring pixels by how close they are to their closest seed. Light pixels are close to a seed and dark pixels are far from one.

<div id="distance-demo-container" ></div>

<a target="_blank" href="https://github.com/evanw">Evan Wallace</a> gave me the idea to use this to render 2D drop shadows on the GPU. One of the tricky parts of rendering CSS drop shadows is that they have a 'spread' value. The bigger the spread, the farther the shadow reaches before fading out. This means that you can't implement a drop shadow just by blurring the shape casting the shadow.

So how does it work? We render the shape that we want to cast a shadow (in the example below its the text 'Voronoi') and we treat each rendered pixel as a seed for JFA. Then we run JFA, which gives us the distance from every pixel in the image to some pixel in the shape. This is exactly what we need to render a drop shadow with spread: pixels close to the shape are in shadow and pixels far from the shape are not.

<div id="shadow-demo-container"></div>

You can drag the canvas above the move the drop shadow, or use the sliders to control spread and blur.

