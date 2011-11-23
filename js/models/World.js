/*global $, _, Backbone, granny */
$(document).ready(function () {

    window.granny = window.granny || {};
    
    // singleton model; can be accessed from any view
    granny.World = new (Backbone.Model.extend({

        defaults: {
            name: 'world',
            width: $('#canvas').width(),
            height: $('#canvas').height(),
            ctx: document.getElementById('canvas').getContext('2d'),
            refreshRate: 1000 / 60, // lower = more fluid (and more CPU consuming)
            audio: true,
            stage: 'stageIntro',
            idAnimation: false,
            watersAdded: 0, // counting the ones catched
            deathSound: $('#death').get(0),
            winnerSound: $('#winner').get(0),
        },


        pressedKeys: {            
            65: false, // a
            68: false, // d 
            83: false, // s
            37: false, // <- (left key)
            39: false, // -> (right key)
            38: false // ^ (up key)
        },
        
        
        initialize: function () {        
            var stageIntroBg = new Image(),
                stage1Bg = new Image();
            
            stageIntroBg.src = 'img/stage-intro-bg.png';
            stage1Bg.src = 'img/stage1-bg.png';
            
            this.set({
                stageIntroBg: stageIntroBg,
                stage1Bg: stage1Bg
            });
        }
        
    }))();
    
});