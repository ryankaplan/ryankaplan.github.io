define([], function() {
    /*
     * Given a list and a number, this returns windows of
     * size `size` over the list.
     */
    function getWindows (list, size) {
        var windows = []

        for (var i = 0; i < list.length - size + 1; i++) {
            var currentWindow = [];
            for (var j = 0; j < size; j++) {
                currentWindow.push(list[i + j]);
            }
            windows.push(currentWindow);
        }

        return windows;
    }

    return {
        "getWindows": getWindows,
    };
});
