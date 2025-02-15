const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rockImage = new Image();
rockImage.src = 'images/rock_object.png';
const rock = {
    radius: 25,
    x: 0,
    y: 500,
    speed: 5,
    jump: 20,
    velocityY: 0,
    velocityX: 0,
    gravity: 0.8,
    friction: 0.9,
    grounded: false,
    rotation: 0,
};
function drawRock() {
    ctx.save();
    ctx.translate(rock.x, rock.y);
    ctx.rotate(rock.rotation);
    ctx.drawImage(rockImage, -rock.radius, -rock.radius, rock.radius * 2, rock.radius * 2);
    ctx.restore();
}
//make rock

const platforms = [
    { x: 300, y: 400, width: 100, height: 20 },
    { x: 50, y: 100, width: 60, height: 20 },
    { x: 700, y: 300, width: 100, height: 20 },
    { x: 250, y: 200, width: 155, height: 20 },
];
const ground = {
    bottom: { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 }
};
function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = 'green';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height / 2);
        ctx.fillStyle = 'brown';
        ctx.fillRect(platform.x, platform.y + platform.height / 2, platform.width, platform.height / 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    } );
    const bottom = ground.bottom;
    ctx.fillStyle = 'green';
    ctx.fillRect(bottom.x, bottom.y, bottom.width, bottom.height / 2);
    ctx.fillStyle = 'brown';
    ctx.fillRect(bottom.x, bottom.y + bottom.height / 2, bottom.width, bottom.height / 2);
}//make platform

const goalImage = new Image();
goalImage.src = 'images/goal.png';
const goal = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
};
function drawGoal() {
    ctx.drawImage(goalImage, goal.x, goal.y, goal.width, goal.height);
}//make goal

const evilImage = new Image();
evilImage.src = 'images/lava.png';
const evils = [
    {x: 340, y: 560, width: 350, height: 25.15,},
    {x: 270, y: 100, width: 100, height: 20,},
];
function drawEvil() {
    evils.forEach(evil => {
        ctx.drawImage(evilImage, evil.x, evil.y, evil.width, evil.height);
    } );
}

const muds = [
    {x: 500, y: 200, width: 100, height: 20,},
    {x: 500, y: 50, width: 100, height: 20,},
];
function drawMud() {
    muds.forEach(mud => {
        ctx.fillStyle = '#654321';
        ctx.fillRect(mud.x, mud.y, mud.width, mud.height);
    } );
}//makes the varibles

const backgroundImage = new Image();
backgroundImage.src = 'images/background.jpg';
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

const keys = {};
let jumphold = null;

function drawobjects() {
    drawRock();
    drawPlatforms();
    drawGoal();
    drawEvil();
    drawMud();
}

function update() {
    clearCanvas();

    drawobjects();



    rock.velocityY += rock.gravity;
    rock.y += rock.velocityY;

    if (rock.y + rock.radius > canvas.height) {
        rock.y = canvas.height - rock.radius;
        rock.velocityY = 0;
        rock.grounded = true;
    } else {
        rock.grounded = false;
    }//applies gravity

    rock.velocityX *= rock.friction;
    rock.x += rock.velocityX;

    if (rock.x + rock.radius > canvas.width) {
        rock.x = canvas.width - rock.radius;
        rock.velocityX = 0;
    } else if (rock.x - rock.radius < 0) {
        rock.x = rock.radius;
        rock.velocityX = 0;
    }//applies better movement

    function collision(rock, bottomObstacle) {
        if (rock.x - rock.radius < bottomObstacle.x + bottomObstacle.width &&
            rock.x + rock.radius > bottomObstacle.x &&
            rock.y - rock.radius < bottomObstacle.y + bottomObstacle.height &&
            rock.y + rock.radius > bottomObstacle.y) {
            return true;
        }
    }//checks collision with objects
    function life(rock, object) {
        if (rock.y + rock.radius > object.y && rock.y < object.y) {
            rock.y = object.y - rock.radius;
            rock.velocityY = 0;
            rock.grounded = true;
        } else {
            rock.velocityY = 0; 
        }
        if (rock.x + rock.radius > object.x && rock.x - rock.radius < object.x + object.width) {
            if (rock.x + rock.radius - rock.velocityX <= object.x) {
                rock.x = object.x - rock.radius;
                rock.velocityX = 0;
            } else if (rock.x - rock.radius - rock.velocityX >= object.x + object.width) {
                rock.x = object.x + object.width + rock.radius;
                rock.velocityX = 0;
            }
        }
    }//determines outcomes of collision for object platforms


    platforms.forEach(platform => {
        if (collision(rock, platform)) {
            life(rock, platform);
        }
    });

    if (collision(rock, ground.bottom)) {
        life(rock, ground.bottom);
    }

    if (collision(rock, goal)) {
        alert('You win!');
        window.location.href = 'fifthlevel.html';
    }//moves to next level

    evils.forEach(evil => {
        if (collision(rock, evil)) {
            rock.x = 0;
            rock.y = 500;
            rock.velocityY = 0;
            rock.velocityX = 0;
        }
    });
    muds.forEach(mud => {
        if (collision(rock, mud)) {
            rock.velocityY = 0.4;
            rock.grounded = false;
        }
    });

    if (keys['ArrowLeft']) {
        rock.velocityX = -rock.speed;
        rock.rotation -= 0.4;
    }
    if (keys['ArrowRight']) {
        rock.velocityX = rock.speed;
        rock.rotation += 0.4;
    } //offers continous movement

    requestAnimationFrame(update);
}

function movePlayer(event) {
    keys[event.key] = event.type === 'keydown';

    if (event.key === ' ') {
        if (event.type === 'keydown' && rock.grounded && jumphold === null) {
            jumphold = Date.now();
        } else if (event.type === 'keyup' && jumphold !== null) {
            const jumpDuration = Date.now() - jumphold;
            const jumpHeight = Math.min(jumpDuration / 10, rock.jump);
            rock.velocityY = -jumpHeight;
            rock.grounded = false;
            jumphold = null;
        }
    }//gives varible jump height based on holding space
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', movePlayer);

let timeSpent = 0;
const timerElement = document.getElementById('timer');

function updateTimer() {
    timeSpent++;
    timerElement.textContent = `${timeSpent}s`;
}

setInterval(updateTimer, 1000);//sets timer

update();