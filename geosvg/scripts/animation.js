/*
 * This module contains general animation helpers.
 */

define([], function() {
    /*
     * `animation` is a function that takes in a paper and a
     * callback that will be called on completion.
     */
    function repeatClearAndAnimation(paper, animation) {
        var loop = function() {
            paper.clear();
            animation(paper, loop);
        };
        loop();
    };

    /*
     * The following four functions help keep track of any
     * ongoing animations. This helps us stop
     * user-interaction while animations are going on.
     */

     // Called when we're about to start an animation
    function registerAnimation(paper) {
        if (!paper.animationCount) {
            paper.animationCount = 0;
        }
        paper.animationCount++;
    }

    // Called just as we finish an animation
    function unregisterAnimation(paper) {
        paper.animationCount--;
    }

    // Returns `true` if any animations are in progress
    function inProgress(paper) {
        return (paper.animationCount &&
                paper.animationCount != 0);
    }

    // Just like `setTimeout(...)`, except that it counts the
    // waiting time as an animation by calling registerAnimation
    // at the start and unregisterAnimation at the end.
    function performAfterDelay(paper, animation, delay) {
        registerAnimation(paper);
        setTimeout(function() {
            unregisterAnimation(paper);
            animation();
        }, delay);
    }

    return {
        'performAfterDelay': performAfterDelay,
        'inProgress': inProgress,
        'register': registerAnimation,
        'unregister': unregisterAnimation,
        'repeatClearAndAnimation': repeatClearAndAnimation,
    };
});