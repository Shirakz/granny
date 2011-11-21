/*global $, _, Backbone, granny */
$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Bowl = Backbone.Model.extend({
    
        defaults: {
            name: 'bowl',
            lifes: 3,
            speed: 12,
            energy: 0,
            width: 120,
            height: 76,
            positionX: 350,
            positionY: 500,
            marginLeft: 0,
            marginRight: 0
        },
        
        
        initialize: function () {        
            var image0 = new Image(),
                image1 = new Image(),
                image2 = new Image(),
                image3 = new Image(),
                image4 = new Image(),
                image5 = new Image();
                
            image0.src = 'img/bowl0.png';
            image1.src = 'img/bowl1.png';
            image2.src = 'img/bowl2.png';
            image3.src = 'img/bowl3.png';
            image4.src = 'img/bowl4.png';
            image5.src = 'img/bowl5.png';
            
            this.set({
                image0: image0,
                image1: image1,
                image2: image2,
                image3: image3,
                image4: image4,
                image5: image5
            });
        },
        
        
        validate: function (obj) {
            var error = null;
            if (obj.energy > 5) {
                error = 'Can\'t go over 5 energy';
            }
            
            return error;
        },
        
        
        reset: function (attrs) {
            var that = this;
            
            _(attrs).each(function (attr) {
                if (that.defaults.hasOwnProperty(attr)) {
                    that.attributes[attr] = that.defaults[attr];
                }
            });
        }
        
    });
});