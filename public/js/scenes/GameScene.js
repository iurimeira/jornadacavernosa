class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Definir cor de fundo (preto do Modo Caverna)
        this.cameras.main.setBackgroundColor(GAME.colors.black);
        
        // Inicializar variáveis de jogo
        this.player = null;
        this.capitaoCaverna = null;
        this.enemies = null;
        this.cursors = null;
        this.dialogueActive = false;
        
        // Criar mapa do primeiro nível (Vale do Despertar)
        this.createMap();
        
        // Criar jogador
        this.createPlayer();
        
        // Criar Capitão Caverna
        this.createCapitaoCaverna();
        
        // Configurar câmera para seguir o jogador
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);
        
        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Iniciar sistema de diálogo
        this.scene.launch('UIScene');
        
        // Iniciar diálogo de introdução após um pequeno delay
        this.time.delayedCall(1000, () => {
            this.events.emit('startDialogue', {
                character: 'capitao',
                portrait: 'capitao_welcome',
                text: 'Bem-vindo à Caverna! Aqui começa sua jornada de transformação. Eu sou o Capitão Caverna, seu guia nesta aventura de 40 dias.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'Este é o Vale do Despertar, o primeiro passo da sua jornada. Aqui você aprenderá sobre o poder do ISOLAMENTO.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_bracos_cruzados',
                        text: 'Cuidado com os Procrastinadores e Distraidores! Eles tentarão impedir seu progresso. Use o poder do foco para derrotá-los!',
                        next: {
                            character: 'player',
                            text: 'Estou pronto para começar minha jornada!',
                            next: null
                        }
                    }
                }
            });
        });
        
        // Animação de fade-in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
    
    update() {
        // Não atualizar se o diálogo estiver ativo
        if (GAME.dialogActive) {
            this.player.setVelocity(0);
            return;
        }
        
        // Movimentação do jogador
        this.movePlayer();
        
        // Verificar interações
        this.checkInteractions();
    }
    
    createMap() {
        // Criar um mapa simples para o primeiro nível
        // Em uma implementação completa, usaríamos Tiled para criar mapas mais complexos
        
        // Criar grupo de tiles
        this.groundTiles = this.physics.add.staticGroup();
        
        // Criar chão básico (16x16 tiles)
        const mapWidth = 30;
        const mapHeight = 30;
        
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                // Criar padrão de tiles variado
                let tileIndex = 0;
                
                // Bordas do mapa são paredes
                if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1) {
                    // Adicionar parede
                    this.groundTiles.create(x * 16, y * 16, 'tiles_basic', 3).setOrigin(0);
                } else {
                    // Adicionar chão
                    this.groundTiles.create(x * 16, y * 16, 'tiles_basic', 0).setOrigin(0);
                    
                    // Adicionar alguns elementos decorativos aleatoriamente
                    if (Math.random() < 0.05) {
                        this.groundTiles.create(x * 16, y * 16, 'tiles_things', Math.floor(Math.random() * 4)).setOrigin(0);
                    }
                }
            }
        }
    }
    
    createPlayer() {
        // Criar jogador no centro do mapa
        this.player = this.physics.add.sprite(16 * 15, 16 * 15, 'tiles_characters', 0);
        this.player.setCollideWorldBounds(true);
        this.player.setSize(12, 12);
        this.player.setOffset(2, 4);
        
        // Adicionar colisão com tiles
        this.physics.add.collider(this.player, this.groundTiles);
        
        // Criar animações do jogador
        this.createPlayerAnimations();
    }
    
    createPlayerAnimations() {
        // Animações de movimento do jogador
        this.anims.create({
            key: 'player_idle',
            frames: [{ key: 'tiles_characters', frame: 0 }],
            frameRate: 10
        });
        
        this.anims.create({
            key: 'player_walk_down',
            frames: [
                { key: 'tiles_characters', frame: 0 },
                { key: 'tiles_characters', frame: 1 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player_walk_up',
            frames: [
                { key: 'tiles_characters', frame: 2 },
                { key: 'tiles_characters', frame: 3 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player_walk_left',
            frames: [
                { key: 'tiles_characters', frame: 4 },
                { key: 'tiles_characters', frame: 5 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player_walk_right',
            frames: [
                { key: 'tiles_characters', frame: 6 },
                { key: 'tiles_characters', frame: 7 }
            ],
            frameRate: 5,
            repeat: -1
        });
    }
    
    createCapitaoCaverna() {
        // Criar Capitão Caverna próximo ao jogador
        this.capitaoCaverna = this.physics.add.sprite(16 * 17, 16 * 15, 'capitao_welcome');
        this.capitaoCaverna.setScale(0.1);
        this.capitaoCaverna.setSize(20, 20);
        this.capitaoCaverna.setOffset(40, 40);
        
        // Adicionar colisão com tiles
        this.physics.add.collider(this.capitaoCaverna, this.groundTiles);
        
        // Adicionar zona de interação
        this.capitaoCavernaZone = this.add.zone(this.capitaoCaverna.x, this.capitaoCaverna.y).setSize(40, 40);
        this.physics.world.enable(this.capitaoCavernaZone);
    }
    
    movePlayer() {
        // Resetar velocidade
        this.player.setVelocity(0);
        
        // Movimento horizontal
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play('player_walk_left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play('player_walk_right', true);
        }
        
        // Movimento vertical
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-100);
            
            // Priorizar animação vertical apenas se não houver movimento horizontal
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.anims.play('player_walk_up', true);
            }
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(100);
            
            // Priorizar animação vertical apenas se não houver movimento horizontal
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                this.player.anims.play('player_walk_down', true);
            }
        }
        
        // Idle se não houver movimento
        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            this.player.anims.play('player_idle');
        }
    }
    
    checkInteractions() {
        // Verificar sobreposição com zona do Capitão Caverna
        const touching = this.physics.overlap(this.player, this.capitaoCavernaZone);
        
        // Se estiver próximo ao Capitão Caverna e pressionar espaço
        if (touching && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.events.emit('startDialogue', {
                character: 'capitao',
                portrait: 'capitao_apresentando',
                text: 'O Modo Caverna é baseado em três pilares: ISOLAMENTO, INTENCIONALIDADE e INTENSIDADE.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'Neste primeiro nível, você deve aprender a usar o poder do ISOLAMENTO para eliminar distrações.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_legal',
                        text: 'Continue explorando o Vale do Despertar e encontre os cristais de foco para fortalecer sua chama interna!',
                        next: null
                    }
                }
            });
        }
    }
}
