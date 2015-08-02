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

function makeTriangle(p) {

    var triangle = {
        vertices: [],
        edges: [],
        listVerts: [],
        listEdges: [],
        triangleMarkers: true,
        altitudes: true
    };
    
    var fromVertex = null;
    var toVertex = null;
    
    var tempVertex = null;
    var tempEdge = null;
    
    triangle.draw = function() {
        p.background(255);
        
        triangle.updateListVertsAndEdges();
        
        // draw edges 
        tempEdge && tempEdge.draw();
        for (edgeIndex in triangle.edges) {
            triangle.edges[edgeIndex].draw();
        }
          
        // draw vertices
        tempVertex && tempVertex.draw();
        for (vertIndex in triangle.vertices){
            triangle.vertices[vertIndex].draw();
        }
        
        var midPts = triangle.getEdgeMidpts();
        var feet = triangle.getAltitudeFeet(); 
       

        // Draw the circle 
        var rad = findCircumCircleRadius(midPts);
        var cent = findCircumCircleCenter(midPts);
       
        p.noFill();
        p.stroke(p.color(0,0,0,0)); 
        p.ellipse(cent[0], cent[1], rad*2, rad*2);

        p.fill(p.color(0,255,255));
        for (midPtIndex in midPts){
            drawPoint(p, midPts[midPtIndex]);
        }

        if (triangle.triangleMarkers) {
            p.fill(p.color(0,255,255));
            for (midPtIndex in midPts){
                drawBiLines(p, parseInt(midPtIndex) + 1, [
                    midPts[midPtIndex],
                    triangle.listEdges[midPtIndex][0]
                    ], p.color(0, 100, 255));
                drawBiLines(p, parseInt(midPtIndex) + 1, [
                    midPts[midPtIndex],
                    triangle.listEdges[midPtIndex][1]
                    ], p.color(0, 100, 255));
            }
        }

        // Draw the altitudes
        if (triangle.altitudes) {
            for (footIndex in feet) {
                // draw the lines
                p.line(
                    feet[footIndex][0],
                    feet[footIndex][1],
                    triangle.listVerts[footIndex][0],
                    triangle.listVerts[footIndex][1]
                    );
            }
        }
        // Draw the feet
        p.fill(p.color(255,0,0));
        for (footIndex in feet) {
            drawPoint(p, feet[footIndex]);
        }


        // midpoints from orthoCenter to triangle vertices
        var orthoCent = triangle.findOrthoCenter(triangle.listVerts);
        var orthoEdges = [
                [orthoCent, triangle.listVerts[0]],
                [orthoCent, triangle.listVerts[1]],
                [orthoCent, triangle.listVerts[2]]
            ];
        for (edgeIndex in orthoEdges) {
            p.fill(p.color(255,255,0));
            edgeMidPt = getEdgeMidPt(orthoEdges[edgeIndex]);
            drawPoint(p, edgeMidPt);

            if (inTriangle(
                    edgeMidPt,
                    triangle.listVerts[0],
                    triangle.listVerts[1],
                    triangle.listVerts[2])) {
                 
                if (triangle.altitudes) { 
                    drawBiLines(p, parseInt(edgeIndex) + 1, [
                        edgeMidPt,
                        orthoEdges[edgeIndex][0]
                        ], p.color(255, 100, 0));
                    drawBiLines(p, parseInt(edgeIndex) + 1, [
                        edgeMidPt,
                        orthoEdges[edgeIndex][1]
                        ], p.color(255, 100, 0));
                }
            }
        }
    };
    
    triangle.pressed = function() {
        for (v in triangle.vertices) {
            if (triangle.vertices[v].isClicked()) {
                fromVertex = triangle.vertices[v];
                return;
            }
        }
        if (fromVertex) {
            fromVertex.setPosition();
        }
    };
    
    triangle.dragged = function() {
        if (fromVertex) {
            fromVertex.setPosition();
        }
    };
    
    triangle.addVertex = function(pt) {
        var vertex = makeVertex(p, p.color(0, 0, 0), pt[0], pt[1]);
        triangle.vertices.push(vertex);
        return vertex;
    };
    
    triangle.addEdge = function(edge) {
        triangle.edges.push(edge);
    };


    triangle.updateListVertsAndEdges = function() {
        triangle.listVerts = map(triangle.vertices, vertToList); 
        triangle.listEdges = map(triangle.edges, edgeToList);
    }

    triangle.getEdgeMidpts = function() {
        return map(triangle.listEdges, getEdgeMidPt);   
    }

    triangle.getAltitudeFeet = function() {
        return map([0, 1, 2], function(x) {
            return getAltitudeFoot(triangle.listEdges[x],
                triangle.listVerts[x])
        });
    }

    triangle.findOrthoCenter = function() {
        var a0 = triangle.listVerts[0][0];
        var a1 = triangle.listVerts[0][1];
        var b0 = triangle.listVerts[1][0];
        var b1 = triangle.listVerts[1][1];
        var c0 = triangle.listVerts[2][0];
        var c1 = triangle.listVerts[2][1];

        var d = (a0*(c1-b1) + a1*(b0-c0) - b0*c1 + b1*c0);
        var x = (a0*(a1*(b0-c0)-b0*b1+c0*c1)+(b1-c1)*(Math.pow(a1,2)-a1*(b1+c1)+b0*c0+b1*c1));
        var y = (Math.pow(a0,2)*(b0-c0)+a0*(a1*b1-a1*c1-Math.pow(b0,2)+Math.pow(c0,2))+a1*(c0*c1-b0*b1)+(b0-c0)*(b0*c0+b1*c1));
        return [x/d, -y/d];
    }

    var v = map([[80, 150],[250, 450],[500, 150]], triangle.addVertex);
    var e1 = makeEdge(p, v[1], v[2], false);
    var e2 = makeEdge(p, v[0], v[2], false);
    var e3 = makeEdge(p, v[0], v[1], false);
    map([e1, e3], v[0].addEdge);
    map([e1, e2], v[1].addEdge);
    map([e2, e3], v[2].addEdge);
    map([e1, e2, e3], triangle.addEdge);
    
    triangle.draw() 
    return triangle;
}
