/*global granny, $, _, Backbone*/
window.granny = window.granny || {};

granny.BowlView = Backbone.View.extend({

    // entry point
    initialize: function () {
        // pass "this" referring to this object to the listed methods instead of the default "this"
        _.bindAll(this, 'moveLeft', 'moveRight', 'addCannon', 'fallCannon', 'missCannon', 'catchWater', 'addEnergy', 'kill', 'endTurn');

        this.world = granny.World;
        
        // instance the models
        this.model = new granny.Bowl();
        this.cannons = new granny.Cannons();

        this.model.set({
            positionY: this.world.get('height') - this.model.get('height') - 10
        });

        this.event_aggregator.bind('catch:water', this.catchWater);
        this.event_aggregator.bind('miss:water', this.kill);
        this.event_aggregator.bind('miss:cannon', this.missCannon);
        this.event_aggregator.bind('end:turn', this.endTurn);
        
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

        this.model.set({energy: 0});

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
        this.addEnergy(1);
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

        console.log('bowl died! lifes: ' + this.model.get('lifes'));
    },

    
    endTurn: function () {
        this.cannons.reset();
        this.model.reset(['positionX', 'speed', 'energy']);
    }
});