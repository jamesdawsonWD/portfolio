
/**
 * requestAnimationFrame
 */
import '../../../node_modules/simplex-noise/simplex-noise';

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


// Configs

var Configs = {
    backgroundColor: '#fff',
    particleNum: 50,
    step: 5,
    base: 1000,
    zInc: 0.001
};


// Vars

var canvas,
    context,
    updates = 0,
    screenWidth,
    screenHeight,
    centerX,
    centerY,
    particles = [],
    hueBase = 0,
    simplexNoise,
    zoff = 0,
    gui;


// Initialize

function init() {
    canvas = document.getElementById('c');
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize(null);

    for (var i = 0; i < Configs.particleNum; i++) {
        initParticle((particles[i] = new Particle()));
    }

    simplexNoise = new SimplexNoise();
    context.fillStyle = Configs.backgroundColor;
    canvas.addEventListener('click', onCanvasClick, false);

    var navItems = document.getElementsByClassName("nav");
    for (var i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener("click", function (i) {
            console.log(this);
            addAnimation(this, "slideUp");
        });

    }
    update();
}

function addAnimation(element, animation) {
    element.classList.add(animation);
}
// Event listeners

function onWindowResize(e) {
    screenWidth = canvas.width = window.innerWidth;
    screenHeight = canvas.height = window.innerHeight;

    centerX = screenWidth / 2;
    centerY = screenHeight / 2;

    context = canvas.getContext('2d');
    context.lineWidth = 2;
    context.lineCap = context.lineJoin = 'round';
    context.lineJoin = "bevel";
}

function onCanvasClick(e) {
    updates = 0;
    context.globalAlpha = 0.8;
    context.fillStyle = Configs.backgroundColor;
    context.fillRect(0, 0, screenWidth, screenHeight);

    simplexNoise = new SimplexNoise();
    update();
}


// Functions

function getNoise(x, y, z) {
    var octaves = 5, // makes things closer together
        fallout = 0.7,
        amp = 1, f = 1, sum = 0,
        i;

    for (i = 0; i < octaves; ++i) {
        amp *= fallout;
        sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5 + 1;
        f *= 2;
    }

    return sum;
}

function initParticle(p) {
    p.x = p.pastX = screenWidth * Math.random();
    p.y = p.pastY = screenHeight * Math.random();

    p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 20 / Math.PI;
    p.color.s = 0.6;
    p.color.l = 0.7;
    p.color.a = 0;
}


// Update
function update() {
    var step = Configs.step,
        base = Configs.base,
        i, p, angle, linewidthIncrease;

    for (i = 0; i < particles.length; i++) {
        p = particles[i];

        p.pastX = p.x;
        p.pastY = p.y;
        angle = Math.PI * 6 * getNoise(p.x / base * 2, p.y / base * 2, zoff);
        p.x += Math.cos(angle) * step;
        p.y += Math.sin(angle) * step;
        context.beginPath();
        if (i % 10 == 0) p.color.a = 0;
        if (p.color.a < 1) p.color.a += 0.1;

        context.strokeStyle = p.color.toString();
        context.moveTo(p.pastX, p.pastY);

        context.lineTo(p.x, p.y);
        context.stroke();

        if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
            initParticle(p);
        }
    }

    hueBase += 0.1;
    zoff += Configs.zInc;

    requestAnimationFrame(update);
}


/**
 * HSLA
 */
function HSLA(h, s, l, a) {
    this.h = h || 0;
    this.s = s || 0;
    this.l = l || 0;
    this.a = a || 0;
}

HSLA.prototype.toString = function () {
    return 'hsla(' + this.h + ',' + (this.s * 500) + '%,' + (this.l * 100) + '%,' + this.a / 2 + ')';
}

/**
 * Particle
 */
function Particle(x, y, color) {
    this.x = x || 0;
    this.y = y || 0;
    this.color = color || new HSLA();
    this.pastX = this.x;
    this.pastY = this.y;
}


// Run

init();
