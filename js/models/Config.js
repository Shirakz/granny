/*global $, _, Backbone, granny */
$(document).ready(function () {

    window.granny = window.granny || {};
    
    granny.Config = new (Backbone.Model.extend({

        defaults: {
            width: $('#canvas').width(),
            height: $('#canvas').height(),
            ctx: document.getElementById('canvas').getContext('2d'),
            refreshRate: 1000 / 60 // lower = more fluid (and more CPU consuming)
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