/*global granny, $, _, Backbone, requestAnimFrame*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.WorldView = Backbone.View.extend({
        
        loop: false,
        
        
        currentEvents: {}, // event aggregator events will be stored here when pause is called
        
        
        // entry point
        initialize: function () {        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'play', 'pause', 'preStage', 'intro', 'stage1', 'winner',
                'renderWaters', 'renderCannons', 'singleKeyDown', 'keydown', 
                'keyup', 'endTurn', 'move', 'checkWaterCollisions', 'checkCannonCollisions',
                'removeGlobalEvents', 'restoreGlobalEvents');
            
            this.model = granny.World;

            this.bowl = new granny.BowlView();
            this.granny = new granny.GrannyView();

            this.granny.model.bind('change:lifes', this.endTurn);
            this.bowl.model.bind('change:lifes', this.endTurn);
            this.model.bind('singleKeyDown', this.singleKeyDown);
            this.event_aggregator.bind('end:game', this.endGame);
            
            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.keyup);            

            // cache the images
            _(['background.png', 'bowl0.png', 'bowl1.png', 'bowl2.png', 'bowl3.png', 'bowl4.png', 'bowl5.png', 
                'cannon.png', 'granny_left.png', 'granny_right.png', 'water1.png', 'water2.png']).each(function (item) {
                var img = new Image();
                
                img.src = 'img/' + item;
            });

            // start the rendering loop
            this.preStage();         
            
        },
        
        
        // rendering loop
        play: function () {
            var stage = this.model.get('stage');

            this.loop = requestAnimFrame(this.play);
            this[stage]();
        },
       
       
        pause: function (miliseconds, callback) {
            var that = this;
            
            cancelRequestAnimFrame(this.loop);
            this.removeGlobalEvents();
            
            if (miliseconds) {
                setTimeout(function () {
                    if (callback) {
                        callback();
                    } else {
                        that.restoreGlobalEvents();
                        that.play();
                    }
                }, miliseconds);
            }
        },
        
        
        preStage: function () {
            var stage = this.model.get('stage');
            
            switch (stage) {
                case 'intro':                    
                    break;
                
                case 'stage1':
                    this.audio = new granny.AudioView();
                    break;
            }
            
            this.play();
        },
        
        
        intro: function () {
            var ctx = this.model.get('ctx'),
                width = this.model.get('width'),
                height = this.model.get('height');
            
            ctx.fillStyle = "#000";  
            ctx.fillRect (0, 0, width, height);
        },

        
        stage1: function () {
            var ctx = this.model.get('ctx'),
                bg = this.model.get('background'),
                bowlEnergy = this.bowl.model.get('energy'),
                bowlImg = this.bowl.model.get('image' + bowlEnergy),
                bowlX = this.bowl.model.get('positionX'),
                bowlY = this.bowl.model.get('positionY'),
                grannyDirection = _(this.granny.model.get('currentDirection')).capitalize(),
                grannyImg = this.granny.model.get('image' + grannyDirection),
                grannyX = this.granny.model.get('positionX'),
                grannyY = this.granny.model.get('positionY');    
                
            // ctx.globalAlpha = 0.01;
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

                this.granny.fallWater(water);
                this.checkWaterCollisions(water);
            }, this);
        },
        
        
        renderCannons: function (ctx) {
            _(this.bowl.cannons.models).each(function (cannon) {
                var cannonImg = cannon.get('image'),
                    cannonX = cannon.get('positionX'),
                    cannonY = cannon.get('positionY');

                ctx.drawImage(cannonImg, cannonX, cannonY);

                this.bowl.fallCannon(cannon);
                this.checkCannonCollisions(cannon);
            }, this);
        },
                

        keydown: function (ev) {        
            // first keydown
            if (!this.model.pressedKeys[ev.keyCode]) {
                this.model.trigger('singleKeyDown', ev);
                
                this.model.pressedKeys[ev.keyCode] = true;
            }
        },


        keyup: function (ev) {        
            this.model.pressedKeys[ev.keyCode] = false;            
        },
        
        
        singleKeyDown: function (ev) {
            switch (ev.keyCode) {
                // s
                case 83:
                    this.event_aggregator.trigger('add:water');
                    // this.granny.addWater();
                    break;
                    
                // ^ (up)
                case 38:
                    this.event_aggregator.trigger('add:cannon');
                    // this.bowl.addCannon();
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
        
        
        endTurn: function (ev) {
            var lifes = ev.get('lifes'),
                name = ev.get('name'),
                winner,
                that = this;
            
            if (lifes > 0) {
                this.event_aggregator.trigger('end:turn');
                this.pause(2000);
            } else {
                winner = name === 'granny' ? 'bowl' : 'granny';
                
                console.log(name + ' lost :(');
                
                this.pause(2000, function () {
                    that.winner(winner);
                });
            }
            
        },
        
        
        winner: function (winner) {
            var ctx = this.model.get('ctx'),
                bg = this[winner].model.get('winnerImage');

                ctx.drawImage(bg, 0, 0);
        },
        
        
        checkCannonCollisions: function (cannon) {
            var cannonX = cannon.get('positionX'),
                cannonY = cannon.get('positionY'),
                cannonHeight = cannon.get('height'),
                cannonWidth = cannon.get('width'),
                grannyWidth = this.granny.model.get('width'),
                grannyHeight = this.granny.model.get('height'),
                grannyX = this.granny.model.get('positionX'),
                grannyY = this.granny.model.get('positionY'),
                canLeft = this.granny.model.get('currentDirection') === 'left' ? this.granny.model.get('canWidth') : 0,
                canRight = this.granny.model.get('currentDirection') === 'right' ? -this.granny.model.get('canWidth') : 0;
                
            // on its way up
            if (cannonY > 0 - cannonHeight) {

                // granny hit zone
                if (cannonY < grannyY + (grannyHeight / 2)) {
                
                    // hits
                    if (cannonX  + cannonWidth >= grannyX + canLeft && cannonX  <= grannyX + grannyWidth + canRight) {
                        this.event_aggregator.trigger('kill:granny', cannon);
                    }
                    
                }
                
            // miss
            } else {
                this.event_aggregator.trigger('miss:cannon', cannon);
            }                
        },

        
        checkWaterCollisions: function (water) {        
            var worldHeight = this.model.get('height'),
                bowlX = this.bowl.model.get('positionX'),
                bowlY = this.bowl.model.get('positionY'),
                bowlWidth = this.bowl.model.get('width'),
                waterX = water.get('positionX'),
                waterY = water.get('positionY'),
                waterWidth = water.get('width'),
                waterHeight = water.get('height');

            // on its way down
            if (waterY + waterHeight < worldHeight) {
                
                // catching zone
                if (waterY >= bowlY) {

                    // caught
                    if (waterX + waterWidth >= bowlX && waterX <= bowlX + bowlWidth) {
                        // water.trigger('catchWater', water);
                        this.event_aggregator.trigger('catch:water', water);
                    }
                    
                }
                
            // didn't catch it    
            } else {
                // water.trigger('missWater', water);
                this.event_aggregator.trigger('miss:water', water);
            }            
        },
        
        
        restoreGlobalEvents: function () {
            this.event_aggregator = $.extend(this.event_aggregator, this.currentEvents);
        },
        
        
        removeGlobalEvents: function () {
            this.currentEvents = $.extend({}, this.event_aggregator);
            this.event_aggregator.unbind();
        }
        
    });
});