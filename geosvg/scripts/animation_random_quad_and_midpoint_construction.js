/*
 * When run, this module will perform an interactive animation
 * in the div with id `draw_quad`.
 *
 * The animation draws 4 (mostly) random dots on the screen, and
 * joins them to create a (mostly) random quad. Then it draws
 * the midpoint-construction quad inside that quad.
 *
 * This animation repeats indefinitely.
 */
 
var MODULE_NAME = "draw_quad";

define(["polygon_animations"], function(polygon_animations){

    jQuery(document).ready(function () {
        if (jQuery("#" + MODULE_NAME).length == 0) {
            console.log("Could not find id #" + MODULE_NAME);
            return;
        }

        paper = Raphael(MODULE_NAME, "100%", "400px");
        polygon_animations.animateRandomPolyAndMidpointPolyRepeat(paper, 4);
    });
});
