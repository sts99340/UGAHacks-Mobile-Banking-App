const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 20,
    jump: 20,
    velocityY: 0,
    velocityX: 0,
    gravity: 0.8,
    friction: 0.9,
    grounded: false,
};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clearCanvas();
    drawPlayer();

    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.grounded = true;
    } else {
        player.grounded = false;
    }

    player.velocityX *= player.friction;
    player.x += player.velocityX;

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        player.velocityX = 0;
    } else if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }

    requestAnimationFrame(update);
}

function movePlayer(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (player.grounded) {
                player.velocityY = -player.jump;
                player.grounded = false;
            }
        break;
        case 'ArrowLeft':
            player.velocityX = -player.speed;
            break;
        case 'ArrowRight':
            player.velocityX = player.speed;
            break;
    }
}

document.addEventListener('keydown', movePlayer);

update();