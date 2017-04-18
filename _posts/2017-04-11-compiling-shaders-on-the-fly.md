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

  /* The Pixyll theme adds a weird image underline to
     everything inside an anchor tag that is hovered */
  background-image: none;
}

.gifContainer img {
  border: 1px solid #999;
  border-radius: 3px;
  margin-bottom: 20px;
}
</style>

<!-- Something I've been meaning to do is graph the time it takes to (a) iterate through all vertices in a finely divided plane (b) to generate a -->

I've been working on something called <a href="https://curvegrapher.com" target="_blank">Curve Grapher</a>. It's a webpage that renders graphs of math equations, like $z = sin(x) cos(y)$.

<div class="gifContainer">
  <a href="https://www.curvegrapher.com/#v=0&eq=z%20%3D%20sin(p%20x)%20cos(p%20y)&hi=0&va=p~1.00~0.00~1.00~0&c=3.61%2C13.20%2C17.95%7D&l=0.00~1.00~0.00~1.00" target="_blank">
    <img src="/images/compiling-shaders/wave.gif" />
  </a>
</div>


You can give it an equation like $z = sin(x p) cos(y p)$ and it'll recognize that $p$ isn't a co-ordinate. It'll treat it as a variable and give you a slider to change its value and update the graph in real time!

This post is a high level overview of how this works. My first attempt at building it was too slow. I'll talk about the current version which is much faster, and some of what I learned building it.

Lastly, this post is about rendering explicit 3D equations (equations where the right hand size depends only on $x$ and $y$, like $z = x + sin(y)$). Curve Grapher also renders implicit 2D and 3D equations, like <a href="https://www.curvegrapher.com/#v=0&eq=sin(x)%20%3D%20cos(y)%20-%20sin(z)&hi=0&va=&c=15.14%2C14.91%2C19.98%7D&l=0.00~1.00~0.00~1.00" target="_blank">$sin(x) = cos(y) - sin(z)$</a>. I hope to write more about that later.

## High level approach

The high level API of THREE.js (and many graphics engines) is that you tell it to render a collection of triangles in 3D, and it does it. You position a triangle by telling THREE.js where each of its vertices are.

When a collection of triangles form something cohesive, like a 3D graph, we often refer to that collection as a 'mesh'.

My first approach to building an equation grapher was something like <a href="https://stemkoski.github.io/Three.js/Graphulus-Function.html" target="_blank">this THREE.js demo</a>. In it, the author creates a triangle mesh and - in Javascript - positions the vertices of the mesh according to the user's equation. THREE.js has a nice wrapper for this logic called `ParametricGeometry`.

When you change the equation, you have to update all the vertex positions. To do this, the demo iterates over all vertices (in Javascript) and repositions them. It works well. But for fine meshes, it's prohibitively slow. When I implemented my grapher this way, moving a variable slider felt really jaggy and I wanted something faster.

The approach I ended up using is as follows.

 - We create a scene with one mesh: a flat plane. Instead of positioning the vertices according to the user's equation, we position them in the range $(-10, -10)$ to $(10, 10)$ and set all their z-values to $0.$
 - We use the user's equation to generate a vertex shader that sets the $z$ position of each vertex in the plane. A vertex shader is a piece of code that runs on the GPU and positions vertices before they are rendered. Vertex shaders are run mostly in parallel on the GPU, so setting vertex positions this way is really fast.
 - Variables like $p$ in the example above are passed to the shader from Javascript via something called a uniform (I'll say more about what that is later).

To illustrate how much faster this approach is than setting vertex positions in Javascript, here's a graph of how long it takes each approach to prepare to render the equation $z = sin(x p) cos(y p)$ on a mesh with 40 000 vertices:

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/timing.svg" />
</div>

This is just one sample on my laptop. It's not exactly scientific, but it should still be convincing to you. $397ms$ is _way_ too slow to feel interactive. The approach I talk about in this post is fast enough to make slider manipulation feel smooth.

## Transforming user-input into shaders

WebGL Shaders are pieces of code written in a language called GLSL. Unlike the Javascript code running on this webpage, they run on the GPU. In WebGL applications, they start out as strings in Javascript and are passed to the GPU after you call the WebGL function `gl.shaderSource` and pass it the shader code.

Passing a new shader to WebGL is surprisingly fast. You can do it in the time between two frames of your computer screen being renderered (and have time to spare!) There are <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=113009" target="_blank">some exceptions on Windows</a>, but that hasn't been a problem for me in practice.

An example of a really common WebGL shader is below. If it looks intimidating to you, feel free to skim it. You don't need to understand it in detail right now.

~~~glsl
// These variables are passed to the shader
// from Javascript code. More on that below.
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void myVertexShader() {
  // We assign the final vertex position to
  // gl_Position. gl_Position is a magical
  // variable that you can think of as the
  // return value of this function.
  gl_Position = (
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.)
  );
}
~~~

For now, there are two things you need to know about this code.

The first is that this shader is "standard". I feel bad saying that because it contains what I'm sure looks like complex hokey pokey. It's _standard_ in the sense that it'll render vertices to your screen in the right place. If I use it to render a flat plane from $(-10, -10)$ to $(10, 10)$, the rendered image will look like a flat plane from $(-10, -10)$ to $(10, 10)$:

<div class="imgContainer">
  <img src="/images/compiling-shaders/flat.png" />
</div>

The second important thing to know is that it uses a variable declared as `attribute vec3 position`. Vertex shaders are run on the GPU in parallel. Each time the function in the shader is invoked, it's for a new vertex. The `position` variable holds the position of the vertex being processed.

The `attribute` keyword before the declaration of `position` says that it was assigned to the triangle mesh by our Javascript code before the scene was rendered. Since we're rendering a flat plane, `position.z` will be zero for all vertices. `position.x` and `position.y` will range from $-10$ to $10$.

Suppose we change this shader so that, instead of rendering a flat plane, it renders the graph of $z = sin(x p) cos(y p)$. Here's what it might look like:

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

This shader uses a function called `userDefinedPosition()` instead of `position`. `userDefinedPosition()` is generated based on user input, and it returns a vector like `position` except its z-value has been set according to the user's equation.

Here's a new, important, piece of information: the code above declares a variable called `var_p` and it's marked as a `uniform`. A uniform is a variable that's passed from Javascript to a shader. It's called a `uniform` because its value stays the same for each vertex processed by the shader.

Because the variable $p$ in the user's equation is represented as a uniform, we can update its value from Javascript without generating a new shader.

<!-- TODO(ryan): say more about this and how setting a uniform is much faster than generating a shader -->

Most of the shader above is boilerplate. We'll have solved our problem if we can turn the user-defined equation into...

 - A list of uniforms for variables, like `uniform float var_p;`
 - An expression for the z-value of a vertex, like `sin(x * var_p) * cos(y * var_p)`

The rest of the shader above could be a template string into which we splice the uniforms and z-position expression. Then, whenever a user enters a new equation, we can generate a new shader and pass that to WebGL.

If it seems weird to you that we're generating code while the application is running, you're not alone. But it works! WebGL shaders can be defined at run-time and you can pass new ones to WebGL pretty much any time you like.

## Parsing

A parser is a piece of code that takes some other piece of code as input and spits out something called an Abstract Syntax Tree (AST). As an example, it might take an expression like $z = sin(x p) cos(y p)$ and turn it into this:

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/ast.svg" />
</div>

Each node in this AST represents one of the following...

 - a variable like $x$, $y$, or $p$
 - an operator like $+$, $*$ or $=$
 - a function call ($\sin$, $\cos$)

What makes this data structure useful to us is that it removes many language specific details from your code. You could imagine inspecting the tree above and writing Java code that represents it, or C++, or python, etc. In my case, it helped me translate the user defined equation into GLSL (the programming language for code that runs on the GPU).

In code, the `y * p` part of this tree (in the bottom right) might be represented by a Javascript object like this...

~~~js
const node = {
  // Each node has a type.
  type: 'TIMES',

  // children is an array of
  // nodes.
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

Each node of the tree has a type and a list of children (which might be empty). Nodes that represent variables like $x$ and $p$ have type `VARIABLE`, in which case they have a name attribute as well.

There are many good open-source equation parsers online. But I've felt for a while that parsing and compiler technology is out of reach, and in an attempt to stop feeling that way I decided to build my own. My parser uses a technique called Pratt Parsing. If you're interested in learning more about it, I highly this article <a href="http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank">this article</a>. I also found it helpful to read the source code for <a href="https://github.com/evanw/glslx" target="_blank">GLSLX</a>, a GLSL type checker. It uses a Pratt Parser to parse expressions in GLSL code.

My parser gave me a way to turn the user's equation into an AST. The next step in our process is turning an AST into GLSL code.

## GLSL generation

Given an AST, we want to...

 - Find variables that aren't co-ordinates, so that we can generate uniform declarations for them (like `uniform float var_p;`) and so that we can show sliders for them in the UI.
 - Generate a string containing GLSL code that computes the right hand side of the user's equation. In our example this is `sin(x * var_p) * cos(y * var_p)`.

The first task is solved by looking at each node in your AST and keeping track any nodes of type `VARIABLE` whose name isn't `x` or `y`.

To solve the second task, I have a function like the following that walks over the tree and builds the GLSL code. Here's a really simplified example of the real function that does this:

~~~js
function toGLSL(node) {
  if (node.type === 'VARIABLE') {
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

  } else if (node.type === 'PLUS') {
    return (
      toGLSL(node.children[0]) +
      ' + ' +
      toGLSL(node.children[1])
    );

  } else if (...) {
    ...

  } ...

}
~~~

This function takes in an AST and returns code like `sin(x * var_p) * cos(y * var_p)`. And that's it!


In summary: if the user-input is $z = sin(x p) cos(y p)$, we should generate the following AST...

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/ast.svg" />
</div>

... which should generate the code above. We stuff this into a template string to generate the desired vertex shader above, and tell WebGL to use that vertex shader when rendering the mesh.

## Conclusion

In this article, I explained how you can achieve real-time manipulable 3D graphs by positioning vertices in a vertex shader. More generally, generating shaders at runtime is a powerful method of building realtime-interactive applications and something I plan to explore more deeply.

Hopefully this was interesting to you! If you have thoughts or comments, let me know below. Also, as a thank you for reading, here is a cool graph :D

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
