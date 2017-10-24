var asteroids = asteroids || {};

asteroids.Torpedo = function(ctx) {

    var it = asteroids.Torpedo;
    
    it.halted = it.halted || window.setInterval(function() {
        window.clearTimeout(it.halted);
        delete it.halted;
    }, 200);
    
    this.position = {
    };

    var currentPosition = {
        x: 0,
        y: 0
    };
    
    var lastPosition = {
        x: 0,
        y: 0
    };

    Object.defineProperty(this.position, 'x', {
       get: function() {
           return currentPosition.x;
       },
       set: function(value) {
           currentPosition.x = value;
       }
    });
    
    Object.defineProperty(this.position, 'y', {
       get: function() {
           return currentPosition.y;
       },
       set: function(value) {
           currentPosition.y = value;
       }
    });
    
    this.orientation = 0;
    this.speed = 1000;
    
    this.parts = [
        [
            [0, 0], [40, 0]
        ]
    ];
    
    this.render = function() {
        var d = this.speed / 10;
        // var dx = d * Math.cos((this.direction).toRad());
        // var dy = d * Math.sin((this.direction).toRad());

        ctx.save();
        ctx.translate(currentPosition.x, currentPosition.y);
        ctx.rotate((this.orientation).toRad());
        ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(5, 0);
        // ctx.stroke();
        ctx.arc(0, 0, 5, 0, (360).toRad());
        ctx.fill();
        ctx.restore();
    };
    
    window.setTimeout(function() {
        this.expired = true;
    }.bind(this), 2000);
};