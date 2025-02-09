const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rockImage = new Image();
rockImage.src = 'images/rock_object.png';
const rock = {
    radius: 25,
    x: 0,
    y: 0,
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


const platforms = [
    { x: 100, y: 500, width: 200, height: 20 },
    { x: 300, y: 400, width: 100, height: 20 },
    { x: 375, y: 300, width: 75, height: 20 },
    { x: 475, y: 200, width: 100, height: 30 },
    { x: 600, y: 300, width: 100, height: 20 },
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
}

const goalImage = new Image();
goalImage.src = 'images/goal.png';
const goal = {
    x: 600,
    y: 250,
    width: 50,
    height: 50,
};
function drawGoal() {
    ctx.drawImage(goalImage, goal.x, goal.y, goal.width, goal.height);
}

const evilImage = new Image();
evilImage.src = 'images/lava.png';
const evil = {

};
function drawEvil() {
    ctx.drawImage(evilImage, evil.x, evil.y, evil.width, evil.height);
}

const mud = {

};
function drawMud() {
    ctx.fillStyle = mud.color;
    ctx.fillRect(mud.x, mud.y, mud.width, mud.height);
}

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
    }

    rock.velocityX *= rock.friction;
    rock.x += rock.velocityX;

    if (rock.x + rock.radius > canvas.width) {
        rock.x = canvas.width - rock.radius;
        rock.velocityX = 0;
    } else if (rock.x - rock.radius < 0) {
        rock.x = rock.radius;
        rock.velocityX = 0;
    }

    function collision(rock, bottomObstacle) {
        if (rock.x - rock.radius < bottomObstacle.x + bottomObstacle.width &&
            rock.x + rock.radius > bottomObstacle.x &&
            rock.y - rock.radius < bottomObstacle.y + bottomObstacle.height &&
            rock.y + rock.radius > bottomObstacle.y) {
            return true;
        }
    }
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
    }


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
        window.location.href = 'secondlevel.html';
    }

    if (collision(rock, evil)) {
        rock.x = 50;
        rock.y = 50;
        rock.velocityX = 0;
        rock.velocityY = 0;
    }
    if (collision(rock, mud)) {
        rock.velocityY = 0.4;
        rock.grounded = false;
    }

    if (keys['ArrowLeft']) {
        rock.velocityX = -rock.speed;
        rock.rotation -= 0.4;
    }
    if (keys['ArrowRight']) {
        rock.velocityX = rock.speed;
        rock.rotation += 0.4;
    }

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
    }
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', movePlayer);

update();