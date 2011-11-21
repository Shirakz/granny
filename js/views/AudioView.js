/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.AudioView = Backbone.View.extend({
    
        el: $('#toggleAudio'),
        
        
        events: {
            'click': 'toggleAudio'
        },
        
        
        initialize: function () {        
            _.bindAll(this, 'add', 'toggleAudio', 'enableAudio', 'disableAudio');
            
            this.world = granny.World;
            this.granny = granny.GrannySingleton;
            this.bowl = granny.BowlSingleton;
            
            this.enableAudio();
        },
        
        
        add: function (ev) {
            var sound = ev.get('addSound');
            sound.play();
        },
        
        
        toggleAudio: function (ev) {
            var sound = !this.world.get('sound');
            
            sound ? this.enableAudio() : this.disableAudio();

            this.world.set({sound: sound});
        },
        
                
        enableAudio: function () {
            this.granny.waters.bind('add', this.add);
            this.bowl.cannons.bind('add', this.add);

            this.el.html('Mute');
        },
        
        
        disableAudio: function () {
            this.granny.waters.unbind();
            this.bowl.cannons.unbind();
            
            this.el.html('Unmute');
        }        
    
    });
    
});