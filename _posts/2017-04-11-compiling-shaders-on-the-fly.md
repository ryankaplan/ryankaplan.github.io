---
layout: post
title: Compiling WebGL Shaders on the Fly
date:   2017-04-11 00:00:00
summary: In a recent project, I found a need to generate WebGL shaders based on user-input. This is how I did it.
categories:
 - math
 - computer graphics
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css" integrity="sha384-wITovz90syo1dJWVh32uuETPVEtGigN07tkttEqPv+uR2SE/mbQcG7ATL28aI9H0" crossorigin="anonymous">
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js" integrity="sha384-/y1Nn9+QQAipbNQWU65krzJralCnuOasHncUFXGkdwntGeSvQicrYkiUBwsgUqc1" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/contrib/auto-render.min.js" integrity="sha384-dq1/gEHSxPZQ7DdrM82ID4YVol9BYyU7GbWlIwnwyPzotpoc57wDw/guX8EaYGPx" crossorigin="anonymous"></script>

This post requires some familiarity with WebGL or OpenGL. I talk about triangle meshes, GLSL, vertex shaders, fragment shaders and uniforms without explaining them. If those sound like gibberish to you, I recommend starting <a href="https://webglfundamentals.org/" target="_blank">here</a>!

Also, this is a first draft. Nopefully nobody actually reads this until I've cleaned it up! D:

---

I've been working on a web-based equation grapher called <a href="https://curvegrapher.com" target="_blank">Curve Grapher</a>. In it, a user can input an equation like $z = sin(x) cos(y)$ and the application will render it.

One feature I'm proud of is that if you input an equation like $z = sin(x p) cos(y p)$, the application will recognize that $p$ isn't a co-ordinate. It'll treat it as a variable and give you a slider to change its value.

Here's a screenshot of what I mean...

<div style="text-align: center;">
  <img style="border: 1px solid #999; border-radius: 3px; margin-bottom: 20px;" src="/images/compiling-shaders/variable-small.gif" />
</div>

This post is a high level overview of how I built this. My solution involves parsing the user input and using it to generate a vertex shader at run-time. This project involved a few other challenges as well. Figuring out how to render implicit 3D graphs like <a href="https://www.curvegrapher.com/#v=0&eq=sin(x)%20%3D%20cos(y)%20-%20sin(z)&hi=0&va=&c=15.14%2C14.91%2C19.98%7D&l=0.00~1.00~0.00~1.00" target="_blank">$sin(x) = cos(y) - sin(z)$</a> was really fun. I hope to write more about that later.

## High level approach

At first I tried something like <a href="https://stemkoski.github.io/Three.js/Graphulus-Function.html" target="_blank">this THREE.js demo</a> by Lee Stemkoski. In it, the author creates a triangle mesh and - in Javascript - positions the vertices of the mesh according to the user's equation.

Whenever you change the equation, or variable values, the demo iterates over all vertices in the scene (in Javascript) and repositions them. It works well. But when I implemented it, moving the slider felt really jaggy and I wanted something faster.

The approach I ended up using is as follows.

 - When a user inputs an equation like $z = sin(x p) cos(y p)$, we parse it into an abstract syntax tree (if you know what this is, great! if not, I'll explain it).
 - I use the abstract syntax tree to generate a vertex shader which positions the mesh's vertices on the GPU (super fast!)
 - Variables like $p$ are uniforms in the generated vertex shader. So changing a variable value means updating uniform values (also super fast!)

## Parsing

I didn't take Compilers or Programming Languages in college, and when I started this project I assumed that parsers and compilers just weren't for me. I had accepted that not taking those classes meant that these (really fun!) topics were out of my reach. As I've found again and again, that thought process is unproductive. At best, it means you always do what is safe and familiar. At worst, it holds you back from fun and exciting opportunities. Parsers and compilers can be totally approachable and you don't need to take a class to build either.

Taking a step back: a parser is a piece of software that takes user-input like $z = sin(x p) cos(y p)$ and turns it into a tree like this...

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/ast.svg" />
</div>

This is a common data structure in compiler software called an Abstract Syntax Tree (AST). Each node represents either

 - a variable like $x$, $y$, or $p$
 - an operator like $+$, $*$ or $=$
 - a function call ($\sin$, $\cos$)

What makes it useful to us is that it removes many language specific details from your code. You could imagine inspecting the abstract syntax above and writing Java code that represents it, or C++, or python, etc. In my case, it helped me translate the user defined equation into GLSL (the programming language for code that runs on the GPU).

My first step in building a parser was finding an open source project that (a) uses a parser and (b) isn't crazy advanced (I've never looked but I'm guessing that C++ parsers are pretty complicated 🙈). I poked around in the source code of <a href="https://github.com/evanw/glslx" target="_blank">GLSLX</a>, a GLSL type checker. I use GLSLX all the time, so I found it approachable. Most of my time was spent changing small parts of its parser and seeing how it changed its input/output.

GLSLX uses a technique called Pratt Parsing to parse GLSL. The name is intimidating, but <a href="http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/" target="_blank">this article</a> really helped me understand it. It got me on my feet enough to write a simple one myself.

## GLSL generation

A vertex shader is a piece of code that runs on the GPU and whose reponsibility is to position vertices in your scene. Because vertex shaders run on the GPU, they run largely in parallel. Positioning a vertex with a vertex shader is WAY faster than doing so in Javascript.

A typical vertex shader looks like this...

~~~glsl
// These are intimidating! Don't worry about them.
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void myVertexShader() {
  // Also intimidating. Ignore!
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
~~~

Amazingly, this is a super standard vertex shader. I say 'amazing' because there's a lot of complex hokey pokey in it that just about everyone has to write every time they create a vertex shader. For now, just know that the vertex shader above is 'standard' in the sense that it makes sure your vertices show up on screen where you expect them to.

In my implementation, I start out with a mesh that spans the $x/y$ plane from $[-10, 10]$ in both dimensions. The $z$ position of each vertex is $0$. The vertex shader makes it so that a flat plane like this is rendered to the screen:

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/flat.png" />
</div>

My end goal is a shader that looks like this:

~~~glsl
// This holds the user-defined value of the variable p
uniform float var_p;

// We generate this at run-time based on the input
// z = sin(x p) cos(y p)
vec3 userDefinedEquation(vec3 position) {
  return vec3(
    position.x,
    position.y,
    sin(position.x * var_p) * cos(position.y * var_p)
  );
}

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void myVertexShader() {
  // This line is new!
  vec3 transformedPosition = userDefinedEquation(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.);
}
~~~

This is mostly like the shader above, except it transforms all vertex co-ordinates by the user-defined equation! When the user's equation changes, the bottom half of the shader (the `attribute` declaration and below) never changes. So you can imagine keeping that as a string in Javascript and prepending it with the stuff above it, which we re-generate whenever the user's equation changes.

To generate the stuff above the `attribute declaration`, I wrote code that transforms a user-defined AST into GLSL. Something like this...

~~~js
function toGLSL(astNode) {
  if (astNode.type === 'PLUS_OPERATOR') {
    return toGLSL(astNode.firstChild) + ' + ' + toGLSL(astNode.secondChild);

  } else if (...) {
    ...

  } else if (astNode.type === 'VARIABLE') {
    return astNode.variableName;

  } else if (astNode.type === 'FUNCTION_CALL') {
    return astNode.functionName + '(' + astNode.functionArgument + ')';

  } ...
}
~~~

This code is very simplified, but hopefully you get the idea. If the user-input is $z = sin(x p) cos(y p)$, we should generate the following AST...

<div style="text-align: center;">
  <img style="margin-bottom: 20px;" src="/images/compiling-shaders/ast.svg" />
</div>

... which should generate the GLSL `z = sin(x * p) + cos(y * p)`. We splice this into a template string to generate the desired vertex shader above, and tell WebGL to use that vertex shader when rendering the mesh.

## Conclusion

In conclusion, here is a cool graph :D

<a href="https://www.curvegrapher.com/#v=0&eq=z%20%3D%20sin(atan(sin(x)%20cos(y)%20p))&hi=0&va=p~2.24~-3.00~3.00~0&c=-9.60%2C11.93%2C10.18%7D&l=0.00~1.00~0.00~1.00" target="_blank" style="text-align: center; text-decoration: none;">
  <img style="border: 1px solid #999; border-radius: 3px; margin-bottom: 20px;" src="/images/compiling-shaders/cool.gif" />
</a>

Ok, so obviously this blog post cut off really abuptly. I'll come back to it and add more in the next few days :D

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