$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.World = Backbone.Model.extend({

        canvas: function () {
            var el = document.getElementById('canvas'),
                width = $('#canvas').width(),
                height = $('#canvas').height(),
                ctx = el.getContext('2d');
                
            return {
                el: el,
                width: width,
                height: height,
                ctx: ctx
            };
        },
                
        picture: function () {
            var image = new Image();
            
            image.src = 'img/background.png';
        
            return {
                image: image,
                width: $('#canvas').width(),
                height: $('#canvas').height()
            };
        }
    });
});