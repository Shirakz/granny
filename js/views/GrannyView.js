/*global granny, $, _, Backbone*/
window.granny = window.granny || {}; 

granny.GrannyView = Backbone.View.extend({
    
    // entry point
    initialize: function () {        
        // pass "this" referring to this object to the listed methods instead of the default "this"
        _.bindAll(this, 'moveLeft', 'moveRight', 'addWater', 'destroyWater', 'fallWater', 'kill', 'endTurn');
        
        this.world = granny.World;

        // instance the models
        this.model = new granny.Granny();
        this.waters = new granny.Waters();       

        this.event_aggregator.bind('kill:granny', this.kill);
        this.event_aggregator.bind('miss:water', this.destroyWater);
        this.event_aggregator.bind('catch:water', this.destroyWater);
        this.event_aggregator.bind('end:turn', this.endTurn);

    },
    
    
    moveLeft: function () {
        var speed = this.model.get('speed'),
            x = this.model.get('positionX'),
            marginLeft = this.model.get('marginLeft');
            
        // correct the position "jump" when changing directions
        x = this.model.get('currentDirection') === 'right' ? x - 65 : x;
                    
        if (x > marginLeft) {                
            this.model.set({
                positionX: x - speed,
                currentDirection: 'left'
            });
        }

    },
    
    
    moveRight: function () {
        var x = this.model.get('positionX'),
            speed = this.model.get('speed'),
            marginRight = this.model.get('marginRight'),
            grannyWidth = this.model.get('width'),
            worldWidth = this.world.get('width');
        
        // correct the position "jump" when changing directions
        x = this.model.get('currentDirection') === 'left' ? x + 65 : x;

        if (x < worldWidth - grannyWidth - marginRight) {                
            this.model.set({
                positionX: x + speed,
                currentDirection: 'right'
            });                                    
        }
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
        this.event_aggregator.trigger('addWater', water);
    },
    
    
    destroyWater: function (water) {
        water.destroy();
    },
    
    
    fallWater: function (water) {        
        var waterY = water.get('positionY'),
            speed = water.get('speed');

        water.set({positionY: waterY + speed});
    },
    
    
    kill: function () {            
        var lifes = this.model.get('lifes') -1;
        
        this.model.set({lifes: lifes});
        
        console.log('granny died! lifes: ' + this.model.get('lifes'));            
    },
    
    endTurn: function () {
        this.waters.reset();
        this.model.reset(['positionX', 'currentDirection', 'speed']);
    }
    
});