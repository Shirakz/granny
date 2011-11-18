$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Cannon = Backbone.Model.extend({
        defaults: {
            speed: 15,
            width: 130,
            height: 169,
            positionX: 50,
            positionY: 350,
            cannonSprite: 1,
            active: false
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