$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.WorldView = Backbone.View.extend({
        
        // entry point
        initialize: function () {
        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'render', 'animate');
            
            // reference the singletons locally
            this.config = granny.Config;
            this.bowl = granny.BowlSingleton;
            this.granny = granny.GrannySingleton;
                        
            this.bowl.model.set({
                positionY: this.config.get('height') - this.bowl.model.get('height') - 10
            });

            // cache the images
            _(['background.png', 'bowl0.png', 'bowl1.png', 'bowl2.png', 'bowl3.png', 'bowl4.png', 'bowl5.png', 'cannon.png', 'granny_left.png', 'granny_right.png', 'water1.png', 'water2.png']).each(function (item) {
                var img = new Image();
                    img.src = 'img/' + item;
            });

            // start the rendering loop
            this.animate();
            
        },
        
        
        // self-calling function responsible for the rendering of the app
        render: function () {

            var refreshTime = this.config.get('refreshRate'), 
                ctx = this.config.get('ctx'),
                bg = this.config.get('background'),
                bowlEnergy = this.bowl.model.get('energy'),
                bowlImg = this.bowl.model.get('image' + bowlEnergy),
                bowlX = this.bowl.model.get('positionX'),
                bowlY = this.bowl.model.get('positionY'),
                grannyDirection = (function (str) {return str.charAt(0).toUpperCase() + str.slice(1); })(this.granny.model.get('currentDirection')), // capitalize the first letter
                grannyImg = this.granny.model.get('image' + grannyDirection),
                grannyX = this.granny.model.get('positionX'),
                grannyY = this.granny.model.get('positionY');    
                
            // ctx.globalAlpha = 0.02;
            
            ctx.drawImage(bg, 0, 0);

            // ctx.globalAlpha = 1;
            
            ctx.drawImage(grannyImg, grannyX, grannyY);

            ctx.drawImage(bowlImg, bowlX, bowlY);
            
            _(this.granny.waters.models).each(function (water) {
                var spriteCounter,
                    waterImg,
                    waterSprite = water.get('waterSprite'),
                    waterX = water.get('positionX'),
                    waterY = water.get('positionY'),
                    frameSwitchSpeed = water.get('frameSwitchSpeed');
                
                water.set({
                    spriteCounter: water.get('spriteCounter') + 1
                });
                    
                // switch the sprite every X frames
                if (!(water.get('spriteCounter') % frameSwitchSpeed)) {
                    water.set({
                        waterSprite: waterSprite === 1 ? 2 : 1 
                    });
                    
                    waterSprite = waterSprite === 1 ? 2 : 1;
                }
                
                waterImg = water.get('image' + waterSprite);                    

                ctx.drawImage(waterImg, waterX, waterY);

            }, this);
            
            // loop through the models in the cannons collection
            _(this.bowl.cannons.models).each(function (cannon) {
                var cannonImg = cannon.get('image'),
                    cannonX = cannon.get('positionX'),
                    cannonY = cannon.get('positionY');
                    
                ctx.drawImage(cannonImg, cannonX, cannonY);
            }, this);             
        },
        
        
        // rendering loop
        animate: function () {
            requestAnimFrame(this.animate);
            this.render();
        }
        
    });
});