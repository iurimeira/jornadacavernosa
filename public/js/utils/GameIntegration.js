// Integração do sistema de quiz e boss com o jogo principal
class GameIntegration {
    constructor(game) {
        this.game = game;
        this.initialized = false;
    }
    
    // Inicializar integração com o jogo
    init() {
        if (this.initialized) return;
        
        // Adicionar scripts ao documento HTML
        this.addScriptsToDocument();
        
        // Modificar o arquivo game.js para incluir os novos sistemas
        this.updateGameConfig();
        
        this.initialized = true;
        console.log("Integração de quiz e boss concluída com sucesso!");
    }
    
    // Adicionar scripts ao documento HTML
    addScriptsToDocument() {
        // Verificar se o index.html já tem os scripts
        const indexPath = '/home/ubuntu/modo_caverna_game/index.html';
        const fs = require('fs');
        
        if (fs.existsSync(indexPath)) {
            let indexContent = fs.readFileSync(indexPath, 'utf8');
            
            // Verificar se os scripts já estão incluídos
            if (!indexContent.includes('QuizSystem.js') || 
                !indexContent.includes('BossSystem.js') || 
                !indexContent.includes('BossSpriteGenerator.js')) {
                
                // Encontrar a posição para inserir os novos scripts (antes do script do jogo)
                const insertPosition = indexContent.indexOf('<!-- Inicialização do Jogo -->');
                
                if (insertPosition !== -1) {
                    // Criar string com os novos scripts
                    const newScripts = `
    <!-- Sistemas de Quiz e Boss -->
    <script src="js/systems/QuizSystem.js"></script>
    <script src="js/systems/BossSystem.js"></script>
    <script src="js/utils/BossSpriteGenerator.js"></script>
`;
                    
                    // Inserir os novos scripts
                    indexContent = indexContent.slice(0, insertPosition) + newScripts + indexContent.slice(insertPosition);
                    
                    // Salvar o arquivo atualizado
                    fs.writeFileSync(indexPath, indexContent, 'utf8');
                    console.log("Scripts adicionados ao index.html");
                }
            }
        }
    }
    
    // Atualizar configuração do jogo para incluir os novos sistemas
    updateGameConfig() {
        // Atualizar GameScene.js para integrar os sistemas de quiz e boss
        this.updateGameScene();
        
        // Atualizar UIScene.js para adicionar interface de quiz e batalha
        this.updateUIScene();
    }
    
    // Atualizar GameScene.js
    updateGameScene() {
        const gameScenePath = '/home/ubuntu/modo_caverna_game/js/scenes/GameScene.js';
        const fs = require('fs');
        
        if (fs.existsSync(gameScenePath)) {
            let content = fs.readFileSync(gameScenePath, 'utf8');
            
            // Verificar se já foi atualizado
            if (!content.includes('this.quizSystem') || !content.includes('this.bossSystem')) {
                // Adicionar inicialização dos sistemas no método create
                const createEndPosition = content.indexOf('create() {') + 'create() {'.length;
                
                const systemsInit = `
        // Inicializar gerador de sprites de boss
        this.bossSpriteGenerator = new BossSpriteGenerator(this);
        this.bossSpriteGenerator.generateAllBossSprites();
        
        // Inicializar sistema de quiz
        this.quizSystem = new QuizSystem(this);
        
        // Inicializar sistema de boss
        this.bossSystem = new BossSystem(this);
        
        // Conectar sistemas
        this.events.on('startQuizQuestion', this.handleQuizQuestion, this);
        this.events.on('startBossBattle', this.startBossBattle, this);
        this.events.on('bossDefeated', this.handleBossDefeated, this);
        this.events.on('unlockNextLevel', this.unlockNextLevel, this);
`;
                
                // Inserir inicialização dos sistemas
                content = content.slice(0, createEndPosition) + systemsInit + content.slice(createEndPosition);
                
                // Adicionar métodos para manipular quiz e boss
                const classEndPosition = content.lastIndexOf('}');
                
                const newMethods = `
    // Iniciar quiz para o nível atual
    startQuizForCurrentLevel() {
        const levelMappings = {
            1: 'vale_despertar',
            2: 'ruinas_ruptura',
            3: 'floresta_chamado'
        };
        
        const level = levelMappings[this.currentLevel] || 'vale_despertar';
        this.quizSystem.init(this.dialogueSystem);
        this.quizSystem.startQuiz(level, true);
    }
    
    // Manipular pergunta do quiz
    handleQuizQuestion(questionData) {
        // Pausar o jogo durante o quiz
        this.scene.pause();
        
        // Enviar pergunta para a UI
        this.scene.get('UIScene').showQuizQuestion(questionData);
    }
    
    // Iniciar batalha com boss
    startBossBattle(bossType) {
        // Configurar batalha
        this.bossSystem.startBossBattle(bossType);
        
        // Ativar interface de batalha
        this.scene.get('UIScene').showBossBattleUI(this.bossSystem.currentBoss);
    }
    
    // Manipular derrota de boss
    handleBossDefeated(bossName) {
        console.log(\`Boss derrotado: \${bossName}\`);
        
        // Desativar interface de batalha
        this.scene.get('UIScene').hideBossBattleUI();
        
        // Atualizar progresso do jogador
        this.playerProgress.defeatedBosses.push(bossName);
        
        // Salvar progresso
        this.savePlayerProgress();
    }
    
    // Desbloquear próximo nível
    unlockNextLevel() {
        // Incrementar nível atual
        this.currentLevel++;
        
        // Atualizar progresso do jogador
        this.playerProgress.unlockedLevels = Math.max(this.playerProgress.unlockedLevels, this.currentLevel);
        
        // Salvar progresso
        this.savePlayerProgress();
        
        // Mostrar mensagem de nível desbloqueado
        this.scene.get('UIScene').showLevelUnlockedMessage(this.currentLevel);
    }
    
    // Verificar se o jogador está em um checkpoint de quiz
    checkQuizCheckpoint() {
        // Verificar se o jogador está em uma posição de checkpoint
        const checkpoints = this.getQuizCheckpoints();
        const playerPos = { x: this.player.x, y: this.player.y };
        
        for (const checkpoint of checkpoints) {
            const distance = Phaser.Math.Distance.Between(
                playerPos.x, playerPos.y,
                checkpoint.x, checkpoint.y
            );
            
            if (distance < 50) {
                // Verificar se este checkpoint já foi ativado
                if (!this.activatedCheckpoints.includes(\`\${checkpoint.x},\${checkpoint.y}\`)) {
                    // Marcar checkpoint como ativado
                    this.activatedCheckpoints.push(\`\${checkpoint.x},\${checkpoint.y}\`);
                    
                    // Iniciar quiz
                    this.startQuizForCurrentLevel();
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Obter posições dos checkpoints de quiz para o nível atual
    getQuizCheckpoints() {
        // Posições dos checkpoints para cada nível
        const checkpointsByLevel = {
            1: [{ x: 800, y: 600 }],  // Final do Vale do Despertar
            2: [{ x: 1200, y: 800 }], // Final das Ruínas da Ruptura
            3: [{ x: 1600, y: 1000 }] // Final da Floresta do Chamado
        };
        
        return checkpointsByLevel[this.currentLevel] || [];
    }
    
    // Atualizar método update para verificar checkpoints
    update(time, delta) {
        // Código original de update
        
        // Verificar checkpoints de quiz
        if (this.player && !this.quizSystem.quizActive && !this.bossSystem.bossActive) {
            this.checkQuizCheckpoint();
        }
        
        // Atualizar sistema de boss
        if (this.bossSystem && this.bossSystem.bossActive) {
            this.bossSystem.update();
        }
    }
`;
                
                // Inserir novos métodos
                content = content.slice(0, classEndPosition) + newMethods + content.slice(classEndPosition);
                
                // Salvar o arquivo atualizado
                fs.writeFileSync(gameScenePath, content, 'utf8');
                console.log("GameScene.js atualizado com sucesso");
            }
        }
    }
    
    // Atualizar UIScene.js
    updateUIScene() {
        const uiScenePath = '/home/ubuntu/modo_caverna_game/js/scenes/UIScene.js';
        const fs = require('fs');
        
        if (fs.existsSync(uiScenePath)) {
            let content = fs.readFileSync(uiScenePath, 'utf8');
            
            // Verificar se já foi atualizado
            if (!content.includes('showQuizQuestion') || !content.includes('showBossBattleUI')) {
                // Adicionar inicialização dos elementos de UI no método create
                const createEndPosition = content.indexOf('create() {') + 'create() {'.length;
                
                const uiInit = `
        // Criar elementos de UI para quiz
        this.createQuizUI();
        
        // Criar elementos de UI para batalha de boss
        this.createBossBattleUI();
        
        // Esconder elementos inicialmente
        this.hideQuizUI();
        this.hideBossBattleUI();
`;
                
                // Inserir inicialização da UI
                content = content.slice(0, createEndPosition) + uiInit + content.slice(createEndPosition);
                
                // Adicionar métodos para UI de quiz e boss
                const classEndPosition = content.lastIndexOf('}');
                
                const newMethods = `
    // Criar elementos de UI para quiz
    createQuizUI() {
        // Fundo do quiz
        this.quizBackground = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width * 0.8,
            this.cameras.main.height * 0.7,
            0x000000
        );
        this.quizBackground.setStrokeStyle(4, 0xff0000);
        this.quizBackground.setOrigin(0.5);
        this.quizBackground.setAlpha(0.9);
        
        // Título do quiz
        this.quizTitle = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height * 0.25,
            'DESAFIO DO CONHECIMENTO',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff',
                stroke: '#ff0000',
                strokeThickness: 2
            }
        );
        this.quizTitle.setOrigin(0.5);
        
        // Texto da pergunta
        this.questionText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height * 0.35,
            '',
            {
                font: '18px Arial',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: this.cameras.main.width * 0.7 }
            }
        );
        this.questionText.setOrigin(0.5);
        
        // Opções de resposta (botões)
        this.optionButtons = [];
        const startY = this.cameras.main.height * 0.5;
        const spacing = 50;
        
        for (let i = 0; i < 4; i++) {
            const button = this.add.rectangle(
                this.cameras.main.width / 2,
                startY + (i * spacing),
                this.cameras.main.width * 0.7,
                40,
                0x333333
            );
            button.setStrokeStyle(2, 0xff0000);
            button.setOrigin(0.5);
            button.setInteractive({ useHandCursor: true });
            
            const text = this.add.text(
                this.cameras.main.width / 2,
                startY + (i * spacing),
                '',
                {
                    font: '16px Arial',
                    fill: '#ffffff',
                    align: 'center'
                }
            );
            text.setOrigin(0.5);
            
            // Adicionar evento de clique
            button.on('pointerdown', () => {
                this.handleQuizOptionSelected(i);
            });
            
            // Adicionar evento de hover
            button.on('pointerover', () => {
                button.setFillStyle(0x555555);
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(0x333333);
            });
            
            this.optionButtons.push({ button, text });
        }
    }
    
    // Mostrar pergunta do quiz
    showQuizQuestion(questionData) {
        // Mostrar UI do quiz
        this.showQuizUI();
        
        // Atualizar texto da pergunta
        this.questionText.setText(questionData.text);
        
        // Atualizar opções
        for (let i = 0; i < questionData.options.length; i++) {
            this.optionButtons[i].text.setText(questionData.options[i]);
        }
        
        // Armazenar callback para quando uma opção for selecionada
        this.currentQuizCallback = questionData.callback;
    }
    
    // Manipular seleção de opção do quiz
    handleQuizOptionSelected(optionIndex) {
        // Esconder UI do quiz
        this.hideQuizUI();
        
        // Chamar callback com a opção selecionada
        if (this.currentQuizCallback) {
            this.currentQuizCallback(optionIndex);
            this.currentQuizCallback = null;
        }
        
        // Retomar o jogo
        this.scene.resume('GameScene');
    }
    
    // Mostrar UI do quiz
    showQuizUI() {
        this.quizBackground.setVisible(true);
        this.quizTitle.setVisible(true);
        this.questionText.setVisible(true);
        
        for (const option of this.optionButtons) {
            option.button.setVisible(true);
            option.text.setVisible(true);
        }
    }
    
    // Esconder UI do quiz
    hideQuizUI() {
        this.quizBackground.setVisible(false);
        this.quizTitle.setVisible(false);
        this.questionText.setVisible(false);
        
        for (const option of this.optionButtons) {
            option.button.setVisible(false);
            option.text.setVisible(false);
        }
    }
    
    // Criar elementos de UI para batalha de boss
    createBossBattleUI() {
        // Fundo da barra de vida do boss
        this.bossHealthBarBg = this.add.rectangle(
            this.cameras.main.width / 2,
            50,
            this.cameras.main.width * 0.6,
            20,
            0x000000
        );
        this.bossHealthBarBg.setStrokeStyle(2, 0xffffff);
        
        // Barra de vida do boss
        this.bossHealthBar = this.add.rectangle(
            this.cameras.main.width / 2 - (this.cameras.main.width * 0.6) / 2,
            50,
            this.cameras.main.width * 0.6,
            20,
            0xff0000
        );
        this.bossHealthBar.setOrigin(0, 0.5);
        
        // Nome do boss
        this.bossNameText = this.add.text(
            this.cameras.main.width / 2,
            20,
            '',
            {
                font: 'bold 18px Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        this.bossNameText.setOrigin(0.5);
        
        // Botões de ataque
        this.attackButtons = [];
        const buttonWidth = this.cameras.main.width * 0.25;
        const startX = (this.cameras.main.width - buttonWidth * 3) / 2;
        const buttonY = this.cameras.main.height - 60;
        
        const attackTypes = [
            { name: 'ISOLAMENTO', color: 0x3498db },
            { name: 'INTENCIONALIDADE', color: 0x2ecc71 },
            { name: 'INTENSIDADE', color: 0xe74c3c }
        ];
        
        for (let i = 0; i < attackTypes.length; i++) {
            const button = this.add.rectangle(
                startX + (buttonWidth * i) + (buttonWidth / 2),
                buttonY,
                buttonWidth - 10,
                40,
                attackTypes[i].color
            );
            button.setStrokeStyle(2, 0xffffff);
            button.setOrigin(0.5);
            button.setInteractive({ useHandCursor: true });
            
            const text = this.add.text(
                startX + (buttonWidth * i) + (buttonWidth / 2),
                buttonY,
                attackTypes[i].name,
                {
                    font: 'bold 12px Arial',
                    fill: '#ffffff',
                    align: 'center'
                }
            );
            text.setOrigin(0.5);
            
            // Adicionar evento de clique
            button.on('pointerdown', () => {
                this.handleAttackButtonClicked(attackTypes[i].name.toLowerCase());
            });
            
            // Adicionar evento de hover
            button.on('pointerover', () => {
                button.setAlpha(0.8);
            });
            
            button.on('pointerout', () => {
                button.setAlpha(1);
            });
            
            this.attackButtons.push({ button, text });
        }
        
        // Área de mensagens de batalha
        this.battleMessageBg = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height - 120,
            this.cameras.main.width * 0.8,
            40,
            0x000000
        );
        this.battleMessageBg.setAlpha(0.7);
        this.battleMessageBg.setOrigin(0.5);
        
        this.battleMessageText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height - 120,
            '',
            {
                font: '16px Arial',
                fill: '#ffffff',
                align: 'center'
            }
        );
        this.battleMessageText.setOrigin(0.5);
    }
    
    // Mostrar UI de batalha de boss
    showBossBattleUI(bossData) {
        // Atualizar nome do boss
        this.bossNameText.setText(bossData.name);
        
        // Mostrar elementos de UI
        this.bossHealthBarBg.setVisible(true);
        this.bossHealthBar.setVisible(true);
        this.bossNameText.setVisible(true);
        this.battleMessageBg.setVisible(true);
        this.battleMessageText.setVisible(true);
        
        // Mostrar botões de ataque
        for (const button of this.attackButtons) {
            button.button.setVisible(true);
            button.text.setVisible(true);
        }
        
        // Mostrar mensagem inicial
        this.showBattleMessage(\`\${bossData.name} apareceu! Use os ataques baseados nos pilares do Modo Caverna!\`);
        
        // Atualizar barra de vida
        this.updateBossHealthBar(bossData.health, bossData.health);
    }
    
    // Esconder UI de batalha de boss
    hideBossBattleUI() {
        this.bossHealthBarBg.setVisible(false);
        this.bossHealthBar.setVisible(false);
        this.bossNameText.setVisible(false);
        this.battleMessageBg.setVisible(false);
        this.battleMessageText.setVisible(false);
        
        for (const button of this.attackButtons) {
            button.button.setVisible(false);
            button.text.setVisible(false);
        }
    }
    
    // Atualizar barra de vida do boss
    updateBossHealthBar(currentHealth, maxHealth) {
        const healthPercentage = Math.max(0, currentHealth / maxHealth);
        const width = this.cameras.main.width * 0.6 * healthPercentage;
        
        this.bossHealthBar.width = width;
    }
    
    // Mostrar mensagem de batalha
    showBattleMessage(message) {
        this.battleMessageText.setText(message);
        
        // Animar aparecimento da mensagem
        this.tweens.add({
            targets: this.battleMessageText,
            alpha: { from: 0, to: 1 },
            duration: 300,
            ease: 'Power2'
        });
        
        // Limpar mensagem após alguns segundos
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: this.battleMessageText,
                alpha: 0,
                duration: 300,
                ease: 'Power2'
            });
        });
    }
    
    // Manipular clique em botão de ataque
    handleAttackButtonClicked(attackType) {
        // Obter referência à cena do jogo
        const gameScene = this.scene.get('GameScene');
        
        // Executar ataque
        const bossDefeated = gameScene.bossSystem.playerAttackBoss(attackType);
        
        // Mostrar mensagem de ataque
        this.showBattleMessage(\`Você usou o poder do \${attackType.toUpperCase()}!\`);
        
        // Atualizar barra de vida
        this.updateBossHealthBar(
            gameScene.bossSystem.bossHealth,
            gameScene.bossSystem.currentBoss.health
        );
    }
    
    // Mostrar mensagem de nível desbloqueado
    showLevelUnlockedMessage(level) {
        // Mapear nível para nome
        const levelNames = {
            2: 'Ruínas da Ruptura',
            3: 'Floresta do Chamado',
            4: 'Montanha da Transformação'
        };
        
        const levelName = levelNames[level] || \`Nível \${level}\`;
        
        // Criar fundo da mensagem
        const messageBg = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width * 0.7,
            150,
            0x000000
        );
        messageBg.setStrokeStyle(4, 0xff0000);
        messageBg.setAlpha(0.9);
        messageBg.setOrigin(0.5);
        
        // Criar texto da mensagem
        const messageTitle = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 40,
            'NOVO NÍVEL DESBLOQUEADO!',
            {
                font: 'bold 24px Arial',
                fill: '#ffffff',
                stroke: '#ff0000',
                strokeThickness: 2
            }
        );
        messageTitle.setOrigin(0.5);
        
        const messageText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 10,
            levelName,
            {
                font: 'bold 28px Arial',
                fill: '#ffffff',
                align: 'center'
            }
        );
        messageText.setOrigin(0.5);
        
        // Animar aparecimento
        this.tweens.add({
            targets: [messageBg, messageTitle, messageText],
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power2'
        });
        
        // Remover após alguns segundos
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: [messageBg, messageTitle, messageText],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    messageBg.destroy();
                    messageTitle.destroy();
                    messageText.destroy();
                }
            });
        });
    }
`;
                
                // Inserir novos métodos
                content = content.slice(0, classEndPosition) + newMethods + content.slice(classEndPosition);
                
                // Salvar o arquivo atualizado
                fs.writeFileSync(uiScenePath, content, 'utf8');
                console.log("UIScene.js atualizado com sucesso");
            }
        }
    }
}

// Exportar classe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameIntegration;
}
