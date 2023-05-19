import { RestartButton } from "../componentes/restart-button.js";
import { Scoreboard } from "../componentes/Scoreboard.js";

export class GameOver extends Phaser.Scene {
    constructor(){
        super({ key: 'gameover'});
        this.restartButton = new RestartButton(this);
        this.scoreboard = new Scoreboard(this);
    }

    preload() {
        this.load.image('gameover', 'images/gameover.png');
        this.restartButton.preload();
    }

    create() {
        // Agregar imagen de fondo
        this.add.image(400, 250, 'background');
        this.restartButton.create();
        // agregar imagen de GAME OVER
        this.gameover = this.add.image(400, 90, 'gameover');
        this.scoreboard.totalScore();
    }
}