$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Granny = Backbone.Model.extend({
        defaults: {
            lifes: 3,
            speed: 12,
            width: 130,
            height: 169,
            positionX: 350,
            positionY: 15,
            marginLeft: 50,
            marginRight: 50,
            currentDirection: 'left'
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