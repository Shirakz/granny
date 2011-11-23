/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.AudioView = Backbone.View.extend({
    
        el: $('#toggleAudio'),
        
        
        events: {
            'click': 'toggleAudio'
        },
        
        
        initialize: function () {        
            _.bindAll(this, 'play', 'toggleAudio', 'enableAudio', 'disableAudio');
            
            this.world = granny.World;
            
            this.enableAudio();
        },
        
        
        play: function (ev, name) {
            var sound;

            sound = !name ? ev.get('addSound') : ev.get(name);

            sound.pause();
            sound.currentTime = 0;
            sound.play();
        },
        
        
        toggleAudio: function (ev) {
            var audio = !this.world.get('audio');
            
            audio ? this.enableAudio() : this.disableAudio();

            this.world.set({audio: audio});
        },
        
                
        enableAudio: function () {
            this.event_aggregator.bind('addWater', this.play);
            this.event_aggregator.bind('addCannon', this.play);
            this.event_aggregator.bind('bowl:catch', this.play);
            this.event_aggregator.bind('bowl:catchFull', this.play);

            this.el.html('Mute');
        },
        
        
        disableAudio: function () {
            this.event_aggregator.unbind('addWater', this.play);
            this.event_aggregator.unbind('addCannon', this.play);
            
            this.el.html('Unmute');
        }        
    
    });
    
});