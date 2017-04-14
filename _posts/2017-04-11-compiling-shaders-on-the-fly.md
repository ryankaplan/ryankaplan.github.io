---
layout: post
title: Building a fast Equation Grapher (Part I)
date:   2017-04-11 00:00:00
summary: To let you manipulate math equations in real time, I needed to generate WebGL shaders at run-time based on user-input. This is how I did it.
categories:
 - math
 - computer graphics
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" integrity="sha384-wITovz90syo1dJWVh32uuETPVEtGigN07tkttEqPv+uR2SE/mbQcG7ATL28aI9H0" crossorigin="anonymous">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js" integrity="sha384-/y1Nn9+QQAipbNQWU65krzJralCnuOasHncUFXGkdwntGeSvQicrYkiUBwsgUqc1" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js" integrity="sha384-dq1/gEHSxPZQ7DdrM82ID4YVol9BYyU7GbWlIwnwyPzotpoc57wDw/guX8EaYGPx" crossorigin="anonymous"></script>
<style>
.gifContainer, .imgContainer {
  text-align: center;
  margin-bottom: 20px;
}

.gifContainer a, .imgContainer a {
  text-decoration: none;
}

.gifContainer img {
  border: 1px solid #999;
  border-radius: 3px;
  margin-bottom: 20px;
}
</style>

<!-- Something I've been meaning to do is graph the time it takes to (a) iterate through all vertices in a finely divided plane (b) to generate a -->

Disclaimer: I'm not a computer graphics pro, and there are many people (some of whom I work with) who know much more about this stuff than I do. If you're one of them, and you find mistakes in this article, <a href="https://twitter.com/ryanjkaplan" target="_blank">lemme know!</a>

---

I've been working on something called <a href="https://curvegrapher.com" target="_blank">Curve Grapher</a>. It's a webpage that renders graphs of math equations, like $z = sin(x) cos(y)$.

One feature I'm proud of is that you can give it an equation like $z = sin(p x) cos(p y)$ and it'll recognize that $p$ isn't a co-ordinate. It'll treat it as a variable and give you a slider to change its value.

Here's a screenshot of what I mean...


<div class="gifContainer">
  <a href="https://www.curvegrapher.com/#v=0&eq=z%20%3D%20sin(p%20x)%20cos(p%20y)&hi=0&va=p~1.00~0.00~1.00~0&c=3.61%2C13.20%2C17.95%7D&l=0.00~1.00~0.00~1.00" target="_blank">
    <img src="/images/compiling-shaders/wave.gif" />
  </a>
</div>

This post is a high level overview of how this works. My solution involves parsing the equation and using it to generate a vertex shader at run-time (I'll explain what a vertex shader is later). This project involved a few other challenges as well. Figuring out how to render implicit 3D graphs like <a href="https://www.curvegrapher.com/#v=0&eq=sin(x)%20%3D%20cos(y)%20-%20sin(z)&hi=0&va=&c=15.14%2C14.91%2C19.98%7D&l=0.00~1.00~0.00~1.00" target="_blank">$sin(x) = cos(y) - sin(z)$</a> was really fun. I hope to write more about that later.

## High level approach

At first I tried something like <a href="https://stemkoski.github.io/Three.js/Graphulus-Function.html" target="_blank">this THREE.js demo</a> by Lee Stemkoski. In it, the author creates a triangle mesh and - in Javascript - positions the vertices of the mesh according to the user's equation. THREE.js has a nice wrapper for this logic called `ParametricGeometry`.

Whenever you change the equation, or the value of a variable like $p$, the demo iterates over all vertices of the mesh (in Javascript) and repositions them. It works well. But for fine meshes, which are necessary for smooth-looking graphs, it's prohibitively slow. When I implemented it, moving the slider for $p$ felt really jaggy and I wanted something faster.

The approach I ended up using is as follows.

 - We create a scene with one object in it: a finely divided flat plane (the plane goes from $(-10, -10)$ to $(10, 10)$ and all its z-values are $0$).
 - We transform the user's equation into a vertex shader that sets the $z$ position of each vertex in the plane. A vertex shader is a piece of code that runs on the GPU and positions vertices before they are rendered. This is really fast because vertex shaders run mostly in parallel for each vertex in your scene.
 - Variables like $p$ in the example above are passed to the shader from Javascript via something called a uniform (more on what that is later).

## Transforming user-input into shaders

Shaders are written in a language called GLSL and are pieces of code that run on the GPU. In WebGL applications, they're often represented as a Javascript string that is passed to WebGL once the page loads.

Passing a new shader to WebGL is surprisingly fast. You can do it in the time between two frames of your computer screen being renderered (and have time to spare!)

An examples of a really common WebGL shader is below. If it looks intimidating to you, feel free to skim it. You don't need to understand it in detail right now.

~~~glsl
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void myVertexShader() {
  // gl_Position is a special variable to which
  // we assign the output, position. You can
  // think of it as the return value of this
  // function.
  gl_Position = (
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.)
  );
}
~~~

To many people this looks like complex hokey pokey. This is what you need to know:

 - This shader is 'standard' in the sense that it'll render vertices to screen 'in the right place'. If I use it to render a flat plane from $(-10, -10)$ to $(10, 10)$, the rendered image will look like a flat plane from $(-10, -10)$ to $(10, 10)$:

<div class="imgContainer">
  <img src="/images/compiling-shaders/flat.png" />
</div>

 - It uses a variable declared as `attribute vec position`. This is the position of the vertex that is currently being processed. The position is an `attribute` of the vertex, assigned by Javascript code. Since we're rendering a flat plane, `position.z` will be zero for all vertices. `position.x` and `position.y` will range from $-10$ to $10$.

We want to modify this shader so that where ever it currently uses `position`, it uses a copy of `position` with the z-value set according to the users equation. The way we'll do that is as follows: when a user types in an equation like $z = sin(x p) cos(y p)$, we'll generate a shader like this one:

~~~glsl
// These are the same as before.
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

// This holds the user-defined value of the
// variable p
uniform float var_p;

vec3 userDefinedPosition() {
  float x = position.x;
  float y = position.y;
  return vec3(x, y, sin(x * var_p) * cos(y * var_p));
}

void myVertexShader() {
  gl_Position = (
    projectionMatrix *
    modelViewMatrix *
    vec4(userDefinedPosition(), 1.)
  );
}
~~~

This shader uses something called `userDefinedPosition()` instead of `position`. `userDefinedPosition()` is a function that we generated based on user input, and it returns a vector like `position` except its z-value has been set according to the user's equation.

If it seems weird to you that we're generating code while the application is running, you're not alone. But it works! WebGL shaders can be defined at run-time and you can pass new ones to WebGL pretty much any time you like.

Here's a new, important, piece of information you need. The code above declares a variable called `var_p` and it's marked as a `uniform`. A uniform is a variable that's passed from Javascript to a shader. It's called a `uniform` because its value stays the same for each invocation of the shader in a given render.

The variable $p$ in the user's equation is represented as a uniform. That means that we can update its value from Javascript without having to generate an entirely new shader.

<!-- TODO(ryan): say more about this and how setting a uniform is much faster than generating a shader -->

Most of the shader above is boilerplate. We'll have solved our problem if we can turn the user-defined equation into...

 - A list of uniforms for variables, like `uniform float var_p;`
 - An expression for the z-value of a vertex, like `sin(x * var_p) * cos(y * var_p)`

The rest of the shader above could be a template string into which we splice the uniforms and z-position expression.

## Parsing

A parser is software that takes in some piece of code and turns it into something called an Abstract Syntax Tree (AST). For example, it might take an expression like $z = sin(x p) cos(y p)$ and turn it into this:

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/ast.svg" />
</div>

In our AST, each node node represents...

 - a variable like $x$, $y$, or $p$
 - an operator like $+$, $*$ or $=$
 - a function call ($\sin$, $\cos$)

What makes this data structure useful to us is that it removes many language specific details from your code. You could imagine inspecting the abstract syntax above and writing Java code that represents it, or C++, or python, etc. In my case, it helped me translate the user defined equation into GLSL (the programming language for code that runs on the GPU).

In code, the `y * p` part of this tree (in the bottom right) might be represented by an object like this...

~~~js
const node = {
  // Each node has a type.
  type: 'TIMES',

  // children is an array of
  // nodes .
  children: [{
    type: 'VARIABLE',
    name: 'y',
    children: [],
  }, {
    type: 'VARIABLE',
    name: 'p',
    children: [],
  }]
}
~~~

In general, each node of the tree would have a type and one or more children, along with a name if you're of type `VARIABLE`.

There are many good open-source parsers online. And it would have been faster for me to find one online and use it. But I've felt for a while that parsing and compiler technology are out of my reach (I didn't learn about either in college) and I wanted to stop feeling that way. So I decided to try to build one myself.

My first step in doing this was finding an open source project that (a) uses a parser and (b) isn't crazy advanced. I poked around in the source code of <a href="https://github.com/evanw/glslx" target="_blank">GLSLX</a>, a GLSL type checker. I use GLSLX all the time, so I found it approachable. Most of my time was spent changing small parts of its parser and seeing how it changed its input/output.

GLSLX uses a technique called Pratt Parsing to parse GLSL. The name is intimidating, but <a href="http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank">this article</a> really helped me understand it. I won't go into the details here - the article does a far better job than I would - but helped me write one myself. Maybe it'll help you too.

The next step in our process is turning an AST into GLSL code.

## GLSL generation

Once we have an AST, the goal is to...

 - Find variables that aren't co-ordinates, so that we can generate uniform defintions like `uniform float var_p;`
 - Generate an expression like `sin(x * var_p) * cos(y * var_p)` to get the z-positions of our grid

To solve the first task, you can do a depth first search on nodes in your AST and return all nodes of type `VARIABLE` whose names aren't `x` or `y`.

To solve the second task, you'd have a function that takes in a tree and returns a string that represents that AST in GLSL. Here's a sparse example of what that function might look like:

~~~js
function toGLSL(node) {
  if (node.type === 'PLUS') {
    return (
      toGLSL(node.children[0]) +
      ' + ' +
      toGLSL(node.children[1])
    );

  } else if (...) {
    ...

  } else if (node.type === 'VARIABLE') {
    if (node.name === 'x' || node.name === 'y') {
      return node.name;
    }

    // This is a variable like p
    return 'var_' + node.name;

  } else if (node.type === 'FUNCTION_CALL') {
    return (
      node.name +
      // children are arguments to the function
      '(' + node.children.map(toGLSL).join(', ') + ')'
    );

  } ...
}
~~~

This code is very simplified, but hopefully you get the idea.

In summary: if the user-input is $z = sin(x p) cos(y p)$, we should generate the following AST...

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/ast.svg" />
</div>

... which should generate the GLSL `z = sin(x * p) + cos(y * p)`. We splice this into a template string to generate the desired vertex shader above, and tell WebGL to use that vertex shader when rendering the mesh.

## Conclusion

A lot of the fun of working with WebGL is in finding ways to do things which are usually slow (like positioning thousands of vertices) in parallel on the GPU. In this article, I explained how you can achieve real-time manipulable graphs by positioning that graph's vertices on the GPU instead of with Javascript. Hopefully it was helpful! If you have thoughts or comments, let me know below. Also, as a thank you for reading, here is a cool graph :D

<div class="gifContainer">
  <a href="https://www.curvegrapher.com/#v=0&eq=z%20%3D%20sin(atan(sin(x)%20cos(y)%20p))&hi=0&va=p~2.24~-3.00~3.00~0&c=-9.60%2C11.93%2C10.18%7D&l=0.00~1.00~0.00~1.00" target="_blank" style="text-align: center; text-decoration: none;">
    <img src="/images/compiling-shaders/cool.gif" />
  </a>
</div>

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
