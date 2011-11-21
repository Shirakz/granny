/*global granny, $, _, Backbone, requestAnimFrame*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.WorldView = Backbone.View.extend({
        
        loop: false,
        
        // entry point
        initialize: function () {        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'animate', 'render', 'renderWaters', 'renderCannons', 'singleKeyDown', 'keydown', 'keyup', 'pause', 'endTurn', 'move');
            
            // reference the singletons locally
            this.model = granny.World;
            this.bowl = granny.BowlSingleton;
            this.granny = granny.GrannySingleton;
                  
            this.granny.model.bind('change:lifes', this.endTurn);
            this.bowl.model.bind('change:lifes', this.endTurn);
            this.model.bind('singleKeyDown', this.singleKeyDown);
            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.keyup);
            

            // cache the images
            _(['background.png', 'bowl0.png', 'bowl1.png', 'bowl2.png', 'bowl3.png', 'bowl4.png', 'bowl5.png', 'cannon.png', 'granny_left.png', 'granny_right.png', 'water1.png', 'water2.png']).each(function (item) {
                var img = new Image();
                    img.src = 'img/' + item;
            });

            // start the rendering loop
            this.animate();         
            
        },
        
        
        // rendering loop
        animate: function () {
            this.loop = requestAnimFrame(this.animate);
            this.render();
        },
        
       
        render: function () {
            var refreshTime = this.model.get('refreshRate'), 
                ctx = this.model.get('ctx'),
                bg = this.model.get('background'),
                bowlEnergy = this.bowl.model.get('energy'),
                bowlImg = this.bowl.model.get('image' + bowlEnergy),
                bowlX = this.bowl.model.get('positionX'),
                bowlY = this.bowl.model.get('positionY'),
                grannyDirection = _(this.granny.model.get('currentDirection')).capitalize(),
                grannyImg = this.granny.model.get('image' + grannyDirection),
                grannyX = this.granny.model.get('positionX'),
                grannyY = this.granny.model.get('positionY');    
                
            // ctx.globalAlpha = 0.02;
            ctx.drawImage(bg, 0, 0);         
            ctx.drawImage(grannyImg, grannyX, grannyY);
            ctx.drawImage(bowlImg, bowlX, bowlY);
            
            this.renderWaters(ctx);
            this.renderCannons(ctx);
            
            this.move();
        },
        
        
        renderWaters: function (ctx) {
            _(this.granny.waters.models).each(function (water) {
                var waterImg,
                    waterSprite = water.get('waterSprite'),
                    waterX = water.get('positionX'),
                    waterY = water.get('positionY'),
                    frameSwitchSpeed = water.get('frameSwitchSpeed'),
                    spriteCounter = water.get('spriteCounter');
                
                water.set({
                    spriteCounter: spriteCounter + 1
                });

                // switch the sprite every X frames
                if (spriteCounter >= frameSwitchSpeed) {
                    water.set({
                        spriteCounter: 0,
                        waterSprite: waterSprite === 1 ? 2 : 1
                    });
                    
                    waterSprite = waterSprite === 1 ? 2 : 1;
                }
                
                waterImg = water.get('image' + waterSprite);                    

                ctx.drawImage(waterImg, waterX, waterY);

                this.granny.waterFall(water);
            }, this);
        },
        
        
        renderCannons: function (ctx) {
            _(this.bowl.cannons.models).each(function (cannon) {
                var cannonImg = cannon.get('image'),
                    cannonX = cannon.get('positionX'),
                    cannonY = cannon.get('positionY');

                ctx.drawImage(cannonImg, cannonX, cannonY);

                this.bowl.cannonFall(cannon);
            }, this);
        },
                

        keydown: function (ev) {        
            // first keydown
            if (!this.model.pressedKeys[ev.keyCode]) {
                this.model.trigger('singleKeyDown', ev);
            }
            
            this.model.pressedKeys[ev.keyCode] = true;
        },


        keyup: function (ev) {        
            this.model.pressedKeys[ev.keyCode] = false;            
        },
        
        
        singleKeyDown: function (ev) {
            switch (ev.keyCode) {
                // s
                case 83:
                    this.granny.addWater();
                    break;
                    
                // ^ (up)
                case 38:
                    this.bowl.addCannon();
                    break;
            }
        },
        
        
        move: function () {
            _(this.model.pressedKeys).each(function (val, key) {
                if (this.model.pressedKeys[key]) {
                    switch (key) {
                        // a
                        case '65':
                            this.granny.moveLeft();
                            break;
                            
                        // d
                        case '68':
                            this.granny.moveRight();
                            break;                          
                            
                         // <- (left)
                        case '37':
                            this.bowl.moveLeft();
                            break;

                        // -> (right)
                        case '39':
                            this.bowl.moveRight();
                            break;
                    }
                }
            }, this);            
        },
        
        
        pause: function () {
            cancelRequestAnimFrame(this.loop);
        },
        
        
        endTurn: function () {
            this.granny.waters.reset();
            this.bowl.cannons.reset();
            
            this.granny.model.reset(['positionX', 'currentDirection', 'speed']);
            this.bowl.model.reset(['positionX', 'speed']);
        }
        
    });
});