define([], function(){
    function pointDist(point1, point2) {
        return Math.sqrt(
            (point2.x - point1.x) * (point2.x - point1.x) +
            (point2.y - point1.y) * (point2.y - point1.y)
        );
    }

    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function getRandomInt(minInclusive, maxExclusive) {
        return minInclusive + Math.floor(
            Math.random() * (maxExclusive - minInclusive)
        );
    }

    /*
     * Returns a random point in rect.
     */
    function getRandomPoint(rect) {
        return new Point(
            getRandomInt(rect.x, rect.x + rect.width),
            getRandomInt(rect.y, rect.y + rect.height)
        );
    }

    function getRandomPoints(rect, numPoints) {
        var points = [];
        for (var i = 0; i < numPoints; i++) {
            points.push(getRandomPoint(rect));
        }
        return points;
    }

    function sumList(numbers) {
        var total = 0;
        for (var i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
        return total;
    }

    function getDistancesToPoints(point, points) {
        var distances = [];
        for (var i = 0; i < points.length; i++) {
            distances.push(pointDist(points[i], point));
        }
        return distances;
    }

    function getPointWithSmallestDistanceToPoints(candidatePoints, targetPoints) {
        var candidateWithMinDist = candidatePoints[0];
        var minDist = sumList(getDistancesToPoints(candidatePoints[0], targetPoints));

        for (var i = 1; i < candidatePoints.length; i++) {
            var currentCandidate = candidatePoints[i];
            var currentDist = sumList(getDistancesToPoints(currentCandidate, targetPoints));

            if (currentDist > minDist) {
                minDist = currentDist;
                candidateWithMinDist = currentCandidate;
            }
        }

        return candidateWithMinDist;
    }

    /*
     * Generate lots of random points in rect that aren't too close to each other.
     */
    function getRandomishSparsePoints(rect, numPoints) {
        var points = [];
        for (var i = 0; i < numPoints; i++) {
            var candidates = getRandomPoints(rect, numPoints * 2);
            var winner = getPointWithSmallestDistanceToPoints(candidates, points);
            points.push(winner);
        }
        return points;
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    function getMidpoint(pt1, pt2) {
        return new Point(
            (pt1.x + pt2.x) / 2,
            (pt1.y + pt2.y) / 2
        );
    }

    function getMidpointPolygonAsPoints(polygonPoints) {
        var midpointPolygon = [];
        for (var i = 0; i < polygonPoints.length; i++) {
            var midPoint = getMidpoint(
                polygonPoints[i],
                polygonPoints[(i + 1) % polygonPoints.length]
            );
            midpointPolygon.push(midPoint);
        }
        return midpointPolygon;
    }

    return {
        'Rect': Rect,
        'Point': Point,
        'getMidpoint': getMidpoint,
        'getRandomPoint': getRandomPoint,
        'getRandomishSparsePoints': getRandomishSparsePoints,
        'getMidpointPolygonAsPoints': getMidpointPolygonAsPoints,
    };
});