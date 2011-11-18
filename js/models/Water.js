$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Water = Backbone.Model.extend({
        defaults: {
            speed: 8,
            positionX: 50,
            positionY: 100,
            waterSprite: 1
        },
        
        picture: function (src) {
            var image = new Image();
            
            image.src = src || '';
        
            return {
                image: image
            };
        }
    });
});