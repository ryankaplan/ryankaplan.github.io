define(['animation', 'geometry'], function(animation, geometry){
    var Point = geometry.Point;

    var Style = {
        defaultPathStyle: {
            'stroke': 'black',
            'stroke-width': '1', // px
        },
    };

    /*
     * For getting SVG path strings from points...
     */

    function getLoopStringFromPoints(points) {
        if (points.length === 0) {
            return "";
        }

        var pathString = getPathStringFromPoints(points) + "Z";
        console.log("A  ", pathString);
        return pathString;
    }

    function getPathStringFromPoints(points) {
        if (points.length === 0) {
            return "";
        }

        var pathString = "M" + points[0].x + "," + points[0].y;
        for (var i = 1; i < points.length; i++) {
            pathString = pathString + "L";
            pathString = pathString + points[i].x;
            pathString = pathString + ",";
            pathString = pathString + points[i].y;
        }
        return pathString;
    }

    /*
     * Helper functions for SVG objects.
     */

    function getCenterPointsFromCircles(circles) {
        var center_points = [];
        for (var i = 0; i < circles.length; i++) {
            var curr_circle = circles[i];
            center_points.push(new Point(curr_circle.attr("cx"),
                                         curr_circle.attr("cy")));
        }
        return center_points;
    }

    /*
     * Geometry data types that draw/animate themselves.
     */

    function Path(paper, styleAttrs) {
        this.mStyleAttrs = styleAttrs || Style.defaultPathStyle;
        this.mPaper = paper;
        this.mPoints = [];
        this.mCircles = [];
        this.mPath = this._createSVGPathWithPoints(this.mPoints);
    }

    Path.prototype._createSVGPathWithPoints = function(points) {
        var pathString = getPathStringFromPoints(points);
        return this.mPaper.path(pathString).attr(this.mStyleAttrs);
    }

    Path.prototype.getRaphaelPath = function() {
        return this.mPath;
    }

    Path.prototype.fadeAway = function(duration, completion) {
        this.mPath.animate({
            'stroke-opacity': 0
        }, duration, null, function() {
            this.mPath.remove();
            completion();
        }.bind(this));

        for (var i = 0; i < this.mCircles.length; i++) {
            var currentCircle = this.mCircles[i];
            currentCircle.animate({
                'fill-opacity': 0,
                'stroke-opacity': 0,
            }, duration, null, function() {
                currentCircle.remove();
            });
        }
    }

    Path.prototype.fadeToColor = function(color, duration) {
        this.mPath.animate({
            'stroke': color,
        }, duration, null, null);  
    }

    Path.prototype.getPoints = function() {
        return this.mPoints.slice(0);
    }

    Path.prototype.addPointWithoutAnimation = function(point) {
        this._createCircleAtPoint(point);
        this.mPoints.push(point);
        this.mPath.attr('path', getPathStringFromPoints(this.mPoints));
    }

    Path.prototype.addPointsWithAnimation = function(points, duration, completion) {
        if (points.length == 0) {
            return;
        }

        // Path has no points. Add a point without animation to start.
        if (this.mPoints.length == 0) {
            this.addPointWithoutAnimation(points[0]);
            points = points.slice(1, points.length);
        }

        if (points.length == 1) {
            this.addPointWithAnimation(points[0], duration, completion);
        }

        var durationPerPoint = duration / points.length;
        var firstPoint = points[0];
        
        var restOfPoints = points.slice(1, points.length);
        var durationOfRestOfPoints = duration - durationPerPoint;

        this.addPointWithAnimation(points[0], durationPerPoint, function(){
            this.addPointsWithAnimation(
                restOfPoints,
                durationOfRestOfPoints,
                completion
            );
        }.bind(this));
    }

    Path.prototype.addPointWithAnimation = function(point, duration, completion, style) {

        if (this.mPoints.length == 0) {
            this.addPointWithoutAnimation(point);
            completion();
            return;
        }

        this._createCircleAtPoint(point, style);
        this.mPoints.push(point);

        var pathString = getPathStringFromPoints(this.mPoints);
        var attr = {
            'pathString': pathString,
        }

        animation.register(this.mPaper);
        this.mPath.animate(
            {'path': pathString},
            duration, // ms
            null, // easing
            function() {
                animation.unregister(this.mPaper);
                completion();
            }.bind(this)
        );
    }

    Path.prototype._createCircleAtPoint = function(point, style) {
        if (!style || style === 'undefined') {
            style = {
              fill: '#9DCFFF',
                stroke: 'black',
            };
        }

        this.mCircles.push(this.mPaper.circle(point.x, point.y, 3).attr(style));
    }

    return {
        'getLoopStringFromPoints': getLoopStringFromPoints,
        'getPathStringFromPoints': getPathStringFromPoints,
        'getCenterPointsFromCircles': getCenterPointsFromCircles,
        'Path': Path,
    }
});



