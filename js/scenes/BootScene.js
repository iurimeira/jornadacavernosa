class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Carregar assets necessários para a tela de carregamento
        this.load.image('logo', 'assets/images/Vector.png');
        
        // Atualizar barra de progresso HTML durante o carregamento inicial
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            this.load.on('progress', (value) => {
                progressBar.style.width = `${Math.floor(value * 100)}%`;
            });
        }
    }

    create() {
        // Configurações iniciais do jogo
        this.input.maxPointers = 1;
        
        // Ajustar escala para dispositivos móveis
        this.scale.scaleMode = Phaser.Scale.FIT;
        this.scale.setGameSize(800, 600);
        
        // Definir cor de fundo (preto do Modo Caverna)
        this.cameras.main.setBackgroundColor(GAME.colors.black);
        
        // Iniciar a próxima cena
        this.scene.start('PreloaderScene');
    }
}
