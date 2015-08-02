/*
 * When run, this module will perform an interactive animation
 * in the div with id `animation_user_drawn_pentagon_iteration`.
 *
 * The animation accepts 5 dots from user, drawing a path between
 * the dots as they are created. Once 5 dots are present, it joins
 * the first and last dot to create a pentagon. Then it draws the
 * midpoint-pentagon inside the user-created pentagon. Then it draws
 * the midpoint-pentagon of *that*, and so on...
 *
 * The user can then click again to start over.
 */

var MODULE_NAME = 'animation_user_drawn_pentagon_iteration';

require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});

define([
    'animation',
    'polygon_animations',
    'polygon_interaction'], function(animation, polygon_animations, polygon_interaction) {
    
    $(document).ready(function () {
        if (jQuery("#" + MODULE_NAME).length == 0) {
            console.log("Could not find id #" + MODULE_NAME);
            return;
        }

        var paper = Raphael(MODULE_NAME, '100%', '100%');
        
        polygon_interaction.getPolygonFromUser(paper, 5, function(path) {
            animation.performAfterDelay(paper, function() {
                polygon_animations.iterateMidpointPolysWithStartingPoly(
                    paper,
                    path
                );
            }, 600);
        });
    });

});
