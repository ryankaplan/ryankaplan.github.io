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

function sub(x, y) { return [x[0] - y[0], x[1] - y[1]]; }

function add(x, y) { return [x[0] + y[0], x[1] + y[1]]; }

function norm(pt) { return Math.pow(Math.pow(pt[0],2) + Math.pow(pt[1],2), 0.5); }

function dist(p1, p2) { return norm([p2[0] - p1[0], p2[1] - p1[1]]); }

function dot(a, b) {
    var sum = 0;
    for (i in a){
        sum += a[i]*b[i];
    }
    return sum;
}

// More information about the function below can be found in the
// following book: http://realtimecollisiondetection.net/
// It computes barycentric co-ordinates of p to make
// collision detection of p with the triangle trivial.
function inTriangle(p, a, b, c) {
    var v = [sub(c, a), sub(b, a), sub(p, a)];
    
    var dot00 = dot(v[0], v[0]); 
    var dot01 = dot(v[0], v[1]); 
    var dot02 = dot(v[0], v[2]); 
    var dot11 = dot(v[1], v[1]); 
    var dot12 = dot(v[1], v[2]); 

    var d = (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) / d;
    var v = (dot00 * dot12 - dot01 * dot02) / d;
    if ((u >= 0) && (v >= 0)) {
        if (u + v < 1) {
            return true;
        }
    }
    return false;
}
