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
            spriteCounter: 0,
            frameSwitchSpeed: 5,
            addSound: $('#cannon').get(0)
        },
        
        
        initialize: function () {        
            var image1 = new Image(),
                image2 = new Image(),
                that = this;
            
            image1.src = 'img/cannon-01.png';
            image2.src = 'img/cannon-02.png';
            
            image1.onload = function () {
                that.set({
                    width: this.width
                });
            };
            
            this.set({
                image1: image1,
                image2: image2
            });
        }
        
    });
});