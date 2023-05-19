import { RestartButton } from "../componentes/restart-button.js";

export class Congratulations extends Phaser.Scene {
    constructor(){
        super({ key: 'congratulations'});
        this.restartButton = new RestartButton(this);
    }

    preload() {
        this.load.image('congratulations', 'images/congratulations.png');
        this.restartButton.preload();
    }

    create() {
        // Agregar imagen de fondo
        this.add.image(400, 250, 'background');
        this.restartButton.create();
        this.congratsImage = this.add.image(400, 90, 'congratulations');
    }
}