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
            marginRight: 0,
            currentImage: 0
        },
        
        
        initialize: function () {        
            var image0 = new Image();
                image1 = new Image(),
                image2 = new Image(),
                image3 = new Image(),
                image4 = new Image(),
                image5 = new Image(),
                image6 = new Image(),
                image7 = new Image(),
                winnerImage = new Image();
                
            image0.src = 'img/bowl-00.png';
            image1.src = 'img/bowl-01.png';
            image2.src = 'img/bowl-02.png';
            image3.src = 'img/bowl-03.png';
            image4.src = 'img/bowl-04.png';
            image5.src = 'img/bowl-05.png';
            image6.src = 'img/bowl-06.png';
            image7.src = 'img/bowl-07.png';
            winnerImage.src = 'img/winner-bowl.png';
            
            this.set({
                image0: image0,
                image1: image1,
                image2: image2,
                image3: image3,
                image4: image4,
                image5: image5,
                image6: image6,
                image7: image7,
                winnerImage: winnerImage
            });
        },
        
        
        validate: function (obj) {
            var error = null;
            
            if (obj.energy > 5) {
                error = 'Can\'t go over 5 energy';
            }
            
            if (obj.lifes < 0) {
                error = 'Can\'t go under 0 lifes';
            }
            
            if (obj.currentImage > 7) {
                error = 'You can\'t go over image7';
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