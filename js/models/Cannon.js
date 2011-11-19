/*global $, _, Backbone, granny */
$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Cannon = Backbone.Model.extend({
    
        defaults: {
            speed: 9,
            width: 130,
            height: 169,
            positionX: 50,
            positionY: 350,
            cannonSprite: 1,
            active: false
        },
        
        
        initialize: function () {
        
            var image = new Image();
            
            image.src = 'img/cannon.png';
            
            this.set({
                image: image
            });

        }
        
    });
});