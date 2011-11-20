/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {};

    granny.BowlSingleton = new (Backbone.View.extend({

        pressedKeys: {
            37: false, // <- (left key)
            39: false, // -> (right key)
            38: false // ^ (up key)
        },

        // entry point
        initialize: function () {
            // pass "this" referring to this object to the listed methods instead of the default "this"
            _.bindAll(this, 'keydown', 'release', 'moveLeft', 'moveRight', 'addCannon', 'cannonFall', 'gainEnergy', 'loseLife');

            // instance the models
            this.model = new granny.Bowl();
            this.cannons = new granny.Cannons();

            this.config = granny.Config;

            this.model.set({
                positionY: this.config.get('height') - this.model.get('height') - 10
            });

            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.release);
        },


        // handle the keydown events
        keydown: function (ev) {
            var key = ev.keyCode;

            // if the key was just pressed
            if (!this.pressedKeys[key]) {
                this.pressedKeys[key] = true;

                switch (key) {

                    // <- (left)
                    case 37:
                        this.moveLeft();
                        break;

                    // -> (right)
                    case 39:
                        this.moveRight();
                        break;

                    // ^ (up)
                    case 38:
                        this.addCannon();
                        break;
                        
                }
            }
        },


        moveLeft: function () {
            var that = this,
                speed = this.model.get('speed'),
                refreshRate = this.config.get('refreshRate'),
                x = this.model.get('positionX'),
                marginLeft = this.model.get('marginLeft');

            if (this.pressedKeys[37]) {
                if (x > marginLeft) {
                    this.model.set({
                        positionX: x - speed
                    });

                    setTimeout(that.moveLeft, refreshRate);
                }
            }
        },


        moveRight: function () {
            var that = this,
                speed = this.model.get('speed'),
                refreshRate = this.config.get('refreshRate'),
                x = this.model.get('positionX'),
                marginRight = this.model.get('marginRight'),
                bowlWidth = this.model.get('width'),
                configWidth = this.config.get('width');

            if (this.pressedKeys[39]) {
                if (x < configWidth - bowlWidth - marginRight) {
                    this.model.set({
                        positionX: x + speed
                    });

                    setTimeout(that.moveRight, refreshRate);
                }
            }
        },


        // handle the keyup events
        release: function (ev) {
            this.pressedKeys[ev.keyCode] = false;
        },


        addCannon: function () {
            var energy = this.model.get('energy'),
                cannon;

            if (energy < 5) {
                return;
            }

            cannon = new granny.Cannon();
            cannon.set({
                positionX: this.model.get('positionX')
            });

            this.model.set({
                energy: 0
            });

            this.cannons.add(cannon);

            this.cannonFall(cannon);
        },


        cannonFall: function (cannon) {
            var that = this,
                cannonY = cannon.get('positionY'),
                refreshRate = this.config.get('refreshRate'),
                speed = cannon.get('speed');

            cannon.set({
                positionY: cannonY - speed
            });

            setTimeout(function () {
                that.cannonFall(cannon);
            }, refreshRate);
        },


        gainEnergy: function (n) {
            var energy = this.model.get('energy');

            energy += n;

            this.model.set({
                energy: energy
            });

            console.log('bowl energy: ' + this.model.get('energy'));
        },


        loseLife: function (n) {
            var lifes = this.model.get('lifes');

            lifes -= n;

            if (lifes <= 0) {
                lifes = 0;
                console.log('bowl lost :(');
            }

            this.model.set({
                lifes: lifes
            });

            console.log('bowl died! lifes: ' + this.model.get('lifes'));
        }

    }))();
});