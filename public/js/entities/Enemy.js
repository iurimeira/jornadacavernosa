class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Selecionar sprite baseado no tipo de inimigo
        let spriteKey = 'tiles_characters';
        let spriteFrame = 8; // Frame padrão para inimigos
        
        switch (type) {
            case GAME.inimigos.PROCRASTINADOR:
                spriteFrame = 8;
                break;
            case GAME.inimigos.DISTRAIDOR:
                spriteFrame = 10;
                break;
            case GAME.inimigos.SABOTADOR:
                spriteFrame = 12;
                break;
            case GAME.inimigos.COMPARADOR:
                spriteFrame = 14;
                break;
        }
        
        super(scene, x, y, spriteKey, spriteFrame);
        
        // Adicionar à cena e habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propriedades físicas
        this.setCollideWorldBounds(true);
        this.setSize(12, 12);
        this.setOffset(2, 4);
        
        // Propriedades do inimigo
        this.type = type;
        this.health = 100;
        this.speed = 50;
        this.detectionRadius = 100;
        this.isAggressive = false;
        this.target = null;
        this.moveTimer = 0;
        this.moveDirection = new Phaser.Math.Vector2(0, 0);
        
        // Configurar comportamento baseado no tipo
        this.setupBehavior();
        
        // Criar animações
        this.createAnimations();
    }
    
    setupBehavior() {
        switch (this.type) {
            case GAME.inimigos.PROCRASTINADOR:
                // Lento mas persistente
                this.speed = 30;
                this.detectionRadius = 150;
                this.health = 120;
                break;
                
            case GAME.inimigos.DISTRAIDOR:
                // Rápido e errático
                this.speed = 80;
                this.detectionRadius = 120;
                this.health = 80;
                break;
                
            case GAME.inimigos.SABOTADOR:
                // Forte e agressivo
                this.speed = 50;
                this.detectionRadius = 180;
                this.health = 150;
                this.isAggressive = true;
                break;
                
            case GAME.inimigos.COMPARADOR:
                // Manipulador, ataca à distância
                this.speed = 40;
                this.detectionRadius = 200;
                this.health = 100;
                break;
        }
    }
    
    createAnimations() {
        // Animações baseadas no tipo de inimigo
        const frameBase = this.frame.texture.key === 'tiles_characters' ? this.frame.name : 0;
        
        // Animação de movimento para baixo
        this.scene.anims.create({
            key: `${this.type}_walk_down`,
            frames: [
                { key: 'tiles_characters', frame: frameBase },
                { key: 'tiles_characters', frame: frameBase + 1 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        // Animação de movimento para cima
        this.scene.anims.create({
            key: `${this.type}_walk_up`,
            frames: [
                { key: 'tiles_characters', frame: frameBase + 2 },
                { key: 'tiles_characters', frame: frameBase + 3 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        // Animação de movimento para esquerda
        this.scene.anims.create({
            key: `${this.type}_walk_left`,
            frames: [
                { key: 'tiles_characters', frame: frameBase + 4 },
                { key: 'tiles_characters', frame: frameBase + 5 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        // Animação de movimento para direita
        this.scene.anims.create({
            key: `${this.type}_walk_right`,
            frames: [
                { key: 'tiles_characters', frame: frameBase + 6 },
                { key: 'tiles_characters', frame: frameBase + 7 }
            ],
            frameRate: 5,
            repeat: -1
        });
        
        // Animação de idle
        this.scene.anims.create({
            key: `${this.type}_idle`,
            frames: [{ key: 'tiles_characters', frame: frameBase }],
            frameRate: 10
        });
    }
    
    update(time, delta, player) {
        // Não atualizar se o diálogo estiver ativo
        if (GAME.dialogActive) {
            this.setVelocity(0);
            return;
        }
        
        // Verificar se o jogador está no raio de detecção
        if (player) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            
            if (distance <= this.detectionRadius) {
                // Jogador detectado, perseguir
                this.target = player;
                this.isAggressive = true;
            } else if (this.isAggressive && distance > this.detectionRadius * 1.5) {
                // Jogador escapou, voltar ao comportamento normal
                this.target = null;
                this.isAggressive = false;
            }
        }
        
        // Comportamento baseado no estado atual
        if (this.isAggressive && this.target) {
            this.chaseTarget();
        } else {
            this.wander(time);
        }
        
        // Atualizar animação baseada na direção
        this.updateAnimation();
    }
    
    chaseTarget() {
        // Calcular direção para o alvo
        const direction = new Phaser.Math.Vector2(
            this.target.x - this.x,
            this.target.y - this.y
        ).normalize();
        
        // Aplicar velocidade
        this.setVelocity(
            direction.x * this.speed,
            direction.y * this.speed
        );
        
        // Salvar direção para animação
        this.moveDirection = direction;
    }
    
    wander(time) {
        // Mudar direção aleatoriamente a cada 2-4 segundos
        if (time > this.moveTimer) {
            // Gerar nova direção aleatória
            const angle = Phaser.Math.RND.angle();
            this.moveDirection = new Phaser.Math.Vector2(
                Math.cos(angle),
                Math.sin(angle)
            );
            
            // Aplicar velocidade reduzida durante perambulação
            this.setVelocity(
                this.moveDirection.x * this.speed * 0.5,
                this.moveDirection.y * this.speed * 0.5
            );
            
            // Definir próxima mudança de direção
            this.moveTimer = time + Phaser.Math.RND.between(2000, 4000);
            
            // Às vezes, parar completamente
            if (Phaser.Math.RND.between(0, 10) > 8) {
                this.setVelocity(0);
                this.anims.play(`${this.type}_idle`);
            }
        }
    }
    
    updateAnimation() {
        // Não atualizar animação se estiver parado
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            this.anims.play(`${this.type}_idle`, true);
            return;
        }
        
        // Determinar animação baseada na direção predominante
        if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
            // Movimento horizontal predominante
            if (this.body.velocity.x > 0) {
                this.anims.play(`${this.type}_walk_right`, true);
            } else {
                this.anims.play(`${this.type}_walk_left`, true);
            }
        } else {
            // Movimento vertical predominante
            if (this.body.velocity.y > 0) {
                this.anims.play(`${this.type}_walk_down`, true);
            } else {
                this.anims.play(`${this.type}_walk_up`, true);
            }
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        // Efeito visual de dano
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
        
        // Verificar se o inimigo foi derrotado
        if (this.health <= 0) {
            this.defeat();
        } else {
            // Tornar-se agressivo ao receber dano
            this.isAggressive = true;
        }
        
        return this.health <= 0;
    }
    
    defeat() {
        // Efeito visual de derrota
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            y: this.y - 20,
            duration: 500,
            onComplete: () => {
                // Emitir evento de inimigo derrotado
                this.scene.events.emit('enemyDefeated', this.type);
                
                // Remover inimigo
                this.destroy();
            }
        });
        
        // Adicionar partículas de derrota
        const particles = this.scene.add.particles(this.x, this.y, 'tiles_things', {
            frame: 0,
            lifespan: 1000,
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            quantity: 10,
            blendMode: 'ADD'
        });
        
        // Auto-destruir sistema de partículas após 1 segundo
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }
}
