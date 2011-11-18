$(document).ready(function () {
    granny.WorldView = Backbone.View.extend({
        el: $('canvas'),
        pressedKeys: {            
            65: false, // a
            68: false, // d
            37: false, // <-
            39: false, // ->
            83: false
        },
        
        initialize: function () {
            _.bindAll(this, 'render', 'keydown', 'release', 'addWater', 'waterFall', 'addCannon', 'cannonFall');
            
            this.world = new granny.World();
            this.granny = new granny.Granny();
            this.bowl = new granny.Bowl();
            this.waters = new granny.Waters();
            this.cannons = new granny.Cannons();
            
            this.bowl.set({
                positionY: this.world.canvas().height - this.bowl.get('height') - 10
            });
            
            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.release);
            
            // cache the images
            _(['background.png', 'bowl0.png', 'bowl1.png', 'bowl2.png', 'bowl3.png', 'bowl4.png', 'bowl5.png', 'granny_left.png', 'granny_right.png', 'water1.png', 'water2.png', 'cannon.png']).each(function (item) {
                var img = new Image();
                    img.src = 'img/' + item;
            });
            
            
            this.render();
        },
        
        render: function () {
            var that = this,
                ctx = this.world.canvas().ctx,
                bg = this.world.picture().image,
                grannyImg = this.granny.picture('img/granny_' + this.granny.get('currentDirection') + '.png').image,
                grannyX = this.granny.get('positionX'),
                grannyY = this.granny.get('positionY'),
                bowlImg = this.bowl.picture('img/bowl' + this.bowl.get('energy') + '.png').image,
                bowlX = this.bowl.get('positionX'),
                bowlY = this.bowl.get('positionY');
           
            
            bg.onload = function () {
                ctx.drawImage(bg, 0, 0);
            };
            
            grannyImg.onload = function () {
                ctx.drawImage(grannyImg, grannyX, grannyY);
            };
            
            bowlImg.onload = function () {
                ctx.drawImage(bowlImg, bowlX, bowlY);
            };

            _(this.waters.models).each(function (water) {
                var sprite = water.get('waterSprite') === 1 ? 2 : 1,
                    waterImg = water.picture('img/water' + sprite + '.png').image,
                    waterX = water.get('positionX'),
                    waterY = water.get('positionY');
                    
                water.set({waterSprite: sprite}); 
                waterImg.onload = function () {
                    ctx.drawImage(waterImg, waterX, waterY);
                };
            }, this);
            
            _(this.cannons.models).each(function (cannon) {
                var cannonImg = cannon.picture('img/cannon.png').image,
                    cannonX = cannon.get('positionX'),
                    cannonY = cannon.get('positionY');
                    
                // cannon.set({waterSprite: sprite}); 
                cannonImg.onload = function () {
                    ctx.drawImage(cannonImg, cannonX, cannonY);
                };
            }, this);
                 
            
            setTimeout(function () {
                that.render();
            }, 60);
        },
        
        
        keydown: function (ev) {      
            var that = this,
                key = ev.keyCode;

            // if the key was just pressed
            if (!this.pressedKeys[ev.keyCode]) {
                
                this.pressedKeys[ev.keyCode] = true;
                
                switch (key) {
                    // a
                    case 65:
                    
                        // self executed asynchronous function-loops
                        // to keep moving while the button is pressed
                        // without blocking the onkeydown events
                        (function grannyLeft() {
                            var speed = that.granny.get('speed'),
                                x = that.granny.get('positionX');
                                marginLeft = that.granny.get('marginLeft'); 
                            
                            // correct the position "jump" when changing directions
                            if (that.granny.get('currentDirection') === 'right') {
                                x += 65;
                            }
                            
                            if (that.pressedKeys[65]) {
                                if (x > marginLeft) {
                                
                                    that.granny.set({
                                        positionX: x - speed
                                    });
                                    
                                    
                                    that.granny.set({currentDirection: 'left'});

                                    setTimeout(grannyLeft, 250 * (1 / speed));
                                }
                            }
                        })();
                        break;
                        
                    // d
                    case 68:
                       
                       (function grannyRight() {
                            var speed = that.granny.get('speed'),
                                x = that.granny.get('positionX'),
                                marginRight = that.granny.get('marginRight'),
                                grannyWidth = that.granny.get('width'),
                                worldWidth = that.world.canvas().width;
                            
                            // correct the position "jump" when changing directions
                            if (that.granny.get('currentDirection') === 'left') {
                                x -= 65;
                            }
                            
                            if (that.pressedKeys[68]) {
                                if (x < worldWidth - grannyWidth - marginRight) {
                                    that.granny.set({
                                        positionX: x + speed
                                    });
                                    
                                    that.granny.set({currentDirection: 'right'});

                                    setTimeout(grannyRight, 250 * (1 / speed));
                                }
                            }
                        })();
                        break;
                          
                    // s
                    case 83:
                    
                        this.addWater();
                        break;

                        
                    // <- (left)
                    case 37:
                    
                        (function bowlLeft() {
                            var speed = that.bowl.get('speed'),
                                x = that.bowl.get('positionX'),
                                marginLeft = that.bowl.get('marginLeft'); 
                            
                            if (that.pressedKeys[37]) {
                                if (x > marginLeft) {
                                    that.bowl.set({
                                        positionX: x - speed
                                    });

                                    setTimeout(bowlLeft, 250 * (1 / speed));
                                }
                            }
                        })();
                        break;
                        
                    // -> (right)
                    case 39:
                        
                        (function bowlRight() {
                            var speed = that.bowl.get('speed'),
                                x = that.bowl.get('positionX'),
                                marginRight = that.bowl.get('marginRight'),
                                bowlWidth = that.bowl.get('width');
                                worldWidth = that.world.canvas().width; 

                            if (that.pressedKeys[39]) {
                                if (x < worldWidth - bowlWidth - marginRight) {
                                    that.bowl.set({
                                        positionX: x + speed
                                    });

                                    setTimeout(bowlRight, 250 * (1 / 10));
                                }
                            }
                        })();
                        break;
                                        
                    // ^ (up)
                    case 38:
                    
                        this.addCannon();
                        break;
                }
            }
        },
        
        release: function (ev) {
            this.pressedKeys[ev.keyCode] = false;
        },
        
        addWater: function () {
            var water = new granny.Water(),
                correctionX;

            if (this.granny.get('currentDirection') === 'left') {
                correctionX = 20;
            } else {
                correctionX = -115;
            }

            water.set({
                positionX: this.granny.get('positionX') - correctionX
            });  
            
            water.set({
                positionY: this.granny.get('positionY') + this.granny.get('height') - 50
            });
            
            this.waters.add(water);
            
            this.waterFall(water);
        },
        
        waterFall: function (water) {
            var that = this,
                waterX = water.get('positionX'),
                waterY = water.get('positionY'),
                speed = water.get('speed'),
                worldHeight = this.world.canvas().height,
                bowlWidth = this.bowl.get('width'),
                bowlX = this.bowl.get('positionX'),
                bowlY = this.bowl.get('positionY');
                
            // on its way down
            if (waterY < worldHeight) {   

                // catching zone
                if (waterY > bowlY) {
                    if (waterX >= bowlX && waterX <= bowlX + bowlWidth) {
                        water.destroy();
                        this.bowl.set({
                            energy: this.bowl.get('energy') + 1
                        });
                        
                        return;
                    }
                }
                
                water.set({
                    positionY: water.get('positionY') + speed
                });
                
                setTimeout(function () {
                    that.waterFall(water);
                }, 250 * (1 / speed));
                
                
            } else {
                water.destroy();
                this.bowl.set({lifes: this.bowl.get('lifes') - 1});
                console.log('Bowl dead! Lifes:' + this.bowl.get('lifes'));
            }
        },
        
        addCannon: function () {
            var energy = this.bowl.get('energy'),
                cannon;
            
            if (energy < 5) {
                return;
            }
            
            cannon = new granny.Cannon();
            cannon.set({positionX: this.bowl.get('positionX')});
            
            this.bowl.set({energy: 0});
            
            this.cannons.add(cannon);
            
            this.cannonFall(cannon);
        },
        
        cannonFall: function (cannon) {
             var that = this,
                cannonX = cannon.get('positionX'),
                cannonY = cannon.get('positionY'),
                cannonWidth = cannon.get('width'),
                speed = cannon.get('speed'),
                grannyWidth = this.granny.get('width'),
                grannyHeight = this.granny.get('height'),
                grannyX = this.granny.get('positionX'),
                grannyY = this.granny.get('positionY'),
                canLeft = this.granny.get('currentDirection') === 'left' ? 70 : 0,
                canRight = this.granny.get('currentDirection') === 'right' ? -70 : 0;
                
            // on its way up
            if (cannonY > 0 - cannon.get('height')) {   

                // granny hit zone
                if (cannonY < grannyY + (grannyHeight / 2)) {
                    if (cannonX <= grannyX + grannyWidth + canRight && cannonX + cannonWidth >= grannyX + canLeft) {
                        cannon.destroy();
                        this.granny.set({lifes: this.granny.get('lifes') - 1});
                        console.log('Granny dead! Lifes:' + this.granny.get('lifes'));
                        return;
                    }
                }
                
                cannon.set({
                    positionY: cannon.get('positionY') - speed
                });
                
                setTimeout(function () {
                    that.cannonFall(cannon);
                }, 250 * (1 / speed));
                
                
            } else {
                cannon.destroy();
            }
        }
    });
});