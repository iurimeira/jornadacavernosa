class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'tiles_characters', 0);
        
        // Adicionar à cena e habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propriedades físicas
        this.setCollideWorldBounds(true);
        this.setSize(12, 12);
        this.setOffset(2, 4);
        
        // Estado do jogador
        this.state = GAME.playerStates.INCONFORMADO;
        this.speed = 100;
        this.focusPower = 0;
        
        // Criar animações
        this.createAnimations();
    }
    
    createAnimations() {
        // Animações de movimento do jogador
        if (!this.scene.anims.exists('player_idle')) {
            this.scene.anims.create({
                key: 'player_idle',
                frames: [{ key: 'tiles_characters', frame: 0 }],
                frameRate: 10
            });
            
            this.scene.anims.create({
                key: 'player_walk_down',
                frames: [
                    { key: 'tiles_characters', frame: 0 },
                    { key: 'tiles_characters', frame: 1 }
                ],
                frameRate: 5,
                repeat: -1
            });
            
            this.scene.anims.create({
                key: 'player_walk_up',
                frames: [
                    { key: 'tiles_characters', frame: 2 },
                    { key: 'tiles_characters', frame: 3 }
                ],
                frameRate: 5,
                repeat: -1
            });
            
            this.scene.anims.create({
                key: 'player_walk_left',
                frames: [
                    { key: 'tiles_characters', frame: 4 },
                    { key: 'tiles_characters', frame: 5 }
                ],
                frameRate: 5,
                repeat: -1
            });
            
            this.scene.anims.create({
                key: 'player_walk_right',
                frames: [
                    { key: 'tiles_characters', frame: 6 },
                    { key: 'tiles_characters', frame: 7 }
                ],
                frameRate: 5,
                repeat: -1
            });
        }
    }
    
    update(cursors) {
        // Não atualizar se o diálogo estiver ativo
        if (GAME.dialogActive) {
            this.setVelocity(0);
            return;
        }
        
        // Resetar velocidade
        this.setVelocity(0);
        
        // Movimento horizontal
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.anims.play('player_walk_left', true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.anims.play('player_walk_right', true);
        }
        
        // Movimento vertical
        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            
            // Priorizar animação vertical apenas se não houver movimento horizontal
            if (!cursors.left.isDown && !cursors.right.isDown) {
                this.anims.play('player_walk_up', true);
            }
        } else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
            
            // Priorizar animação vertical apenas se não houver movimento horizontal
            if (!cursors.left.isDown && !cursors.right.isDown) {
                this.anims.play('player_walk_down', true);
            }
        }
        
        // Idle se não houver movimento
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            this.anims.play('player_idle');
        }
    }
    
    // Ativar poder do Isolamento
    activateIsolamento() {
        if (GAME.isolamento >= 30) {
            // Efeito visual
            this.scene.cameras.main.flash(500, 0, 0, 255);
            
            // Reduzir contador
            GAME.isolamento -= 30;
            
            // Aplicar efeito (a ser implementado)
            console.log('Poder do Isolamento ativado!');
            
            return true;
        }
        return false;
    }
    
    // Ativar poder da Intencionalidade
    activateIntencionalidade() {
        if (GAME.intencionalidade >= 30) {
            // Efeito visual
            this.scene.cameras.main.flash(500, 0, 255, 0);
            
            // Reduzir contador
            GAME.intencionalidade -= 30;
            
            // Aplicar efeito (a ser implementado)
            console.log('Poder da Intencionalidade ativado!');
            
            return true;
        }
        return false;
    }
    
    // Ativar poder da Intensidade
    activateIntensidade() {
        if (GAME.intensidade >= 30) {
            // Efeito visual
            this.scene.cameras.main.flash(500, 255, 0, 0);
            
            // Reduzir contador
            GAME.intensidade -= 30;
            
            // Aumentar velocidade temporariamente
            this.speed = 200;
            this.scene.time.delayedCall(5000, () => {
                this.speed = 100;
            });
            
            console.log('Poder da Intensidade ativado!');
            
            return true;
        }
        return false;
    }
    
    // Evoluir para o próximo estado
    evolve() {
        switch (this.state) {
            case GAME.playerStates.INCONFORMADO:
                this.state = GAME.playerStates.EXPLORADOR;
                break;
            case GAME.playerStates.EXPLORADOR:
                this.state = GAME.playerStates.PERCEPTIVO;
                break;
            case GAME.playerStates.PERCEPTIVO:
                this.state = GAME.playerStates.PERSISTENTE;
                break;
            case GAME.playerStates.PERSISTENTE:
                this.state = GAME.playerStates.VISIONARIO;
                break;
            case GAME.playerStates.VISIONARIO:
                this.state = GAME.playerStates.INCANSAVEL;
                break;
            case GAME.playerStates.INCANSAVEL:
                this.state = GAME.playerStates.INABALAVEL;
                break;
        }
        
        // Atualizar estado global
        GAME.currentState = this.state;
        
        // Efeito visual de evolução
        this.scene.cameras.main.flash(1000, 255, 255, 255);
        
        console.log(`Evoluiu para: ${this.state}`);
        
        return this.state;
    }
}
