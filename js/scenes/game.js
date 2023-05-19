import { Scoreboard } from "../componentes/Scoreboard.js";
import { LiveCounter } from "../componentes/LiveCounter.js";

export class Game extends Phaser.Scene {
    constructor(){
        super({ key: 'game'});
    }

    init(){
        this.scoreboard = new Scoreboard(this);
        this.liveCounter = new LiveCounter(this, 3);
    }

    preload(){ // Cargar imagenes y audios
        this.load.image('background', 'images/background.png');
        this.load.image('plataforma', 'images/platform.png');
        this.load.image('bola', 'images/ball.png');
        
        // Boques
        this.load.image('bluebrick', 'images/brickBlue.png');
        this.load.image('blackbrick', 'images/brickBlack.png');
        this.load.image('greenbrick', 'images/brickGreen.png');
        this.load.image('orangebrick', 'images/brickOrange.png');

        // Audios
        this.load.audio('platformimpactsample', 'sounds/platform-impact.ogg');
        this.load.audio('brickimpactsample', 'sounds/brick-impact.ogg');
        this.load.audio('gameoversample', 'sounds/gameover.ogg');
        this.load.audio('winsample', 'sounds/you_win.ogg');
        this.load.audio('startgamesample', 'sounds/start-game.ogg');
        this.load.audio('livelostsample', 'sounds/live-lost.ogg');
    }

    create(){
        // no permitir que pase los bordes de izquierda, derecha, y arriba
        this.physics.world.setBoundsCollision(true, true, true, false);
        // Agregar imagen de fondo
        this.background = this.add.image(400, 250, 'background');

        this.bricks = this.physics.add.staticGroup({
            key: ['bluebrick', 'blackbrick', 'greenbrick', 'orangebrick'],
            frameQuantity: 10,
            gridAlign: {
                width: 10,
                height: 4,
                cellWidth: 67,
                cellHeight: 34,
                x: 112,
                y: 100
            }
        });


        this.scoreboard.create();
        this.liveCounter.create();
        this.plataforma = this.physics.add.image(400, 460, 'plataforma').setImmovable(); // crear plataforma
        this.plataforma.body.allowGravity = false;
        this.plataforma.setCollideWorldBounds(true);

        this.bola = this.physics.add.image(385, 438, 'bola');
        this.bola.setData('glue', true);
        this.bola.setCollideWorldBounds(true);

        this.physics.add.collider(this.bola, this.plataforma, this.incrementarPuntos, null, this);
        this.physics.add.collider(this.bola, this.bricks, this.brickImpact, null, this);
        this.bola.setBounce(1);

        this.cursores = this.input.keyboard.createCursorKeys();

        this.platformImpactSample = this.sound.add('platformimpactsample');
        this.brickImpactSample = this.sound.add('brickimpactsample');
        this.gameOverSample = this.sound.add('gameoversample');
        this.winSample = this.sound.add('winsample');
        this.startGameSample = this.sound.add('startgamesample');
        this.liveLostSample = this.sound.add('livelostsample');
    }

    incrementarPuntos(bola, plataforma){
        this.platformImpactSample.play();
        let relativeImpact = bola.x - plataforma.x;
        if (relativeImpact < 0.1 && relativeImpact > -0.1) {
            bola.setVelocityX(Phaser.Math,Between(-10, 10));
        } else {
            bola.setVelocityX(10 * relativeImpact);
        }
    }

    brickImpact(bola, brick){
        this.brickImpactSample.play();
        brick.disableBody(true, true);
        this.scoreboard.incrementoPuntos(10);
        if (this.bricks.countActive() === 0) {
            this.endGame(true);
        }
    }

    update(){
        if (this.cursores.left.isDown) {
            this.plataforma.setVelocityX(-500);
            if (this.bola.getData('glue')) {
                this.bola.setVelocityX(-500);
            }
        } else if (this.cursores.right.isDown) {
            this.plataforma.setVelocityX(500);
            if (this.bola.getData('glue')) {
                this.bola.setVelocityX(500);
            }
        } else {
            this.plataforma.setVelocityX(0);
            if (this.bola.getData('glue')) {
                this.bola.setVelocityX(0);
            }
        }

        if (this.bola.y > 500 && this.bola.active) {
            let gameNotFinished = this.liveCounter.liveLost();
            if (!gameNotFinished) {
                this.setInitialPlatformState();
            }
        }

        if (this.cursores.up.isDown && this.bola.getData('glue')) {
            this.startGameSample.play();
            this.bola.setVelocity(-75, -300);
            this.bola.setData('glue', false);
        }
    }

    endGame(completed = false) {
        if(!completed) {
            this.gameOverSample.play();
            this.scene.start('gameover');
          } else {
            this.winSample.play();
            this.scene.start('congratulations');
          }
    }

    setInitialPlatformState() {
        this.liveLostSample.play();
        this.plataforma.x = 400;
        this.plataforma.y = 460;
        this.bola.setVelocity(0,0);
        this.bola.x = 385;
        this.bola.y = 430;
        this.bola.setData('glue', true);
    }
}