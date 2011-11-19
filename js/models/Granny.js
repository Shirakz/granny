/*global $, _, Backbone, granny */
$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Granny = Backbone.Model.extend({
    
        defaults: {
            lifes: 3,
            speed: 7,
            width: 130,
            height: 169,
            positionX: 350,
            positionY: 15,
            marginLeft: 50,
            marginRight: 50,
            currentDirection: 'left'
        },
        
        
        initialize: function () {
        
            var imageLeft = new Image(),
                imageRight = new Image();
            
            imageLeft.src = 'img/granny_left.png';
            imageRight.src = 'img/granny_right.png';
            
            this.set({
                imageLeft: imageLeft,
                imageRight: imageRight
            });

        }
        
    });
});