/*
 ninePointCircle (http://rykap.com/ninePointCircle)
 License: MIT License (see below)

 Copyright (c) 2012 Jessica Liu, Ryan Kaplan

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

function makeVertex(p, color, vert_x, vert_y) {
    var vertex = {
        color: color,
        x: vert_x,
        y: vert_y,
        label: "",
        isSelected: false,
        edges: []
    };
    
    vertex.draw = function() {
        p.fill(vertex.color);
        p.ellipse(vertex.x, vertex.y, 10, 10);
    };
    
    vertex.isClicked = function() {
        return p.dist(vertex.x, vertex.y, p.mouseX, p.mouseY) < EPSILON;
    };
    
    vertex.setPosition = function() {
        vertex.x = p.mouseX;
        vertex.y = p.mouseY;
    };
    
    vertex.setLabel = function(label) {
        vertex.label = label;
    };
    
    vertex.setSelected = function(selected) {
        vertex.isSelected = selected;
    };
    
    vertex.addEdge = function(edge) {
        vertex.edges.push(edge);
    };
    
    vertex.removeEdge = function(edge) {
        var i = edges.indexOf(edge);
        i !== -1 && edges.splice(i, 1);
    };

    return vertex;
}
