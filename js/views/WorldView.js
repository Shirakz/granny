/*global granny, $, _, Backbone, requestAnimFrame*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.WorldView = Backbone.View.extend({
        
        loop: false,
        
        
        storedGlobalEvents: {}, // event aggregator events will be stored here when pause is called
        
        
        // entry point
        initialize: function () {        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'play', 'pause', 'reset', 'preStage', 'stageIntro', 'stage1', 'winner', 'flashes',
                'renderWaters', 'renderCannons', 'renderScore', 'singleKeyDown', 'keydown', 'addWater',
                'keyup', 'endTurn', 'move', 'checkWaterCollisions', 'checkCannonCollisions',
                'removeGlobalEvents', 'restoreGlobalEvents');
            
            this.model = granny.World;

            this.bowl = new granny.BowlView();
            this.granny = new granny.GrannyView();

            this.granny.model.bind('change:lifes', this.endTurn);
            this.bowl.model.bind('change:lifes', this.endTurn);
            this.model.bind('singleKeyDown', this.singleKeyDown);
            this.event_aggregator.bind('addWater', this.addWater);

            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.keyup);            
            $('#reset').on('click', this.reset);            

            // cache the images
            _(['stage-intro-bg.png', 'stage1-bg.png', 'bowl-00.png', 'bowl-01.png', 'bowl-02.png', 'bowl-03.png', 'bowl-04.png', 'bowl-05.png', 'bowl-06.png', 'bowl-07.png', 
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
                case 'stageIntro':
                
                    this.removeGlobalEvents();
                    
                    // stage 1 preparation
                    this.event_aggregator.bind('key:enter', function () {
                        this.restoreGlobalEvents();
                        this.audio = new granny.AudioView();
                        this.model.set({stage: 'stage1'});
                    }, this);
                    
                    break;
            }
            
            this.play();
        },
        
        
        stageIntro: function () {
            var ctx = this.model.get('ctx'),
                bg = this.model.get('stageIntroBg'),
                width = this.model.get('width'),
                height = this.model.get('height');
            
            ctx.drawImage(bg, 0, 0);
            
            ctx.font = '20px Pixel';  
            ctx.fillStyle = '#404041';  
            ctx.fillText('Press enter to play', 290, height/1.15);
        },

        
        stage1: function () {
            var ctx = this.model.get('ctx'),
                bg = this.model.get('stage1Bg'),
                bowlEnergy = this.bowl.model.get('energy'),
                bowlCurrentImgName = this.bowl.model.get('currentImage'),
                bowlImg = this.bowl.model.get('image' + bowlCurrentImgName),
                bowlX = this.bowl.model.get('positionX'),
                bowlY = this.bowl.model.get('positionY'),
                grannyDirection = _(this.granny.model.get('currentDirection')).capitalize(),
                grannyImg = this.granny.model.get('image' + grannyDirection),
                grannyX = this.granny.model.get('positionX'),
                grannyY = this.granny.model.get('positionY'),
                watersAdded = this.model.get('watersAdded');
                
            ctx.drawImage(bg, 0, 0);
            ctx.drawImage(grannyImg, grannyX, grannyY);
            ctx.drawImage(bowlImg, bowlX, bowlY);
            
            this.renderWaters(ctx);
            this.renderCannons(ctx);
            this.renderScore(ctx);

            if (watersAdded > 9) {
                this.event_aggregator.trigger('increase:speed:granny', 1);
                this.model.set({watersAdded: 0});
            }
            
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
                
                water.set({spriteCounter: spriteCounter + 1});

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
                var cannonImg,
                    cannonX = cannon.get('positionX'),
                    cannonY = cannon.get('positionY'),
                    cannonSprite = cannon.get('cannonSprite'),
                    frameSwitchSpeed = cannon.get('frameSwitchSpeed'),
                    spriteCounter = cannon.get('spriteCounter');

                cannon.set({spriteCounter: spriteCounter + 1});
                
                // switch the sprite every X frames
                if (spriteCounter >= frameSwitchSpeed) {
                    cannon.set({
                        spriteCounter: 0,
                        cannonSprite: cannonSprite === 1 ? 2 : 1
                    });
                    
                    cannonSprite = cannonSprite === 1 ? 2 : 1;
                }
                
                cannonImg = cannon.get('image' + cannonSprite);
                
                ctx.drawImage(cannonImg, cannonX, cannonY);

                this.bowl.fallCannon(cannon);
                this.checkCannonCollisions(cannon);
            }, this);
        },
                
                
        renderScore: function (ctx) {
            var bowlPoints = 3 - this.granny.model.get('lifes'),
                grannyPoints = 3 - this.bowl.model.get('lifes');
            
            ctx.font = '40px Pixel';  
            ctx.fillStyle = '#ffd64a';  
            ctx.fillText(grannyPoints + ' - ' + bowlPoints, 550, 30);
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
                    break;
                    
                // ^ (up)
                case 38:
                    this.event_aggregator.trigger('add:cannon');
                    break;
                    
                // return / enter key
                case 13:
                    this.event_aggregator.trigger('key:enter');
                    break;
                    
                // spacebar
                case 32:
                    this.event_aggregator.trigger('key:spacebar');
                    break;
            }
        },
        
        
        move: function () {
            _(this.model.pressedKeys).each(function (val, key) {
                if (this.model.pressedKeys[key]) {
                    switch (key) {
                        // a
                        case '65':
                            this.event_aggregator.trigger('key:a');
                            break;
                            
                        // d
                        case '68':
                            this.event_aggregator.trigger('key:d');
                            break;                          
                            
                         // <- (left)
                        case '37':
                            this.event_aggregator.trigger('key:leftarrow');
                            break;

                        // -> (right)
                        case '39':
                            this.event_aggregator.trigger('key:rightarrow');
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
            
            this.event_aggregator.trigger('end:turn', this.model, 'deathSound');
            
            if (lifes > 0) {                
                this.pause(2000);
                this.flashes();
            } else {
                winner = name === 'granny' ? 'bowl' : 'granny';
                
                console.log(name + ' lost :(');
                
                this.pause(3000, function () {
                    that.winner(winner);
                });
            }
            
        },
        
        
        flashes: function () {
            var ctx = this.model.get('ctx'),
                width = this.model.get('width'),
                height = this.model.get('height'),
                idAnimation;
            
            
            ctx.globalAlpha = 0.2;
                           
            ctx.fillStyle = '#ff0';
            ctx.fillRect(0, 0, width, height);
            
            setTimeout(function () {
                ctx.fillStyle = '#ac0';
                ctx.fillRect(0, 0, width, height);
                
                setTimeout(function () {
                    ctx.fillStyle = '#cb0';
                    ctx.fillRect(0, 0, width, height);
                    
                    setTimeout(function () {                    
                    ctx.fillStyle = '#ff0';
                    ctx.fillRect(0, 0, width, height);
                    
                        ctx.globalAlpha = 1;
                    }, 100);                    
                }, 100);
            } , 100);
        },
        
        
        winner: function (winner) {
            var ctx = this.model.get('ctx'),
                bg = this[winner].model.get('winnerImage'),
                that = this;

            this.event_aggregator.bind('end:game', this.audio.play);
            
            this.event_aggregator.trigger('end:game', this.model, 'winnerSound');
            
            console.log(this.event_aggregator);
            
            winner = _.capitalize(winner);
            
            if (winner === 'Bowl') {
                winner = ' Bowl';
            }
            
            ctx.drawImage(bg, 0, 0);
                        
            ctx.font = '80px Pixel';
            ctx.fillStyle = '#ffd64a';  
            ctx.fillText(winner + ' wins!', 150, 500);
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
            this.event_aggregator = $.extend(this.event_aggregator, this.storedGlobalEvents);
        },
        
        
        removeGlobalEvents: function () {
            this.storedGlobalEvents = $.extend({}, this.event_aggregator);
            this.event_aggregator.unbind();
        },
        
        
        addWater: function () {
            var newWatersAdded = this.model.get('watersAdded') + 1;
            this.model.set({watersAdded: newWatersAdded});
        },
        
        
        reset: function () {
            this.storedGlobalEvents = $.extend({}, this.event_aggregator);
            this.pause();
            this.loop = false;
            this.model.set(this.model.defaults);
            this.bowl.model.set(this.bowl.model.defaults);
            this.granny.model.set(this.granny.model.defaults);
            
            this.bowl.initialize();
            this.granny.initialize();
            
            this.restoreGlobalEvents();
            
            this.preStage();
        }
        
    });
});