var asteroids = asteroids || {};
window.addEventListener("load", function(event) {
   Number.prototype.toRad = function() {
      return this * Math.PI / 180; 
   };
   Number.prototype.toDeg = function() {
      return (180 * this) / Math.PI;
   };
   
   asteroids.canvas = new asteroids.Canvas();
   window.addEventListener("keydown", function(event) {
       if(event.repeat) return;
       asteroids.canvas.keys[event.key] = true;
      //  console.log("Down: " +event.key);
   });
   window.addEventListener("keyup", function(event) {
       asteroids.canvas.keys[event.key] = false;
      //  console.log("Up: "+event.key);
   });
});
