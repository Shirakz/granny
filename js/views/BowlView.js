/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {};

    granny.BowlView = Backbone.View.extend({

        // entry point
        initialize: function () {
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'moveLeft', 'moveRight', 'addCannon', 'cannonFall', 'addEnergy', 'kill');

            this.world = granny.World;
            
            // instance the models
            this.model = new granny.Bowl();
            this.cannons = new granny.Cannons();

            this.model.set({
                positionY: this.world.get('height') - this.model.get('height') - 10
            });

            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.release);
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
        },


        cannonFall: function (cannon) {
            var cannonY = cannon.get('positionY'),
                speed = cannon.get('speed');

            cannon.set({positionY: cannonY - speed});
        },


        addEnergy: function (n) {
            var energy = this.model.get('energy');

            energy += n;

            this.model.set({energy: energy});

            console.log('bowl energy: ' + this.model.get('energy'));
        },


        kill: function (n) {
            var lifes = this.model.get('lifes');

            lifes -= n;

            if (lifes <= 0) {
                lifes = 0;
                console.log('bowl lost :(');
            }

            this.model.set({lifes: lifes});

            console.log('bowl died! lifes: ' + this.model.get('lifes'));
        }

    });
});