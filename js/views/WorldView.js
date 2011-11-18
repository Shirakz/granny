$(document).ready(function () {
    granny.WorldView = Backbone.View.extend({
        
        pressedKeys: {            
            65: false, // a
            68: false, // d 
            83: false, // s
            37: false, // <- (left key)
            39: false, // -> (right key)            
            38: false // ^ (up key)
        },
        
        // entry point
        initialize: function () {
        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'render', 'keydown', 'release', 'addWater', 'waterFall', 'addCannon', 'cannonFall');
            
            // instance the models
            this.world = new granny.World();
            this.granny = new granny.Granny();
            this.bowl = new granny.Bowl();
            this.waters = new granny.Waters();
            this.cannons = new granny.Cannons();
            
            this.bowl.set({
                positionY: this.world.get('height') - this.bowl.get('height') - 10
            });
            
            // key events
            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.release);
            
            // cache the images
            _(['background.png', 'bowl0.png', 'bowl1.png', 'bowl2.png', 'bowl3.png', 'bowl4.png', 'bowl5.png', 'granny_left.png', 'granny_right.png', 'water1.png', 'water2.png', 'cannon.png']).each(function (item) {
                var img = new Image();
                    img.src = 'img/' + item;
            });
            
            // start rendering
            this.render();
            
        },
        
        
        // self-calling function responsible for the rendering of the app
        render: function () {
        
            var refreshTime = 60, // lower = more fluid (and more CPU consuming)
                that = this, // instance "this" locally so we can use it within the setTimeout call
                ctx = this.world.get('ctx'),
                bg = this.world.image('img/background.png'),
                grannyImg = this.granny.image('img/granny_' + this.granny.get('currentDirection') + '.png'),
                grannyX = this.granny.get('positionX'),
                grannyY = this.granny.get('positionY'),
                bowlImg = this.bowl.image('img/bowl' + this.bowl.get('energy') + '.png'),
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
                var sprite = water.get('waterSprite') === 1 ? 2 : 1, // alternate between the 2 water images
                    waterImg = water.image('img/water' + sprite + '.png'),
                    waterX = water.get('positionX'),
                    waterY = water.get('positionY');
                    
                water.set({
                    waterSprite: sprite
                }); 
                
                waterImg.onload = function () {
                    ctx.drawImage(waterImg, waterX, waterY);
                };                
            }, this);
            
            // loop through the models in the cannons collection
            _(this.cannons.models).each(function (cannon) {
                var cannonImg = cannon.image('img/cannon.png'),
                    cannonX = cannon.get('positionX'),
                    cannonY = cannon.get('positionY');
                    
                cannonImg.onload = function () {
                    ctx.drawImage(cannonImg, cannonX, cannonY);
                };
            }, this);                 
            
            // call itself
            setTimeout(function () {
                that.render();
            }, refreshTime);
            
        },
        
        
        // handle the keydown events
        // code could probably be cleaned up a lot
        keydown: function (ev) {      
        
            var that = this,
                key = ev.keyCode;

            // if the key was just pressed
            if (!this.pressedKeys[key]) {                
                this.pressedKeys[key] = true;
                
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
                                        positionX: x - speed,
                                        currentDirection: 'left'
                                    });                                    

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
                                worldWidth = that.world.get('width');
                            
                            // correct the position "jump" when changing directions
                            if (that.granny.get('currentDirection') === 'left') {
                                x -= 65;
                            }
                            
                            if (that.pressedKeys[68]) {
                                if (x < worldWidth - grannyWidth - marginRight) {
                                    that.granny.set({
                                        positionX: x + speed,
                                        currentDirection: 'right'
                                    });
                                    
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
                                worldWidth = that.world.get('width'); 

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
        
        
        // handle the keyup events
        release: function (ev) {
        
            this.pressedKeys[ev.keyCode] = false;
            
        },
        
        
        addWater: function () {
        
            var water = new granny.Water(),
                // correct the position of the water depending on where she's looking at
                correctionX = this.granny.get('currentDirection') === 'left' ? 20 : -115;

            water.set({
                positionX: this.granny.get('positionX') - correctionX,
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
                worldHeight = this.world.get('height'),
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
                
                this.bowl.set({
                    lifes: this.bowl.get('lifes') - 1
                });
                
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
            cannon.set({
                positionX: this.bowl.get('positionX')
            });
            
            this.bowl.set({
                energy: 0
            });
            
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