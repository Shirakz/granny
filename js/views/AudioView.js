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
            
            this.enableAudio();
        },
        
        
        add: function (ev) {
            var sound = ev.get('addSound');
            sound.play();
        },
        
        
        toggleAudio: function (ev) {
            var audio = !this.world.get('audio');
            
            audio ? this.enableAudio() : this.disableAudio();

            this.world.set({audio: audio});
        },
        
                
        enableAudio: function () {
            this.event_aggregator.bind('addWater', this.add);
            this.event_aggregator.bind('addCannon', this.add);

            this.el.html('Mute');
        },
        
        
        disableAudio: function () {
            this.event_aggregator.unbind('addWater', this.add);
            this.event_aggregator.unbind('addCannon', this.add);
            
            this.el.html('Unmute');
        }        
    
    });
    
});