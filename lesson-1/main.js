(function() {
   window.addEventListener("load", function(event) {
       canvas.initialize();
   });
   
   var canvas = {
     ctx: null,  
     initialize: function() {
         var element = document.getElementById("canvas");
         this.ctx = element.getContext("2d");
         this.ctx.fillRect(25, 25, 100, 100);
     }  
   };
}())