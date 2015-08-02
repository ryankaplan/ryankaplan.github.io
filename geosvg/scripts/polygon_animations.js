define([
    "animation",
    "geometry",
    "svg"], function(animation, geometry, svg){
    var Point = geometry.Point;

    function iterateMidpointPolysWithStartingPoly(paper, polyPath) {
        var polyPoints = polyPath.getPoints().slice(0, 5);

        var midpointPolyPath = new svg.Path(paper, {
            'stroke': '#5C44B2',
            'stroke-width': '2', //px
        });
        var midpointPolyPoints = geometry.getMidpointPolygonAsPoints(polyPoints);
        var midpointPolyCircles = [];

        for (var i = 0; i < midpointPolyPoints.length; i++) {
            var pt = midpointPolyPoints[i];
            midpointPolyCircles.push(paper.circle(pt.x, pt.y, 2).attr({
                'fill': '#5C44B2',
                'stroke': 'black',
            }));
        }

        animation.performAfterDelay(paper, function(){
            midpointPolyPoints.push(midpointPolyPoints[0]);
            midpointPolyPath.addPointsWithAnimation(midpointPolyPoints, 500, function(){

                for (var i = 0; i < midpointPolyCircles.length; i++) {
                    var currentCircle = midpointPolyCircles[i];
                    currentCircle.remove();
                }

                polyPath.fadeAway(1000, function() {
                    iterateMidpointPolysWithStartingPoly(paper, midpointPolyPath);
                });

                midpointPolyPath.fadeToColor('black', 1000);
                midpointPolyPath.getRaphaelPath().animate({
                    'transform':"s2 2"
                }, 1000, null, null);
            });
        }, 600);
    }

    function animateMidpointPolyOntoPoly(paper, polyPoints, completion) {
        var midointPolyPath = new svg.Path(paper, {
            'stroke': '#5C44B2',
            'stroke-width': '2', //px
        });
        var midpointPolyPoints = geometry.getMidpointPolygonAsPoints(polyPoints);

        for (var i = 0; i < midpointPolyPoints.length; i++) {
            var pt = midpointPolyPoints[i];
            var circle = paper.circle(pt.x, pt.y, 2).attr({
                'fill': '#5C44B2',
                'stroke': 'black',
            });
        }

        animation.performAfterDelay(paper, function(){
            midpointPolyPoints.push(midpointPolyPoints[0]);
            midointPolyPath.addPointsWithAnimation(midpointPolyPoints, 500, function(){
                setTimeout(completion, 2500);
            });
        }, 600);
    }

    function animateRandomPolyAndMidpointPoly(paper, numPoints, completion) {
        var padding = 30;
        var paperRect = new geometry.Rect(
            padding,
            padding, 
            paper.canvas.offsetWidth - padding,
            paper.canvas.offsetHeight - padding
        );
        var path = new svg.Path(paper);
        var rectPoints = geometry.getRandomishSparsePoints(paperRect, numPoints);
        // Push the first point again, to draw a closed loop.
        rectPoints.push(rectPoints[0]);
        path.addPointsWithAnimation(rectPoints, 500, function(){
            setTimeout(function(){
                animateMidpointPolyOntoPoly(
                    paper,
                    rectPoints.splice(0, rectPoints.length - 1),
                    completion
                );
            }, 700);
        });
    }

    function animateRandomPolyAndMidpointPolyRepeat(paper, numPoints) {
        animation.repeatClearAndAnimation(paper, function(paper, completion) {
            animateRandomPolyAndMidpointPoly(paper, numPoints, completion);
        });
    }

    return {
        'animateMidpointPolyOntoPoly': animateMidpointPolyOntoPoly,
        'animateRandomPolyAndMidpointPoly': animateRandomPolyAndMidpointPoly,
        'animateRandomPolyAndMidpointPolyRepeat': animateRandomPolyAndMidpointPolyRepeat,
        'iterateMidpointPolysWithStartingPoly': iterateMidpointPolysWithStartingPoly,
    }
});
