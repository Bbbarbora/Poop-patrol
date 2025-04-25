const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let maxPoops = 10;
let poops = [];

poops.push({ x: 300, y: 300, size: 15 });
let keys = {};
let gameOver = false;

let player = {
    x: 50,
    y: 50,
    size: 30,
    speed: 4
};

// Poslucháč na klávesy
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function spawnPoop() {
    let size = 15;
    let poop = {
        x: Math.random() * (canvas.width - size * 2) + size,
        y: Math.random() * (canvas.height - size * 2) + size,
        size: size
    };
    poops.push(poop);
}

function drawPoops() {
    poops.forEach(poop => {
        ctx.beginPath();
        ctx.fillStyle = "brown";
        ctx.arc(poop.x, poop.y, poop.size, 0, Math.PI * 2);
        ctx.fill();

        // pre zábavu: nakreslíme malé očka (emoji štýl 😄)
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(poop.x - 3, poop.y - 5, 2, 0, Math.PI * 2);
        ctx.arc(poop.x + 3, poop.y - 5, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// function drawPoops() {
//     poops.forEach(poop => {
//         ctx.fillStyle = "brown";
//         ctx.fillRect(poop.x, poop.y, poop.size, poop.size); // štvorček namiesto kruhu
//     });
// }

function movePlayer() {
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    // Hranice
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function checkCollisions() {
    poops = poops.filter(poop => {
        const dx = poop.x - (player.x + player.size / 2);
        const dy = poop.y - (player.y + player.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < poop.size + player.size / 2) {
            score++;
            document.getElementById("score").textContent = score;
            return false; // zbiera sa
        }
        return true;
    });
}

function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    drawPoops();
    checkCollisions();

    if (Math.random() < 0.006) {
        spawnPoop();
    }

    if (poops.length >= maxPoops) {
        gameOver = true;
        document.getElementById("gameOverMessage").textContent = "❌ Park je znečistený! Prehral/a si.";
    } else {
        requestAnimationFrame(updateGame);
    }
}

const directions = ["up", "down", "left", "right"];
directions.forEach(dir => {
    document.getElementById(dir).addEventListener("touchstart", () => {
        keys[`Arrow${dir.charAt(0).toUpperCase() + dir.slice(1)}`] = true;
    });
    document.getElementById(dir).addEventListener("touchend", () => {
        keys[`Arrow${dir.charAt(0).toUpperCase() + dir.slice(1)}`] = false;
    });
});

const buttons = document.querySelectorAll("#mobileControls button");

buttons.forEach(button => {
    button.addEventListener("touchstart", e => {
        e.preventDefault(); // zabrání scrollovaniu / zoomu
    }, { passive: false });
});

updateGame();
