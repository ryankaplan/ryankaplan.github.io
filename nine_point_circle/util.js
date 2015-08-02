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

var EPSILON = 10;

function map(list, fun) {
    var outputList = [];
    for (elt in list) {
        outputList.push(fun(list[elt]));
    }
    return outputList;
}

function AssertException(message) {
    this.message = message ? message : "";
}

AssertException.prototype.toString = function() {
    return 'AssertException: ' + this.message;
}

function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}

function edgeToList(e) {
    return [[e.from.x, e.from.y], [e.to.x, e.to.y]];
}

function vertToList(v) {
    return [v.x, v.y];
}

function findEdgeSlope(e) {
    var dy = e[1][1] - e[0][1];
    var dx = e[1][0] - e[0][0];
    if (dx == 0) {
        return undefined;
    }
    return dy/dx;
}

function findPerpSlope(e) {
    var dy = e[1][1] - e[0][1];
    var dx = e[1][0] - e[0][0];
    if (dy == 0) {
        return undefined;
    }
    return -dx/dy;
}

function getEdgeMidPt(e) {
    return [(e[0][0] + e[1][0])/2, (e[0][1] + e[1][1])/2];
}

function linesIntersect(s1, s2, p1, p2) {
    /* s1, s2 are slopes
       p1, p2 are points
       ASSUMPTION: the lines are not parallel and neither is vert/horz */

    return [-(p1[1] - p2[1] - p1[0] * s1 + p2[0] * s2)/(s1 - s2),
        -(-p2[1] * s1 + p1[1] * s2 - p1[0] * s1 * s2 + p2[0] * s1 * s2)/(s1 - s2)];
}

function getAltitudeFoot(e, v) {
    
    altSlope = findPerpSlope(e);
   
    
    // find intersection between edge and altitude
    if (altSlope !== undefined) {
        if (altSlope == 0) {
            // edge is vertical
            // we want intersection of horz line at v.y with edge
            return [e[0][0], v[1]];
        } else {
            // Neither edge nor alt is vertical! yay!
            
            var foot = linesIntersect(altSlope, findEdgeSlope(e), v, e[1]);
            return foot; 
        }
    } else {
        // altSlope is undefined -> the edge is horizontal
        // we want intersection of vert line at v.x with edge
        return [v[0], e[1][1]];
    }
}


function findCircumCircleCenter(pts) {
    var a = pts[0];
    var b = pts[1];
    var c = pts[2];

    var d = 2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
    var x = ((Math.pow(a[0],2) + Math.pow(a[1],2))*(b[1]-c[1])
            + (Math.pow(b[0],2)+Math.pow(b[1],2))*(c[1]-a[1]) +
            (Math.pow(c[0],2)+Math.pow(c[1],2))*(a[1]-b[1]))/d;

    var y = ((Math.pow(a[0],2) + Math.pow(a[1],2))*(c[0]-b[0]) +
            (Math.pow(b[0],2)+Math.pow(b[1],2))*(a[0]-c[0]) +
            (Math.pow(c[0],2)+Math.pow(c[1],2))*(b[0]-a[0]))/d;
    
    return [x, y];
}

function findCircumCircleRadius(verts) {
    var a = dist(verts[0], verts[1]);
    var b = dist(verts[1], verts[2]);
    var c = dist(verts[2], verts[0]);
    return (a*b*c)/Math.pow((a+b+c)*(b+c-a)*(c+a-b)*(a+b-c),0.5);
}

function norm(vec) {
    return Math.pow(Math.pow(vec[0], 2) + Math.pow(vec[1], 2), 0.5);
}

function normalize(vec) {
    var d = norm(vec);
    return [vec[0]/d, vec[1]/d];
}

function slopeToVector(slope) {
    var vec;
    if (slope === undefined) {
        vec = [0, 1];
    } else if (slope === 0) {
        vec = [1, 0];
    } else {
        vec = normalize([1, slope]);
    }
    return vec;
}


//function slopeToVector()

/* p     : processing object
   num   : number of biLines 
   edge  : edge to which biLines apply
   c     : processing color*/
function drawBiLines(p, num, edge, c) {
    var midPt = getEdgeMidPt(edge);
    var perpSlope = slopeToVector(findPerpSlope(edge)); 
    var edgeSlope = slopeToVector(findEdgeSlope(edge));

    var lineLength = 5;
    var lineSpacing = 4;

    var pt1 = [
        midPt[0] + lineLength*perpSlope[0],
        midPt[1] + lineLength*perpSlope[1]
        ];
    var pt2 = [
        midPt[0] - lineLength*perpSlope[0],
        midPt[1] - lineLength*perpSlope[1]
        ];

    pt1 = [
        pt1[0] - lineSpacing*(num/2)*edgeSlope[0],
        pt1[1] - lineSpacing*(num/2)*edgeSlope[1]
        ];
    pt2 = [
        pt2[0] - lineSpacing*(num/2)*edgeSlope[0],
        pt2[1] - lineSpacing*(num/2)*edgeSlope[1]
        ];

    p.stroke(c);
    for (i = 1; i <= num; i++) {
        pt1 = [
            pt1[0] + lineSpacing*edgeSlope[0],
            pt1[1] + lineSpacing*edgeSlope[1]
            ];
        pt2 = [
            pt2[0] + lineSpacing*edgeSlope[0],
            pt2[1] + lineSpacing*edgeSlope[1]
            ];
        p.line(pt1[0], pt1[1], pt2[0], pt2[1]);
    }
    p.stroke(p.color(0,0,0));
}


// p is a list of three points
function drawPoint(p, point) {
    p.ellipse(point[0], point[1], 5, 5);
}

