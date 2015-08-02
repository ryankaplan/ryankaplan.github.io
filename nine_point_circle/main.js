/*
 ninePointCircle (http://rykap.com/ninePointCircle)
 License: MIT License (see below)

 Copyright (c) 2012 Ryan Kaplan

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

function sketchProc(p) {
    var triangle;
    var count = 0;

    p.setup = function() {
        p.width = window.innerWidth - 200;
        p.height = window.innerHeight;
        triangle = makeTriangle(p);

        // Initialize the GUI 
        var gui = new dat.GUI();
        var guiOptions = [
            'triangleMarkers',
            'altitudes'
        ];

        var controller;
        for (guiOptionIndex in guiOptions) {
            controller = gui.add(triangle, 
                guiOptions[guiOptionIndex]);
            controller.onChange( function(value) {
                    triangle.draw();
                });
        }
        triangle.draw();
    }
    
    // p.draw = function() {
    // };
    
    p.mousePressed = function() {
        triangle.pressed();
        triangle.draw();
    };

    p.mouseDragged = function() {
        triangle.dragged();
        triangle.draw();
    };
    
    p.resize = function(x, y) {
        p.width = window.innerWidth - 200;
        p.height = window.innerHeight;
        p.size(x, y);
        triangle.draw();
    };
}

function init() {
    var canvas = document.getElementById("triangleDrawer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    new Processing(canvas, sketchProc);
    // p.exit(); to detach it
}

function onResize() {
    var canvas = Processing.getInstanceById('triangleDrawer');
    canvas.resize(window.innerWidth, window.innerHeight);
}

init();

window.onresize = onResize;


