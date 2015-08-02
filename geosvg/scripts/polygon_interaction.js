define(['animation', "svg", "geometry"], function(animation, svg, geometry) {
    var Point = geometry.Point;

    /*
     * When the user is done entering the polygon, `completion`
     * will be called with the points entered. The user drawn
     * polygon will remain on screen.
     */
    var animations = 0;
    function getPolygonFromUser(paper, numPoints, completion) {
        var path = new svg.Path(paper);

        jQuery(paper.canvas).click(function (evt) {
            console.log(animation);
            if (animation.inProgress(paper)) {
                return;
            }

            if (path.getPoints().length >= numPoints) {
                path = null;
            }

            if (!path) {
                paper.clear();
                path = new svg.Path(paper);
            }

            var drawSegmentDurationMs = 80;
            var clickPoint = new Point(evt.offsetX, evt.offsetY);
            path.addPointWithAnimation(clickPoint, drawSegmentDurationMs, function() {
                var pathPoints = path.getPoints();
                if (pathPoints.length == 5) {
                    path.addPointWithAnimation(pathPoints[0], drawSegmentDurationMs, function(){
                        completion && completion(path);
                    });
                }
            });
        });     
    };

    return {
        'getPolygonFromUser': getPolygonFromUser,
    }

});