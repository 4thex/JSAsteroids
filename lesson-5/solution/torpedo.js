var asteroids = asteroids || {};

asteroids.Torpedo = function(ctx) {

    var it = asteroids.Torpedo;
    
    it.halted = it.halted || window.setInterval(function() {
        window.clearTimeout(it.halted);
        delete it.halted;
    }, 200);
    
    this.position = {
        x: 0,
        y: 0
    };
    
    this.direction = 0;
    this.orientation = 0;
    this.speed = 1000;
    
    this.last = {};
    
    Object.defineProperty(this, 'parts', {
       get: function() {
           var segment = [];
           segment.push([this.position.x, this.position.y]);
           segment.push([this.last.position.x, this.last.position.y]);
           var part = [];
           part.push(segment);
           var parts = [];
           parts.push(part);
           return parts;
       } 
    });
    
    this.render = function() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, (360).toRad());
        ctx.fill();
        ctx.restore();
        this.last.position = this.last.position || {
            x: Number(this.position.x),
            y: Number(this.position.y)
        }
    };
    
    window.setTimeout(function(instance) {
        instance.expired = true;
    }.bind(null, this), 2000);
};