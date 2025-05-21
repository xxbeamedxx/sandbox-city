const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player, cursors, map;
let blocks = {};
const blockSize = 32;

function preload() {
    this.load.image('ground', 'https://i.imgur.com/3h5Mf2y.png');
    this.load.image('player', 'https://i.imgur.com/QN5X1wL.png');
    this.load.image('block', 'https://i.imgur.com/uXJ4wB0.png');
}

function create() {
    map = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'ground').setOrigin(0, 0);

    // Add player sprite
    player = this.physics.add.sprite(100, 100, 'player').setScale(0.1);
    cursors = this.input.keyboard.createCursorKeys();

    // Event Listeners for Mining and Building
    this.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown()) {
            placeBlock(pointer.worldX, pointer.worldY, this);
        } else {
            mineBlock(pointer.worldX, pointer.worldY);
        }
    });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    }
}

function placeBlock(x, y, scene) {
    const gridX = Math.floor(x / blockSize) * blockSize;
    const gridY = Math.floor(y / blockSize) * blockSize;
    const key = `${gridX},${gridY}`;

    if (!blocks[key]) {
        blocks[key] = scene.add.sprite(gridX, gridY, 'block').setOrigin(0, 0);
    }
}

function mineBlock(x, y) {
    const gridX = Math.floor(x / blockSize) * blockSize;
    const gridY = Math.floor(y / blockSize) * blockSize;
    const key = `${gridX},${gridY}`;

    if (blocks[key]) {
        blocks[key].destroy();
        delete blocks[key];
    }
}
