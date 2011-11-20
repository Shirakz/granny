/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.GrannySingleton = new (Backbone.View.extend({
        
        pressedKeys: {            
            65: false, // a
            68: false, // d 
            83: false // s
        },
        
        // entry point
        initialize: function () {        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'keydown', 'release', 'moveLeft', 'moveRight', 'addWater', 'waterFall', 'loseLife');
            
            this.world = granny.World;

            // instance the models
            this.model = new granny.Granny();
            this.waters = new granny.Waters();            
                     
            // key events
            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.release);
        },

        
        // handle the keydown events
        keydown: function (ev) {              
            var that = this,    
                key = ev.keyCode;

            // if the key was just pressed
            if (!this.pressedKeys[key]) {                
                this.pressedKeys[key] = true;
                
                switch (key) {
                
                    // a
                    case 65:
                        this.moveLeft();
                        break;
                        
                    // d
                    case 68:
                        this.moveRight();
                        break;                          
                          
                    // s
                    case 83:                    
                        this.addWater();
                        break;  
                        
                }
            }
        },
        

        moveLeft: function () {
            var that = this,
                speed = this.model.get('speed'),
                refreshRate = this.world.get('refreshRate'),
                x = this.model.get('positionX'),
                marginLeft = this.model.get('marginLeft'),
                pause = this.world.get('pause');
            
            if (this.pressedKeys[65]) {
            
                // correct the position "jump" when changing directions
                x = this.model.get('currentDirection') === 'right' ? x - 65 : x;
                            
                if (x > marginLeft) {
                
                    if (!pause) {
                        this.model.set({
                            positionX: x - speed,
                            currentDirection: 'left'
                        });
                    }
                    setTimeout(that.moveLeft, refreshRate);
                }
            }        
        },
        
        
        moveRight: function () {
            var that = this,
                speed = this.model.get('speed'),
                refreshRate = this.world.get('refreshRate'),
                x = this.model.get('positionX'),
                marginRight = this.model.get('marginRight'),
                grannyWidth = that.model.get('width'),
                worldWidth = that.world.get('width'),
                pause = this.world.get('pause');
            
            if (this.pressedKeys[68]) {
            
                // correct the position "jump" when changing directions
                x = this.model.get('currentDirection') === 'left' ? x + 65 : x;

                if (x < worldWidth - grannyWidth - marginRight) {
                
                    if (!pause) {
                        that.model.set({
                            positionX: x + speed,
                            currentDirection: 'right'
                        });
                    }
                                    
                    setTimeout(that.moveRight, refreshRate);
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
                correctionX = this.model.get('currentDirection') === 'left' ? 20 : -115;

            water.set({
                positionX: this.model.get('positionX') - correctionX,
                positionY: this.model.get('positionY') + this.model.get('height') - 50
            });  
            
            this.waters.add(water);
            
            this.waterFall(water);            
        },
        
        
        waterFall: function (water) {        
            var that = this,
                waterY = water.get('positionY'),
                refreshRate = this.world.get('refreshRate'),
                speed = water.get('speed'),
                pause = this.world.get('pause');
                
            if (!pause) {
                water.set({
                    positionY: waterY + speed
                });
            }
            
            setTimeout(function () {
                // if the water is still alive, call again
                if (_.indexOf(that.waters.models, water) !== -1) {
                    that.waterFall(water);
                }
            }, refreshRate);               
        },
        
        
        loseLife: function (n) {            
            var lifes = this.model.get('lifes');
            
            lifes -= n;
            
            if (lifes <= 0) {
                lifes = 0;
                console.log('granny lost :(');
            }
            
            this.model.set({
                lifes: lifes
            });
            
            this.world.set({pause: true});
            
            console.log('granny died! lifes: ' + this.model.get('lifes'));            
        }
        
    }))();
});