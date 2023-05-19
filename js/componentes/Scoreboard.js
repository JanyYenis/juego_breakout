export class Scoreboard {
    constructor(scene) {
        this.relatedScene = scene;
        this.score = 0;
    }

    create() {
        this.scoreText = this.relatedScene.add.text(16, 16, 'PUNTOS: 0', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-seril'
        });
    }

    incrementoPuntos(puntos){
        this.score += puntos;
        this.scoreText.setText('PUNTOS: '+this.score);
    }

    totalScore() {
        this.relatedScene.add.text(340, 190, 'PUNTOS: '+this.score, {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'verdana, arial, sans-seril'
        });
    }
}