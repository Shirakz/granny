/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.CollisionView = Backbone.View.extend({
    
        initialize: function () {        
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'checkWater', 'catchWater', 'missWater', 'checkCannon', 'hitCannon', 'missCannon');
            
            // reference the singletons locally
            this.world = granny.World;
            this.bowl = granny.BowlView;

            this.granny = granny.GrannySingleton;

            this.granny.waters.bind('change:positionY', this.checkWater);
            this.granny.waters.bind('catchWater', this.catchWater);
            this.granny.waters.bind('missWater', this.missWater);
            
            this.bowl.cannons.bind('change:positionY', this.checkCannon);
            this.bowl.cannons.bind('hitCannon', this.hitCannon);
            this.bowl.cannons.bind('missCannon', this.missCannon);            
        },
        
        
        checkCannon: function (cannon) {
            var cannonX = cannon.get('positionX'),
                cannonY = cannon.get('positionY'),
                cannonHeight = cannon.get('height'),
                cannonWidth = cannon.get('width'),
                grannyWidth = this.granny.model.get('width'),
                grannyHeight = this.granny.model.get('height'),
                grannyX = this.granny.model.get('positionX'),
                grannyY = this.granny.model.get('positionY'),
                canLeft = this.granny.model.get('currentDirection') === 'left' ? 70 : 0,
                canRight = this.granny.model.get('currentDirection') === 'right' ? -70 : 0;
                
            // on its way up
            if (cannonY > 0 - cannonHeight) {

                // granny hit zone
                if (cannonY < grannyY + (grannyHeight / 2)) {
                
                    // hits
                    if (cannonX  + cannonWidth >= grannyX + canLeft && cannonX  <= grannyX + grannyWidth + canRight) {
                        cannon.trigger('hitCannon', cannon);
                    }
                    
                }
                
            // miss
            } else {
                cannon.trigger('missCannon', cannon);
            }                
        },
        
        
        hitCannon: function (cannon) {
            this.granny.kill(1);
            cannon.destroy();
        },
        
        
        missCannon: function (cannon) {
            cannon.destroy();
        },
        
        
        checkWater: function (water) {        
            var worldHeight = this.world.get('height'),
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
                        water.trigger('catchWater', water);
                    }
                    
                }
                
            // didn't catch it    
            } else {
                water.trigger('missWater', water);
            }            
        },
        
                
        catchWater: function (water) {            
            this.bowl.addEnergy(1);
            water.destroy();
        },
        
        
        missWater: function (water) {
            this.bowl.kill(1);
            water.destroy();
        }
    
    });
    
});