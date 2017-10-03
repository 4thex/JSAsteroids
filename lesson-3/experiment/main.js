(function() {
    window.addEventListener("load", function(){
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(100, 100);
        context.lineTo(800, 800);
        context.stroke();
    });
}());