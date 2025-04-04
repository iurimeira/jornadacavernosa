// Arquivo de teste para verificar a integração de todos os componentes do jogo
class GameTester {
    constructor(game) {
        this.game = game;
        this.testResults = {
            sceneLoading: false,
            playerMovement: false,
            dialogueSystem: false,
            enemyBehavior: false,
            collisionDetection: false,
            uiElements: false,
            performance: false
        };
        
        // Ativar modo de debug para testes
        TEST_CONFIG.enableDebug();
    }
    
    // Executar todos os testes
    runAllTests() {
        console.log('Iniciando testes do jogo Modo Caverna...');
        
        this.testSceneLoading();
        this.testPlayerMovement();
        this.testDialogueSystem();
        this.testEnemyBehavior();
        this.testCollisionDetection();
        this.testUIElements();
        this.testPerformance();
        
        return this.getTestSummary();
    }
    
    // Testar carregamento de cenas
    testSceneLoading() {
        console.log('Testando carregamento de cenas...');
        
        // Verificar se todas as cenas foram registradas
        const requiredScenes = ['BootScene', 'PreloaderScene', 'TitleScene', 'GameScene', 'UIScene'];
        let scenesRegistered = true;
        
        requiredScenes.forEach(sceneName => {
            if (!this.game.scene.getScene(sceneName)) {
                console.error(`Cena ${sceneName} não encontrada!`);
                scenesRegistered = false;
            }
        });
        
        this.testResults.sceneLoading = scenesRegistered;
        TEST_CONFIG.logEvent('sceneLoadingTest', { success: scenesRegistered });
        
        return scenesRegistered;
    }
    
    // Testar movimentação do jogador
    testPlayerMovement() {
        console.log('Testando movimentação do jogador...');
        
        // Verificar se o jogador foi criado e pode se mover
        const gameScene = this.game.scene.getScene('GameScene');
        if (!gameScene || !gameScene.player) {
            console.error('Jogador não encontrado na GameScene!');
            this.testResults.playerMovement = false;
            TEST_CONFIG.logEvent('playerMovementTest', { success: false, error: 'Player not found' });
            return false;
        }
        
        // Simular movimento em todas as direções
        const directions = ['up', 'down', 'left', 'right'];
        let movementWorking = true;
        
        directions.forEach(direction => {
            // Resetar velocidade
            gameScene.player.setVelocity(0);
            
            // Simular movimento
            switch (direction) {
                case 'up':
                    gameScene.player.setVelocityY(-100);
                    break;
                case 'down':
                    gameScene.player.setVelocityY(100);
                    break;
                case 'left':
                    gameScene.player.setVelocityX(-100);
                    break;
                case 'right':
                    gameScene.player.setVelocityX(100);
                    break;
            }
            
            // Verificar se a velocidade foi aplicada corretamente
            if ((direction === 'up' && gameScene.player.body.velocity.y !== -100) ||
                (direction === 'down' && gameScene.player.body.velocity.y !== 100) ||
                (direction === 'left' && gameScene.player.body.velocity.x !== -100) ||
                (direction === 'right' && gameScene.player.body.velocity.x !== 100)) {
                console.error(`Movimento para ${direction} não funcionando corretamente!`);
                movementWorking = false;
            }
            
            // Resetar velocidade após o teste
            gameScene.player.setVelocity(0);
        });
        
        this.testResults.playerMovement = movementWorking;
        TEST_CONFIG.logEvent('playerMovementTest', { success: movementWorking });
        
        return movementWorking;
    }
    
    // Testar sistema de diálogo
    testDialogueSystem() {
        console.log('Testando sistema de diálogo...');
        
        // Verificar se o sistema de diálogo foi criado
        const gameScene = this.game.scene.getScene('GameScene');
        const uiScene = this.game.scene.getScene('UIScene');
        
        if (!gameScene || !uiScene || !uiScene.dialogueContainer) {
            console.error('Sistema de diálogo não encontrado!');
            this.testResults.dialogueSystem = false;
            TEST_CONFIG.logEvent('dialogueSystemTest', { success: false, error: 'Dialogue system not found' });
            return false;
        }
        
        // Testar inicialização de diálogo
        try {
            // Criar diálogo de teste
            const testDialogue = {
                character: 'capitao',
                portrait: 'capitao_welcome',
                text: 'Este é um diálogo de teste.',
                next: null
            };
            
            // Iniciar diálogo
            gameScene.events.emit('startDialogue', testDialogue);
            
            // Verificar se o diálogo está visível
            const dialogueVisible = uiScene.dialogueContainer.visible;
            
            // Verificar se o texto foi definido corretamente
            const textCorrect = uiScene.dialogueText.text === 'Este é um diálogo de teste.' || 
                               uiScene.textToType === 'Este é um diálogo de teste.';
            
            // Verificar se a flag de diálogo ativo foi definida
            const flagSet = GAME.dialogActive === true;
            
            const dialogueWorking = dialogueVisible && (textCorrect || flagSet);
            
            this.testResults.dialogueSystem = dialogueWorking;
            TEST_CONFIG.logEvent('dialogueSystemTest', { 
                success: dialogueWorking,
                dialogueVisible,
                textCorrect,
                flagSet
            });
            
            // Limpar estado após o teste
            uiScene.dialogueContainer.setVisible(false);
            GAME.dialogActive = false;
            
            return dialogueWorking;
        } catch (error) {
            console.error('Erro ao testar sistema de diálogo:', error);
            this.testResults.dialogueSystem = false;
            TEST_CONFIG.logEvent('dialogueSystemTest', { success: false, error: error.message });
            return false;
        }
    }
    
    // Testar comportamento dos inimigos
    testEnemyBehavior() {
        console.log('Testando comportamento dos inimigos...');
        
        // Verificar se a classe Enemy está funcionando
        try {
            const gameScene = this.game.scene.getScene('GameScene');
            
            if (!gameScene) {
                console.error('GameScene não encontrada!');
                this.testResults.enemyBehavior = false;
                TEST_CONFIG.logEvent('enemyBehaviorTest', { success: false, error: 'GameScene not found' });
                return false;
            }
            
            // Criar inimigo de teste
            const testEnemy = new Enemy(gameScene, 100, 100, GAME.inimigos.PROCRASTINADOR);
            
            // Verificar se o inimigo foi criado corretamente
            const enemyCreated = testEnemy instanceof Enemy;
            
            // Verificar se o inimigo tem as propriedades necessárias
            const hasProperties = testEnemy.type === GAME.inimigos.PROCRASTINADOR &&
                                 typeof testEnemy.health === 'number' &&
                                 typeof testEnemy.speed === 'number';
            
            // Testar método de dano
            let damageWorking = false;
            if (enemyCreated) {
                const initialHealth = testEnemy.health;
                testEnemy.takeDamage(10);
                damageWorking = testEnemy.health === initialHealth - 10;
            }
            
            // Limpar após o teste
            testEnemy.destroy();
            
            const enemyBehaviorWorking = enemyCreated && hasProperties && damageWorking;
            
            this.testResults.enemyBehavior = enemyBehaviorWorking;
            TEST_CONFIG.logEvent('enemyBehaviorTest', { 
                success: enemyBehaviorWorking,
                enemyCreated,
                hasProperties,
                damageWorking
            });
            
            return enemyBehaviorWorking;
        } catch (error) {
            console.error('Erro ao testar comportamento dos inimigos:', error);
            this.testResults.enemyBehavior = false;
            TEST_CONFIG.logEvent('enemyBehaviorTest', { success: false, error: error.message });
            return false;
        }
    }
    
    // Testar detecção de colisão
    testCollisionDetection() {
        console.log('Testando detecção de colisão...');
        
        try {
            // Testar utilitário de colisão
            const obj1 = { x: 100, y: 100, width: 20, height: 20 };
            const obj2 = { x: 110, y: 110, width: 20, height: 20 };
            const obj3 = { x: 200, y: 200, width: 20, height: 20 };
            
            // Deve detectar colisão entre obj1 e obj2
            const collision12 = GameUtils.checkCollision(obj1, obj2);
            
            // Não deve detectar colisão entre obj1 e obj3
            const collision13 = GameUtils.checkCollision(obj1, obj3);
            
            const collisionWorking = collision12 === true && collision13 === false;
            
            this.testResults.collisionDetection = collisionWorking;
            TEST_CONFIG.logEvent('collisionDetectionTest', { 
                success: collisionWorking,
                collision12,
                collision13
            });
            
            return collisionWorking;
        } catch (error) {
            console.error('Erro ao testar detecção de colisão:', error);
            this.testResults.collisionDetection = false;
            TEST_CONFIG.logEvent('collisionDetectionTest', { success: false, error: error.message });
            return false;
        }
    }
    
    // Testar elementos da UI
    testUIElements() {
        console.log('Testando elementos da UI...');
        
        try {
            const uiScene = this.game.scene.getScene('UIScene');
            
            if (!uiScene) {
                console.error('UIScene não encontrada!');
                this.testResults.uiElements = false;
                TEST_CONFIG.logEvent('uiElementsTest', { success: false, error: 'UIScene not found' });
                return false;
            }
            
            // Verificar se os elementos principais da UI existem
            const hasStatusBar = uiScene.statusBar !== undefined;
            const hasDayCounter = uiScene.dayCounter !== undefined;
            const hasPillarContainer = uiScene.pillarContainer !== undefined;
            const hasDialogueContainer = uiScene.dialogueContainer !== undefined;
            
            const uiElementsWorking = hasStatusBar && hasDayCounter && hasPillarContainer && hasDialogueContainer;
            
            this.testResults.uiElements = uiElementsWorking;
            TEST_CONFIG.logEvent('uiElementsTest', { 
                success: uiElementsWorking,
                hasStatusBar,
                hasDayCounter,
                hasPillarContainer,
                hasDialogueContainer
            });
            
            return uiElementsWorking;
        } catch (error) {
            console.error('Erro ao testar elementos da UI:', error);
            this.testResults.uiElements = false;
            TEST_CONFIG.logEvent('uiElementsTest', { success: false, error: error.message });
            return false;
        }
    }
    
    // Testar performance
    testPerformance() {
        console.log('Testando performance...');
        
        try {
            // Verificar taxa de quadros
            const fps = this.game.loop.actualFps;
            
            // Verificar uso de memória (se disponível)
            let memoryUsage = 'N/A';
            if (window.performance && window.performance.memory) {
                memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) + ' MB';
            }
            
            // Considerar performance boa se FPS > 30
            const performanceGood = fps > 30;
            
            this.testResults.performance = performanceGood;
            TEST_CONFIG.logEvent('performanceTest', { 
                success: performanceGood,
                fps,
                memoryUsage
            });
            
            return performanceGood;
        } catch (error) {
            console.error('Erro ao testar performance:', error);
            this.testResults.performance = false;
            TEST_CONFIG.logEvent('performanceTest', { success: false, error: error.message });
            return false;
        }
    }
    
    // Obter resumo dos testes
    getTestSummary() {
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(result => result === true).length;
        
        return {
            totalTests,
            passedTests,
            success: passedTests === totalTests,
            results: this.testResults,
            details: TEST_CONFIG.getTestReport()
        };
    }
}
