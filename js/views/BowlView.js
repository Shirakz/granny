/*global granny, $, _, Backbone*/
window.granny = window.granny || {};

granny.BowlView = Backbone.View.extend({

    // entry point
    initialize: function () {
        // pass "this" referring to this object to the listed methods instead of the default "this"
        _.bindAll(this, 'moveLeft', 'moveRight', 'addCannon', 'fallCannon', 'missCannon', 'catchWater', 'addEnergy', 'kill', 'endTurn', 'restoreImage');

        this.world = granny.World;
        
        // instance the models
        this.model = new granny.Bowl();
        this.cannons = new granny.Cannons();

        this.model.set({
            positionY: this.world.get('height') - this.model.get('height')  + 12
        });

        this.event_aggregator.bind('catch:water', this.catchWater);
        this.event_aggregator.bind('miss:water', this.kill);
        this.event_aggregator.bind('add:cannon', this.addCannon);
        this.event_aggregator.bind('add:cannon', this.restoreImage);
        this.event_aggregator.bind('miss:cannon', this.missCannon);
        this.event_aggregator.bind('end:turn', this.endTurn);
        this.event_aggregator.bind('key:leftarrow', this.moveLeft);
        this.event_aggregator.bind('key:rightarrow', this.moveRight);
        
    },


    moveLeft: function () {
        var speed = this.model.get('speed'),
            x = this.model.get('positionX'),
            marginLeft = this.model.get('marginLeft');

        if (x > marginLeft) {
            this.model.set({positionX: x - speed});
        }

    },


    moveRight: function () {
        var speed = this.model.get('speed'),
            x = this.model.get('positionX'),
            marginRight = this.model.get('marginRight'),
            bowlWidth = this.model.get('width'),
            worldWidth = this.world.get('width');

        if (x < worldWidth - bowlWidth - marginRight) {
            this.model.set({positionX: x + speed});
        }

    },

    
    addCannon: function () {
        var energy = this.model.get('energy'),
            bowlX =  this.model.get('positionX'),
            cannon;

        if (energy < 5) {
            return;
        }

        cannon = new granny.Cannon();
        
        cannon.set({positionX: bowlX});

        this.model.set({
            energy: 0,
            currentImage: 0
        });

        this.cannons.add(cannon);
        this.event_aggregator.trigger('addCannon', cannon);
    },


    fallCannon: function (cannon) {
        var cannonY = cannon.get('positionY'),
            speed = cannon.get('speed');

        cannon.set({positionY: cannonY - speed});
    },


    missCannon: function (cannon) {
        cannon.destroy();
    },
    
    
    catchWater: function (water) {
        var that = this,
            image = this.model.get('currentImage') + 1,
            idAnimation = this.model.get('idActiveAnimation'),
            prevImage = 7;
            
        this.addEnergy(1);
        
        if (!idAnimation && image > 5) {

        // water splash mega animation
            idAnimation = setInterval(function () {
                image = prevImage === 7 ? 7 : 6;
                prevImage = image === 7 ? 6 : 7;

                that.model.set({
                    currentImage: image, 
                    positionY: that.world.get('height') - that.model.get('height')  - 5
                });
            }, 200);

            this.model.set({idActiveAnimation: idAnimation});

        } else if (image <= 5) {
            this.event_aggregator.trigger('bowl:catch', this.model);
            this.model.set({currentImage: image});
        } else {
            this.event_aggregator.trigger('bowl:catchFull', this.model, 'addSoundFull');
        }
    },
    
    
    restoreImage: function () {
        var energy = this.model.get('energy'),
            idAnimation = this.model.get('idActiveAnimation');
        
        clearTimeout(idAnimation);
        
        this.model.set({
            idActiveAnimation: false,
            positionY: this.world.get('height') - this.model.get('height')  + 12,
            currentImage: energy
        });
    },
    
    
    addEnergy: function (n) {
        var energy = this.model.get('energy');

        energy += n;

        this.model.set({energy: energy});

        console.log('bowl energy: ' + this.model.get('energy'));
    },


    kill: function () {
        var lifes = this.model.get('lifes') - 1;
        
        this.model.set({lifes: lifes});
        this.model.set({energy: 0});
        this.restoreImage();
        // this.model.set({currentImage: 0});

        console.log('bowl died! lifes: ' + this.model.get('lifes'));
    },

    
    endTurn: function () {
        this.cannons.reset();
        this.model.reset(['positionX', 'speed', 'energy']);
    }
});