// Otimizações para o jogo Modo Caverna
class GameOptimizer {
    constructor(game) {
        this.game = game;
        this.optimizationApplied = false;
        this.originalSettings = this.captureOriginalSettings();
    }
    
    // Capturar configurações originais para possível reversão
    captureOriginalSettings() {
        return {
            resolution: this.game.scale.resolution,
            autoCenter: this.game.scale.autoCenter,
            autoRound: this.game.scale.autoRound,
            fps: this.game.loop.targetFps
        };
    }
    
    // Aplicar otimizações baseadas no dispositivo e desempenho
    applyOptimizations() {
        if (this.optimizationApplied) return false;
        
        console.log('Aplicando otimizações ao jogo...');
        
        // Detectar tipo de dispositivo
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Detectar desempenho do dispositivo (simplificado)
        const performance = this.detectPerformance();
        
        // Aplicar otimizações baseadas no dispositivo e desempenho
        if (isMobile) {
            this.applyMobileOptimizations(performance);
        } else {
            this.applyDesktopOptimizations(performance);
        }
        
        this.optimizationApplied = true;
        return true;
    }
    
    // Detectar desempenho do dispositivo
    detectPerformance() {
        // Verificar FPS atual
        const currentFps = this.game.loop.actualFps;
        
        // Verificar número de núcleos da CPU (se disponível)
        const cpuCores = navigator.hardwareConcurrency || 4;
        
        // Verificar memória (se disponível)
        let memoryScore = 2; // Valor médio padrão
        if (window.performance && window.performance.memory) {
            const totalMemory = window.performance.memory.jsHeapSizeLimit;
            if (totalMemory > 2 * 1024 * 1024 * 1024) { // > 2GB
                memoryScore = 3; // Alto
            } else if (totalMemory < 512 * 1024 * 1024) { // < 512MB
                memoryScore = 1; // Baixo
            }
        }
        
        // Calcular pontuação de desempenho (1-3)
        let performanceScore = 2; // Médio por padrão
        
        if (currentFps > 50 && cpuCores >= 4 && memoryScore >= 2) {
            performanceScore = 3; // Alto
        } else if (currentFps < 30 || cpuCores <= 2 || memoryScore <= 1) {
            performanceScore = 1; // Baixo
        }
        
        return performanceScore;
    }
    
    // Otimizações para dispositivos móveis
    applyMobileOptimizations(performance) {
        console.log(`Aplicando otimizações para dispositivos móveis (desempenho: ${performance})...`);
        
        // Ajustar resolução baseada no desempenho
        switch (performance) {
            case 1: // Baixo desempenho
                this.game.scale.setResolution(0.5);
                this.game.loop.targetFps = 30;
                this.disableParticleEffects();
                this.reduceEnemyCount();
                break;
                
            case 2: // Médio desempenho
                this.game.scale.setResolution(0.75);
                this.game.loop.targetFps = 45;
                this.optimizeParticleEffects();
                break;
                
            case 3: // Alto desempenho
                // Manter configurações padrão
                break;
        }
        
        // Otimizações comuns para todos os dispositivos móveis
        this.optimizeTextureMemory();
        this.enableInputOptimizations();
    }
    
    // Otimizações para desktops
    applyDesktopOptimizations(performance) {
        console.log(`Aplicando otimizações para desktop (desempenho: ${performance})...`);
        
        // Ajustar configurações baseadas no desempenho
        switch (performance) {
            case 1: // Baixo desempenho
                this.game.scale.setResolution(0.75);
                this.game.loop.targetFps = 45;
                this.optimizeParticleEffects();
                break;
                
            case 2: // Médio desempenho
                // Manter configurações padrão
                this.optimizeTextureMemory();
                break;
                
            case 3: // Alto desempenho
                // Adicionar efeitos visuais extras para dispositivos de alto desempenho
                this.enhanceVisualEffects();
                break;
        }
    }
    
    // Otimizar uso de memória de texturas
    optimizeTextureMemory() {
        // Implementar limpeza de cache de texturas não utilizadas
        this.game.textures.on('addtexture', function(key) {
            console.log(`Textura adicionada: ${key}`);
        });
        
        // Desativar mipmaps para texturas menores
        this.game.textures.list.forEach(texture => {
            if (texture.source && texture.source[0]) {
                const source = texture.source[0];
                if (source.width < 128 && source.height < 128) {
                    texture.setFilter(Phaser.Textures.NEAREST);
                }
            }
        });
    }
    
    // Otimizar efeitos de partículas
    optimizeParticleEffects() {
        // Reduzir quantidade de partículas
        const gameScene = this.game.scene.getScene('GameScene');
        if (gameScene) {
            // Sobrescrever método de criação de partículas
            const originalCreateParticles = GameUtils.createCrystalParticles;
            GameUtils.createCrystalParticles = function(scene, x, y, color) {
                const particles = scene.add.particles(x, y, 'tiles_things', {
                    frame: 0,
                    lifespan: 800,
                    speed: { min: 40, max: 80 },
                    scale: { start: 0.4, end: 0 },
                    quantity: 5, // Reduzido de 10
                    tint: color,
                    blendMode: 'ADD'
                });
                
                scene.time.delayedCall(800, () => {
                    particles.destroy();
                });
                
                return particles;
            };
        }
    }
    
    // Desativar efeitos de partículas
    disableParticleEffects() {
        // Substituir método de criação de partículas por versão vazia
        GameUtils.createCrystalParticles = function(scene, x, y, color) {
            // Retornar objeto vazio com método destroy
            return { destroy: function() {} };
        };
    }
    
    // Reduzir número de inimigos
    reduceEnemyCount() {
        // Definir limite máximo de inimigos
        GAME.maxEnemies = 3; // Valor reduzido
    }
    
    // Melhorar efeitos visuais para dispositivos de alto desempenho
    enhanceVisualEffects() {
        // Adicionar efeitos visuais extras
        const gameScene = this.game.scene.getScene('GameScene');
        if (gameScene) {
            // Adicionar efeito de iluminação dinâmica (exemplo)
            gameScene.lights.enable();
            gameScene.lights.addLight(400, 300, 300, 0xffffff, 1);
            
            // Melhorar efeitos de partículas
            const originalCreateParticles = GameUtils.createCrystalParticles;
            GameUtils.createCrystalParticles = function(scene, x, y, color) {
                const particles = scene.add.particles(x, y, 'tiles_things', {
                    frame: 0,
                    lifespan: 1200,
                    speed: { min: 50, max: 120 },
                    scale: { start: 0.6, end: 0 },
                    quantity: 15, // Aumentado de 10
                    tint: color,
                    blendMode: 'ADD'
                });
                
                scene.time.delayedCall(1200, () => {
                    particles.destroy();
                });
                
                return particles;
            };
        }
    }
    
    // Otimizações para entrada em dispositivos móveis
    enableInputOptimizations() {
        // Adicionar controles virtuais para dispositivos móveis
        const gameScene = this.game.scene.getScene('GameScene');
        if (gameScene && gameScene.player) {
            // Implementar controles virtuais simples
            this.createVirtualControls(gameScene);
        }
    }
    
    // Criar controles virtuais para dispositivos móveis
    createVirtualControls(scene) {
        // Verificar se já existem controles virtuais
        if (document.getElementById('virtual-controls')) return;
        
        // Criar container para controles virtuais
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'virtual-controls';
        controlsContainer.style.position = 'fixed';
        controlsContainer.style.bottom = '20px';
        controlsContainer.style.left = '20px';
        controlsContainer.style.zIndex = '1000';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.flexDirection = 'column';
        
        // Criar D-pad
        const dpad = document.createElement('div');
        dpad.style.width = '150px';
        dpad.style.height = '150px';
        dpad.style.position = 'relative';
        
        // Botões direcionais
        const directions = [
            { id: 'up', label: '▲', x: 50, y: 0 },
            { id: 'right', label: '▶', x: 100, y: 50 },
            { id: 'down', label: '▼', x: 50, y: 100 },
            { id: 'left', label: '◀', x: 0, y: 50 }
        ];
        
        directions.forEach(dir => {
            const button = document.createElement('button');
            button.id = `btn-${dir.id}`;
            button.textContent = dir.label;
            button.style.position = 'absolute';
            button.style.left = `${dir.x}px`;
            button.style.top = `${dir.y}px`;
            button.style.width = '50px';
            button.style.height = '50px';
            button.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            button.style.color = '#ffffff';
            button.style.border = 'none';
            button.style.borderRadius = '50%';
            button.style.fontSize = '20px';
            button.style.display = 'flex';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            button.style.cursor = 'pointer';
            
            // Eventos de toque
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleVirtualControl(scene, dir.id, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleVirtualControl(scene, dir.id, false);
            });
            
            dpad.appendChild(button);
        });
        
        // Botão de ação
        const actionButton = document.createElement('button');
        actionButton.id = 'btn-action';
        actionButton.textContent = 'A';
        actionButton.style.width = '60px';
        actionButton.style.height = '60px';
        actionButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        actionButton.style.color = '#ffffff';
        actionButton.style.border = 'none';
        actionButton.style.borderRadius = '50%';
        actionButton.style.fontSize = '24px';
        actionButton.style.position = 'fixed';
        actionButton.style.bottom = '40px';
        actionButton.style.right = '40px';
        actionButton.style.cursor = 'pointer';
        
        // Eventos de toque para botão de ação
        actionButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleVirtualControl(scene, 'action', true);
        });
        
        actionButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleVirtualControl(scene, 'action', false);
        });
        
        // Adicionar elementos ao DOM
        controlsContainer.appendChild(dpad);
        document.body.appendChild(controlsContainer);
        document.body.appendChild(actionButton);
        
        // Mostrar apenas em dispositivos móveis
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            controlsContainer.style.display = 'none';
            actionButton.style.display = 'none';
        }
    }
    
    // Manipular entrada de controles virtuais
    handleVirtualControl(scene, control, isPressed) {
        if (!scene.player) return;
        
        // Simular teclas do teclado
        switch (control) {
            case 'up':
                scene.cursors.up.isDown = isPressed;
                break;
            case 'down':
                scene.cursors.down.isDown = isPressed;
                break;
            case 'left':
                scene.cursors.left.isDown = isPressed;
                break;
            case 'right':
                scene.cursors.right.isDown = isPressed;
                break;
            case 'action':
                // Simular tecla de espaço
                scene.cursors.space.isDown = isPressed;
                if (isPressed) {
                    // Simular evento de tecla pressionada
                    scene.input.keyboard.emit('keydown-SPACE');
                }
                break;
        }
    }
    
    // Reverter otimizações para configurações originais
    revertOptimizations() {
        if (!this.optimizationApplied) return false;
        
        console.log('Revertendo otimizações...');
        
        // Restaurar configurações originais
        this.game.scale.setResolution(this.originalSettings.resolution);
        this.game.scale.autoCenter = this.originalSettings.autoCenter;
        this.game.scale.autoRound = this.originalSettings.autoRound;
        this.game.loop.targetFps = this.originalSettings.fps;
        
        // Remover controles virtuais
        const controlsContainer = document.getElementById('virtual-controls');
        const actionButton = document.getElementById('btn-action');
        
        if (controlsContainer) {
            document.body.removeChild(controlsContainer);
        }
        
        if (actionButton) {
            document.body.removeChild(actionButton);
        }
        
        this.optimizationApplied = false;
        return true;
    }
}
