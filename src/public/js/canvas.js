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
const mouseMove = {
    x: 0,
    y: 0
}
let ballClicked = false;
const img = new Image();
img.src = '../img/basket.svg';
const Configs = {
    gravity: 1,
    friction: 0.7
};

const colors = ['#FFFF96', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    if (ballClicked) {
        mouseMove.x = event.movementX < 50 ? event.movementX : 50;
        mouseMove.y = event.movementY;
        ball.position.x = mouse.x;
        ball.position.y = mouse.y;
    } 
    ball.postion = mouse;

})

addEventListener('mouseup', event => {
    if (ballClicked) {
        ball.dy = mouseMove.y;
        ball.dx = mouseMove.x;
    }
    ballClicked = false;
})

addEventListener('mousedown', event => {
    var click = {
        x: mouse.x,
        y: mouse.y
    };

    var r = ball.radius;
    var d = distanceOf2VectorsCirle(ball.position, click);

    if (d < r) {
        ballClicked = true;
        ball.dy = 0;
    }
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
function Object(x, y, dx, dy, radius, color) {
    this.radius = radius;
    this.dy = dy;
    this.dx = dx;
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
    c.stroke();
    c.closePath()
}

/**
 * Update function prototyped to the ball object
 */
Object.prototype.update = function() {
    // if the ball is clicked just draw the ball
    if (!ballClicked) {

        if(this.position.y - this.radius - this.dy > goal.position.y + goal.height-13 
            && this.position.y + this.radius + this.dy < goal.position.y + goal.height -13 + 200
            && this.position.x - this.radius - this.dy > goal.position.x - 145) {
            console.log('some stuff');
        }
        // reverse velocity if the ball moves out of the canvas on the y position
        if (this.position.y + this.radius + this.dy > canvas.height ) {
            this.dy = -this.dy * Configs.friction;
        } else {
            // increment velocity by gravity 
            this.dy += Configs.gravity;
        }
        // reverse velocity if the ball moves out of the canvas on the y position

        if (this.position.y + this.radius > goal.position.y
            && this.position.y + this.radius < goal.position.y + goal.height 
            && this.position.x > canvas.width - 20) {
                console.log('some stuff');
        }
        else if(this.position.x + this.radius + this.dx > canvas.width 
            || this.position.x - this.radius + this.dx<= 0) {
            this.dx = -this.dx * Configs.friction;
        }
        this.position.x += this.dx;
        this.position.y += this.dy;
    }
    this.draw()
}

/**
 * Goal object
 * @param {*} x position x
 * @param {*} y position y
 * @param {*} dy velocity y
 * @param {*} height height of the goal
 * @param {*} width width of the goal
 * @param {*} color the color of the goal
 */
function Goal(x, y, dy, height, width, color) {
    this.position = {
        x: x,
        y: y
    };
    this.dy = dy;
    this.height = height;
    this.width = width;
    this.color = color;
}

Goal.prototype.update = function () {
    // if (this.position.y + this.height + this.dy > canvas.height /1.5 
    //     || this.position.y  <= 0) {
    //     this.dy = -this.dy;
    // } 
    // this.position.y += this.dy;
    this.draw();
}
Goal.prototype.draw = function () {
    c.beginPath()
    c.rect(this.position.x-150, this.position.y + this.height-20, 150, 7, false)
    c.rect(this.position.x, this.position.y,this.width,  this.height,  false)
    c.drawImage(img, this.position.x-145, this.position.y+this.height-13, 140, 100);
    c.fillStyle = this.color;
    c.fill()
    c.stroke();
    c.closePath()
}

// Implementation
let ball;
let goal;
function init() {
    ball = new Object(canvas.width/2, 80, 2, 2, 50, "#FF7F66");
    goal = new Goal(canvas.width-5, 75, 4, 150, 100, "#111");
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    ball.update();
    goal.update();
}

init()
animate()
