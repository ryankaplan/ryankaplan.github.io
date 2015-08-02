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


// spec:
//   color
//   label
function makeEdge(p, v1, v2, directed, spec) {
    var edge = {
        from: v1,
        to: v2,
        directed: directed
    };
    
    edge.draw = function() {
        p.fill(p.color(0,0,0));
        p.line(v1.x, v1.y, v2.x, v2.y);
    };

    
    edge.setFromVertex = function(fromVertex) {
        edge.from = fromVertex;
    };
 
    edge.setToVertex = function(toVertex) {
        edge.to = toVertex;
    };
    
    return edge;
}
