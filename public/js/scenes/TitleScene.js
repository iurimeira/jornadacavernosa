class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // Definir cor de fundo (preto do Modo Caverna)
        this.cameras.main.setBackgroundColor(GAME.colors.black);
        
        // Adicionar logo do Modo Caverna
        const logo = this.add.image(this.cameras.main.width / 2, 150, 'logo_mc');
        logo.setScale(0.5);
        
        // Adicionar logotipo "Caverna"
        const logotype = this.add.image(this.cameras.main.width / 2, 250, 'logotype');
        logotype.setScale(0.7);
        
        // Adicionar subtítulo do jogo
        const subtitle = this.add.text(this.cameras.main.width / 2, 320, 'A JORNADA', {
            font: '28px Arial',
            fill: GAME.colors.white,
            fontStyle: 'bold'
        });
        subtitle.setOrigin(0.5);
        
        // Adicionar texto de instrução
        const startText = this.add.text(this.cameras.main.width / 2, 450, 'CLIQUE PARA INICIAR', {
            font: '20px Arial',
            fill: GAME.colors.red
        });
        startText.setOrigin(0.5);
        
        // Adicionar animação de pulsação ao texto
        this.tweens.add({
            targets: startText,
            alpha: 0.5,
            duration: 800,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
        
        // Adicionar Capitão Caverna na tela inicial
        const capitao = this.add.image(this.cameras.main.width / 2, 380, 'capitao_welcome');
        capitao.setScale(0.3);
        
        // Adicionar texto de versão
        const versionText = this.add.text(this.cameras.main.width - 10, this.cameras.main.height - 10, 'v1.0.0', {
            font: '12px Arial',
            fill: '#666666'
        });
        versionText.setOrigin(1);
        
        // Adicionar evento de clique para iniciar o jogo
        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('GameScene');
            });
        });
        
        // Animação de fade-in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
}
