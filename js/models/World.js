$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.World = Backbone.Model.extend({

        defaults: {
            width: $('#canvas').width(),
            height: $('#canvas').height(),
            ctx: document.getElementById('canvas').getContext('2d')
        },

                
        image: function (src) {
        
            var image = new Image();
            
            image.src = src || '';
        
            return image;
            
        }
        
    });
});