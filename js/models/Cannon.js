/*global $, _, Backbone, granny */
$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Cannon = Backbone.Model.extend({    
    
        defaults: {
            name: 'cannon',
            speed: 9,
            width: 120,
            height: 169,
            positionX: 50,
            positionY: 350,
            cannonSprite: 1,
            addSound: $('#cannon').get(0)
        },
        
        
        initialize: function () {        
            var image = new Image(),
                that = this;
            
            image.src = 'img/water-fall-2.png';
            
            image.onload = function () {
                that.set({width: this.width});
                that.set({height: this.height});
            };
            
            this.set({
                image: image
            });
        }
        
    });
});