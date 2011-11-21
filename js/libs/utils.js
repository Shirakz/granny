$(function () {
    
    // window.granny = window.granny || {};
    
    // events across multiple views
    Backbone.View.prototype.event_aggregator = _.extend({}, Backbone.Events);
    
    _.mixin({
        capitalize: function (string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        }
    });
    
    window.requestAnimFrame = (function (){
        return  window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame || 
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    
    window.cancelRequestAnimFrame = (function () {
        return window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
    } )();
    
});