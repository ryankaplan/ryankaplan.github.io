---
layout: post
title: "Ray Marching Soft Shadows in 2D"
date: 2020-09-13 00:00:00
summary: I posted a WebGL demo to twitter and it blew up! This post talks about how it works under the hood.
categories:
  - graphics
  - webgl
  - ray marching
---

<style>
.aspect-ratio {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 0;
  padding-bottom: 51%;
  margin-bottom: 36px;
}

.aspect-ratio iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border: none;
}

</style>

A couple of weeks ago I tweeted a video of a toy graphics project (below). It’s not done, but a lot of people liked it which was surprising and fun! A few people asked how it works, so that’s what this post is about.

<div class="aspect-ratio">
  <iframe
    src="https://ray-marching-talk.netlify.app?text=abc&renderMode=ALL&overlay=lightbulb"
    >
  </iframe>
</div>

_Disclaimer: the demos on this page use WebGL features that aren't available on some mobile devices._

Under the hood it uses something called a distance field. A distance field is an image like the one below that tells you how far each pixel is from your shape. Light grey pixels are close to the shape and dark grey pixels are far from it.

<image style="margin-bottom: 20px;" src="/images/ray-marching/distance-field.png"></image>

When the demo starts up, it draws some text on a 2D canvas and generates a distance field of it. It uses [a library I wrote](https://github.com/ryankaplan/gpu-distance-field) that generates distance fields really quickly. If you’re curious how the library works, I wrote about that [here](http://rykap.com/graphics/skew/2016/02/25/voronoi-diagrams/).

Our lighting scheme works like this: when processing a particular pixel we consider a ray from it to the light, like so…

<image style="margin-bottom: 20px;" src="/images/ray-marching/ray-march-1.png"></image>

If the ray intersects a glyph, the pixel we’re shading must be in shadow because there's something between it and the light.

The simplest way to check this would be to move along the ray in 1px increments, starting from the pixel we’re shading and ending at the light, repeatedly asking the distance field if we're distance 0 from a shape. This would work, but it’d be really slow.

We could pick some specific length like 30px and move in increments of that size, but then we risk jumping over glyphs that are smaller than 30px. We might think we’re not in shadow when we should be.

**Ray marching’s core idea is this: the distance field tells you how far you are from the closest glyph. You can safely advance along your ray by that distance without skipping over any glyphs.**

Let’s walk through an example. We start as pictured above and ask the distance field how far we are from any glyph. Turns out in this case that the answer is 95px (pictured left). This means that we can move 95px along our ray without skipping over anything!

<image style="margin-bottom: 20px;" src="/images/ray-marching/ray-march-2.png"></image>

Now we’re a little closer to the light. We repeat the process until we hit the ascender of the b! If the b glyph weren’t there, we’d have kept going until we hit the light.

Below is a demo that shows the ray marching steps for a given pixel. The red box is the pixel we're shading, and each circle along the ray represents a ray marching step and the distance from the scene at that step.

Try dragging the light and the pixel around to build an intuition for it.

<div class="aspect-ratio">
  <iframe
    src="https://ray-marching-talk.netlify.app?text=abc&renderMode=INPUT_CANVAS&overlay=ray"
    >
  </iframe>
</div>

Below is GLSL to implement this technique. It assumes you've defined a function `getDistance` that samples the distance field.

```glsl
vec2 rayOrigin = ...;
vec2 rayDirection = ...;

float rayProgress = 0;
while (true) {
  if (rayProgress > distance(rayOrigin, lightPosition)) {
    // We hit the light! This pixel is not in shadow.
    return 1.;
  }

  float sceneDist = getDistance(
    rayOrigin + rayProgress * rayDirection);
  if (sceneDist <= 0.) {
    // We hit a shape! This pixel is in shadow.
    return 0.;
  }

  rayProgress += sceneDist;
}
```

It turns out that some pixels are really expensive to process. So in practice we use a for-loop instead of a while loop -- that way we bail out if we've done too many steps. A common "slow case" in ray marching is when a ray is parallel to the edge of a shape in the scene...

<div class="aspect-ratio">
  <iframe
    src="https://ray-marching-talk.netlify.app?rect=1&renderMode=INPUT_CANVAS&overlay=ray"
    >
  </iframe>
</div>

The approach I've described so far will get you a scene that looks like the one below.

<div class="aspect-ratio">
  <iframe
    src="https://ray-marching-talk.netlify.app?text=abc&renderMode=HARD_SHADOWS&overlay=lightbulb"
    >
  </iframe>
</div>

It’s cool, but the shadows are sharp which doesn’t look very good. The shadows in the demo look more like this…

<image style="margin-bottom: 20px;" src="/images/ray-marching/desired-shadows.png"></image>

One big disclaimer is that they're not physically realistic! Real shadows look like hard shadows where the edges have been fuzzed. This approach does something slightly different: all pixels that were previously in shadow are still fully in shadow. We've just added a penumbra of partially shaded pixels around them.

The upside is that they're pretty and fast to compute, and that's what I care about! There are three "rules" involved in computing them.

**Rule 1:** The closer a ray gets to intersecting a shape, the more its pixel should be shadowed. In the image below there are two similar rays (their distances to the shape pictured in yellow and green). We want the one that gets closer to touching the corner to be more shadowed.

<image style="margin-bottom: 20px;" src="/images/ray-marching/rule-1.png"></image>

This is cheap to compute because the variable `sceneDist` tells us how far we are from the closest shape at each ray marching step. So the smallest value of `sceneDist` across all steps is a good approximation for the yellow and green lines in the image above.

**Rule 2:** if the pixel we’re shading is far from the point where it almost intersects a shape, we want the shadow to spread out more.

<image style="margin-bottom: 20px;" src="/images/ray-marching/rule-2.png"></image>

Consider two pixels along the ray above. One is closer to the almost-intersection and is lighter (its distance is the green line). The other is farther and darker (its distance is the yellow line). In general: the further a pixel is from its almost intersection, the more "in shadow" we should make it.

This is cheap to compute because the variable `rayProgress` is the length of the green and yellow lines in the image above.

So: we previously returned `1.0` for pixels that weren't in shadow. To implement rules 1 and 2, we compute `sceneDist / rayProgress` on each ray marching step, keep track of its minimum value, and return that instead.

```glsl
vec2 rayOrigin = ...;
vec2 rayDirection = ...;
float rayProgress = 0.;
float stopAt = distance(samplePt, lightPosition);
float lightContribution = 1.;
for (int i = 0; i < 64; i++) {
  if (rayProgress > stopAt) {
    return lightContribution;
  }

  // `getDistance` samples our distance field texture.
  float sceneDist = getDistance(
    rayOrigin + rayProgress * rayDirection);
  if (sceneDist <= 0.) {
    // We hit a shape! This pixel is in shadow.
    return 0.;
  }

  lightContribution = min(
    lightContribution,
    sceneDist / rayProgress
  );

  rayProgress += sceneDist;
}

// Ray-marching took more than 64 steps!
return 0.;
```

This ratio feels kind of magical to me because it doesn't correspond to any physical value. So let's build some intuition for it by thinking through why it might take on particular values...

- If `sceneDist / rayProgress >= 1`, then either `sceneDist` is big or `rayProgress` is small (relative to each other). In the former case we're far from any shapes and we shouldn't be in shadow, so a light value of `1` makes sense. In the latter case, the pixel we're shadowing is really close to an object casting a shadow and the shadow isn't fuzzy yet, so a light value of `1` makes sense.

- The ratio is `0` only when `sceneDist` is `0`. This corresponds to rays that intersect an object and whose pixels are in shadow.

And here's a demo of what we have so far...

<div class="aspect-ratio">
  <iframe
    src="https://ray-marching-talk.netlify.app?text=abc&renderMode=SOFT_SHADOWS_2&overlay=lightbulb"
    >
  </iframe>
</div>

**Rule #3** is the most straightforward one: light gets weaker the further you get from it.

Instead of returning the minimum value of `sceneDist / rayProgress` verbatim, we multiply it by a `distanceFactor` which is `1` right next to the light, `0` far away from it, and gets quadratically smaller as you move away from it.

All together, the code for the approach so far looks like this...

```glsl
vec2 rayOrigin = ...;
vec2 rayDirection = ...;
float rayProgress = 0.;
float stopAt = distance(samplePt, lightPosition);
float lightContribution = 1.;
for (int i = 0; i < 64; i++) {
  if (rayProgress > stopAt) {
    // We hit the light!
    float LIGHT_RADIUS_PX = 800.;

    // fadeRatio is 1.0 next to the light and 0. at
    // LIGHT_RADIUS_PX away.
    float fadeRatio =
      1.0 - clamp(stopAt / LIGHT_RADIUS_PX, 0., 1.);

    // We'd like the light to fade off quadratically instead of
    // linearly.
    float distanceFactor = pow(fadeRatio, 2.);
    return lightContribution * distanceFactor;
  }

  // `getDistance` samples our distance field texture.
  float sceneDist = getDistance(rayOrigin + rayProgress * rayDirection);
  if (sceneDist <= 0.) {
    // We hit a shape! This pixel is in shadow.
    return 0.;
  }

  lightContribution = min(
    lightContribution,
    sceneDist / rayProgress
  );

  rayProgress += sceneDist;
}

// Ray-marching took more than 64 steps!
return 0.;
```

I forget where I found this soft-shadow technique, but I definitely didn’t invent it. Inigo Quilez [has a great post on it](https://www.iquilezles.org/www/articles/rmshadows/rmshadows.htm) where he talks about using it in 3D.

Inigo's post also talks about a gotcha with this approach that you might have noticed in the demos above: it causes banding artifacts. This is because Rule 1 assumes that the smallest value of `sceneDist` across all steps is a good approximation for the distance from a ray to the scene. This is not always true because we sometimes take very few ray marching steps.

So in my demo I use an improved approximation that Inigo writes about in his post. I also use another trick that is more effective but less performant: instead of advancing by `sceneDist` on each ray marching step, I advance by something like `sceneDist * randomJitter` where `randomJitter` is between `0` and `1`.

This improves the approximation because we're adding more steps to our ray march. But we could do that by advancing by `sceneDist * .3`. The random jitter ensures that pixels next to each other don't end up in the same band. This makes the result a little grainy which isn't great. But I think looks better than banding... This is an aspect of the demo that I'm still not satisfied with, so if you have ideas for how to improve it please tell me!

Overall my demo has a few extra tweaks that I might write about in future but this is the core of it. Thanks for reading! If you have questions or comments, let me know [on Twitter](https://twitter.com/ryanjkaplan).

_Thank you to Jessica Liu, Susan Wang, Matt Nichols and Kenrick Rilee for giving feedback on early drafts of this post! Also, if you enjoyed this post you might enjoy working with me at [Figma](https://www.figma.com/careers/)!_
