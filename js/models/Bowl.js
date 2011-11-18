$(document).ready(function () {
    window.granny = window.granny || {};
    
    granny.Bowl = Backbone.Model.extend({
    
        defaults: {
            lifes: 3,
            speed: 12,
            energy: 0,
            width: 120,
            height: 76,
            positionX: 350,
            positionY: 500,
            marginLeft: 20,
            marginRight: 0
        },
        
        
        image: function (src) {
        
            var image = new Image();
            
            image.src = src || '';
        
            return image;
            
        },
        
        
        validate: function (obj) {
            var check = null;
            if (obj.energy > 5) {
                check = 'Cannot go over 5 energy';
            }
            
            return check;
        }
        
    });
});