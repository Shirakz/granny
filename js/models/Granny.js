/*global $, _, Backbone, granny */
$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Granny = Backbone.Model.extend({
    
        defaults: {
            name: 'granny',
            lifes: 3,
            speed: 7,
            width: 96,
            height: 136,
            canWidth: 45,
            positionX: 350,
            positionY: 29,
            marginLeft: 50,
            marginRight: 50,
            currentDirection: 'left'
        },
        
        
        initialize: function () {        
            var imageLeft = new Image(),
                imageRight = new Image(),
                winnerImage = new Image();
                
            _.bindAll(this, 'reset');
            
            imageLeft.src = 'img/granny_left.png';
            imageRight.src = 'img/granny_right.png';
            winnerImage.src = 'img/winner-granny.png';            
            
            this.set({
                imageLeft: imageLeft,
                imageRight: imageRight,
                winnerImage: winnerImage
            });
        },
        
        
        validate: function (obj) {
            var error = null;
            
            if (obj.lifes < 0) {
                error = 'Can\'t go under 0 lifes';
            }
            
            return error;
        },
        
        
        // re-do this function using model.set instead of changing
        // the properties directly
        reset: function (attrs) {
            _(attrs).each(function (attr) {
                if (this.defaults.hasOwnProperty(attr)) {
                    this.attributes[attr] = this.defaults[attr];
                }
            }, this);
        }
        
    });
});