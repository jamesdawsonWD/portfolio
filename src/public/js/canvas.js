import utils from './utils'
/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();



const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}
let ballClicked = false;

const Configs = {
    // for all config variables
};

const colors = ['#FFFF96', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    if (ballClicked) {
        ball.position.x = mouse.x;
        ball.position.y = mouse.y;
    } 
    console.log(mouse);
    ball.postion = mouse;

})

addEventListener('mouseup', event => {
    ballClicked = false;
})
addEventListener('mousedown', event => {
    var click = {
        x: event.clientX,
        y: event.clientY
    };
    var r = ball.radius;
    var d = distanceOf2VectorsCirle(ball.position, click);
    if (d < r) ballClicked = true;
    console.log(ball.position, d < r)

})
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

function distanceOf2VectorsCirle(circleCenter, vector) {
    return Math.sqrt(Math.pow(vector.x - circleCenter.x, 2) + Math.pow(vector.y - circleCenter.y, 2));
}
// Objects
function Object(x, y, radius, color) {
    this.radius = radius
    this.color = color
    this.position = {
        x: x,
        y: y
    };
}

Object.prototype.draw = function() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
}

Object.prototype.update = function() {
    this.draw()
}

// Implementation
let ball
function init() {
    ball = new Object(canvas.width/2, canvas.height/2, 50, "#FF7F66");

    
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fill();
    ball.update();
}

init()
animate()
