/*global $, _, Backbone, granny */
$(document).ready(function () {

    window.granny = window.granny || {};
    
    // singleton model; can be accessed from any view
    granny.World = new (Backbone.Model.extend({

        defaults: {
            name: 'world',
            width: $('#canvas').width(),
            height: $('#canvas').height(),
            ctx: document.getElementById('canvas').getContext('2d'),
            refreshRate: 1000 / 60, // lower = more fluid (and more CPU consuming)
            sound: true,
            stage: 'stage1'
        },


        pressedKeys: {            
            65: false, // a
            68: false, // d 
            83: false, // s
            37: false, // <- (left key)
            39: false, // -> (right key)
            38: false // ^ (up key)
        },
        
        
        initialize: function () {        
            var image = new Image();
            
            image.src = 'img/background.png';
            
            this.set({
                background: image
            });
        }
        
    }))();
    
});