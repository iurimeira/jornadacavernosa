class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // Exibir logo durante o carregamento
        const logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'logo');
        logo.setScale(0.5);
        
        // Criar barra de progresso
        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 350, 320, 30);
        
        // Texto de carregamento
        const loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'CARREGANDO...', { 
            font: '20px Arial', 
            fill: GAME.colors.red 
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 5, '0%', { 
            font: '18px Arial', 
            fill: '#ffffff' 
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Atualizar barra de progresso durante o carregamento
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xff0000, 1);
            progressBar.fillRect(250, 360, 300 * value, 10);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Carregar assets do jogo
        
        // Tilesets
        this.load.image('tiles_basic', 'assets/tiles/basic/basictiles.png');
        this.load.image('tiles_characters', 'assets/tiles/basic/characters.png');
        this.load.image('tiles_things', 'assets/tiles/basic/things.png');
        
        // Sprites do Capitão Caverna
        this.load.image('capitao_apontando', 'assets/sprites/capitao_caverna/apontando.png');
        this.load.image('capitao_apresentando', 'assets/sprites/capitao_caverna/apresentando.png');
        this.load.image('capitao_bracos_cruzados', 'assets/sprites/capitao_caverna/Braços_Cruzados.png');
        this.load.image('capitao_celular', 'assets/sprites/capitao_caverna/celular.png');
        this.load.image('capitao_comemorando', 'assets/sprites/capitao_caverna/comemorando.png');
        this.load.image('capitao_legal', 'assets/sprites/capitao_caverna/legal.png');
        this.load.image('capitao_pc', 'assets/sprites/capitao_caverna/pc.png');
        this.load.image('capitao_welcome', 'assets/sprites/capitao_caverna/welcome.png');
        
        // UI e logos
        this.load.image('logo_mc', 'assets/images/logo-mc.png');
        this.load.image('logotype', 'assets/images/Logotype.png');
        
        // Simular carregamento mais longo para mostrar a tela de carregamento
        for (let i = 0; i < 100; i++) {
            this.load.image('logo_dummy' + i, 'assets/images/Vector.png');
        }
    }

    create() {
        // Animação de fade-in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        // Adicionar evento para iniciar a próxima cena após a animação
        this.time.delayedCall(1500, () => {
            this.scene.start('TitleScene');
        });
    }
}
