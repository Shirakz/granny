/*global granny, $, _, Backbone*/
$(document).ready(function () {

    window.granny = window.granny || {}; 
    
    granny.SoundView = new (Backbone.View.extend({
    
        initialize: function () {        
            _.bindAll(this, 'add');
            
            this.granny = granny.GrannySingleton;
            this.bowl = granny.BowlSingleton;
            
           this.granny.waters.bind('add', this.add);           
           this.bowl.cannons.bind('add', this.add);
        },
        
        add: function (ev) {
            var sound = ev.get('addSound');
            sound.play();
        }
    
    }))();
    
});