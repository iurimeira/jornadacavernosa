class BossSystem {
    constructor(scene) {
        this.scene = scene;
        this.currentBoss = null;
        this.bossActive = false;
        this.bossHealth = 100;
        this.playerBuffs = {
            attack: 1,
            defense: 1,
            speed: 1
        };
        
        // Configurações dos bosses
        this.bossConfigs = this.setupBossConfigs();
    }
    
    // Configurar propriedades dos bosses
    setupBossConfigs() {
        return {
            procrastinador: {
                name: "Mestre Procrastinador",
                sprite: 'boss_procrastinador',
                health: 120,
                speed: 40,
                attackPower: 15,
                specialAttack: "adiarAtaque",
                weakness: "isolamento",
                description: "Um ser lento mas persistente que tenta convencer você a adiar suas ações. Sua presença causa uma sensação de letargia.",
                tauntMessages: [
                    "Por que fazer agora o que pode ser feito depois?",
                    "Relaxe... Você merece um descanso antes de continuar.",
                    "Não há pressa, amanhã você terá mais energia para isso.",
                    "Você realmente precisa fazer isso agora? Tem certeza?"
                ]
            },
            distraidor: {
                name: "Grande Distraidor",
                sprite: 'boss_distraidor',
                health: 100,
                speed: 80,
                attackPower: 10,
                specialAttack: "bombardearInformacoes",
                weakness: "intencionalidade",
                description: "Uma criatura rápida e barulhenta que bombardeia você com informações irrelevantes. Sua presença causa confusão mental.",
                tauntMessages: [
                    "Olha! Algo brilhante e interessante por ali!",
                    "Você viu aquela notificação? Pode ser importante!",
                    "Tantas coisas interessantes para ver, por que focar em apenas uma?",
                    "Você está perdendo tantas coisas enquanto está aqui..."
                ]
            },
            sabotador: {
                name: "Sabotador Interno",
                sprite: 'boss_sabotador',
                health: 150,
                speed: 60,
                attackPower: 20,
                specialAttack: "semearDuvida",
                weakness: "intensidade",
                description: "Um ser sombrio que planta sementes de dúvida em sua mente. Sua presença causa insegurança e medo do fracasso.",
                tauntMessages: [
                    "Você realmente acha que é capaz disso?",
                    "Lembra da última vez que você falhou? Vai acontecer de novo.",
                    "Por que se esforçar tanto? Você nunca será bom o suficiente.",
                    "Olhe para os outros, eles são muito melhores que você."
                ]
            },
            comparador: {
                name: "Comparador Supremo",
                sprite: 'boss_comparador',
                health: 130,
                speed: 50,
                attackPower: 15,
                specialAttack: "espelhoDistorcido",
                weakness: "todos",
                description: "Uma entidade que distorce sua percepção, fazendo você se comparar constantemente com padrões impossíveis.",
                tauntMessages: [
                    "Veja como os outros conseguiram em metade do tempo!",
                    "Aquela pessoa começou depois de você e já está muito à frente.",
                    "Seu progresso é tão lento comparado aos outros...",
                    "Por que você não consegue ser tão bom quanto eles?"
                ]
            }
        };
    }
    
    // Iniciar batalha com boss
    startBossBattle(bossType) {
        if (!this.bossConfigs[bossType]) {
            console.error(`Tipo de boss não encontrado: ${bossType}`);
            return false;
        }
        
        this.currentBoss = this.bossConfigs[bossType];
        this.bossHealth = this.currentBoss.health;
        this.bossActive = true;
        
        // Resetar buffs do jogador
        this.playerBuffs = {
            attack: 1,
            defense: 1,
            speed: 1
        };
        
        // Criar sprite do boss
        this.createBossSprite(bossType);
        
        // Iniciar interface de batalha
        this.scene.events.emit('startBossUI', this.currentBoss);
        
        // Emitir evento de início de batalha
        this.scene.events.emit('bossEncounterStarted', bossType);
        
        return true;
    }
    
    // Criar sprite do boss na cena
    createBossSprite(bossType) {
        // Posição do boss (à frente do jogador)
        const player = this.scene.player;
        const x = player.x + 100;
        const y = player.y;
        
        // Criar sprite do boss
        this.bossSprite = this.scene.physics.add.sprite(x, y, this.currentBoss.sprite);
        this.bossSprite.setScale(0.2);
        
        // Adicionar efeito de entrada
        this.scene.tweens.add({
            targets: this.bossSprite,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.1, to: 0.2 },
            duration: 1000,
            ease: 'Power2'
        });
        
        // Adicionar animação de flutuação
        this.scene.tweens.add({
            targets: this.bossSprite,
            y: y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Adicionar colisão com o jogador
        this.scene.physics.add.collider(player, this.bossSprite, this.onBossCollision, null, this);
        
        return this.bossSprite;
    }
    
    // Manipular colisão com o boss
    onBossCollision(player, boss) {
        if (!this.bossActive) return;
        
        // Calcular dano baseado no poder de ataque do boss e defesa do jogador
        const damage = Math.max(5, this.currentBoss.attackPower / this.playerBuffs.defense);
        
        // Aplicar dano ao jogador
        player.takeDamage(damage);
        
        // Efeito visual de dano
        this.scene.cameras.main.shake(200, 0.01);
        
        // Recuar jogador
        const angle = Phaser.Math.Angle.Between(boss.x, boss.y, player.x, player.y);
        player.setVelocity(
            Math.cos(angle) * 200,
            Math.sin(angle) * 200
        );
        
        // Mostrar mensagem de provocação aleatória do boss
        const taunt = this.currentBoss.tauntMessages[Math.floor(Math.random() * this.currentBoss.tauntMessages.length)];
        this.showBossTaunt(taunt);
    }
    
    // Mostrar mensagem de provocação do boss
    showBossTaunt(message) {
        // Criar balão de fala acima do boss
        const tauntText = this.scene.add.text(
            this.bossSprite.x,
            this.bossSprite.y - 50,
            message,
            {
                font: '14px Arial',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 },
                align: 'center',
                wordWrap: { width: 200 }
            }
        );
        tauntText.setOrigin(0.5);
        
        // Animar aparecimento e desaparecimento
        this.scene.tweens.add({
            targets: tauntText,
            alpha: { from: 0, to: 1 },
            y: this.bossSprite.y - 70,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: tauntText,
                    alpha: 0,
                    delay: 2000,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        tauntText.destroy();
                    }
                });
            }
        });
    }
    
    // Jogador ataca o boss
    playerAttackBoss(attackType) {
        if (!this.bossActive || !this.currentBoss) return false;
        
        let damage = 10; // Dano base
        let effectiveAttack = false;
        
        // Modificar dano baseado no tipo de ataque e fraqueza do boss
        switch (attackType) {
            case 'isolamento':
                damage *= this.playerBuffs.attack * 1.2;
                effectiveAttack = (this.currentBoss.weakness === 'isolamento' || this.currentBoss.weakness === 'todos');
                break;
                
            case 'intencionalidade':
                damage *= this.playerBuffs.attack * 1.3;
                effectiveAttack = (this.currentBoss.weakness === 'intencionalidade' || this.currentBoss.weakness === 'todos');
                break;
                
            case 'intensidade':
                damage *= this.playerBuffs.attack * 1.5;
                effectiveAttack = (this.currentBoss.weakness === 'intensidade' || this.currentBoss.weakness === 'todos');
                break;
                
            default:
                damage *= this.playerBuffs.attack;
        }
        
        // Multiplicador de dano para ataques efetivos
        if (effectiveAttack) {
            damage *= 2;
            this.showEffectivenessMessage("SUPER EFETIVO!");
        }
        
        // Aplicar dano ao boss
        this.bossHealth -= damage;
        
        // Atualizar UI
        this.scene.events.emit('updateBossHealth', this.bossHealth, this.currentBoss.health);
        
        // Efeito visual de dano
        this.scene.tweens.add({
            targets: this.bossSprite,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
        
        // Verificar se o boss foi derrotado
        if (this.bossHealth <= 0) {
            this.defeatBoss();
            return true;
        }
        
        // Boss contra-ataca com chance de usar ataque especial
        if (Math.random() < 0.3) {
            this.bossCastSpecialAttack();
        }
        
        return false;
    }
    
    // Mostrar mensagem de efetividade
    showEffectivenessMessage(message) {
        const text = this.scene.add.text(
            this.bossSprite.x,
            this.bossSprite.y - 30,
            message,
            {
                font: 'bold 18px Arial',
                fill: '#ff0000',
                stroke: '#ffffff',
                strokeThickness: 3
            }
        );
        text.setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: this.bossSprite.y - 80,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                text.destroy();
            }
        });
    }
    
    // Boss usa ataque especial
    bossCastSpecialAttack() {
        if (!this.currentBoss || !this.currentBoss.specialAttack) return;
        
        // Efeito visual de preparação
        this.scene.tweens.add({
            targets: this.bossSprite,
            scale: { from: 0.2, to: 0.25 },
            duration: 500,
            yoyo: true
        });
        
        // Mostrar mensagem de ataque especial
        this.showBossTaunt("ATAQUE ESPECIAL!");
        
        // Executar ataque especial baseado no tipo de boss
        switch (this.currentBoss.specialAttack) {
            case 'adiarAtaque':
                this.specialAttackAdiarAtaque();
                break;
                
            case 'bombardearInformacoes':
                this.specialAttackBombardearInformacoes();
                break;
                
            case 'semearDuvida':
                this.specialAttackSemearDuvida();
                break;
                
            case 'espelhoDistorcido':
                this.specialAttackEspelhoDistorcido();
                break;
        }
    }
    
    // Ataque especial do Procrastinador
    specialAttackAdiarAtaque() {
        // Reduzir velocidade do jogador temporariamente
        this.playerBuffs.speed *= 0.7;
        
        // Efeito visual
        this.scene.cameras.main.flash(500, 128, 128, 255);
        
        // Mostrar mensagem de efeito
        this.scene.events.emit('showBattleMessage', "Sua velocidade foi reduzida! O Procrastinador está te deixando lento.");
        
        // Restaurar após 5 segundos
        this.scene.time.delayedCall(5000, () => {
            this.playerBuffs.speed /= 0.7;
            this.scene.events.emit('showBattleMessage', "Você recuperou sua velocidade!");
        });
    }
    
    // Ataque especial do Distraidor
    specialAttackBombardearInformacoes() {
        // Criar várias partículas de "informação" que o jogador deve evitar
        const particles = this.scene.add.particles(this.bossSprite.x, this.bossSprite.y, 'tiles_things', {
            frame: 0,
            lifespan: 3000,
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            quantity: 20,
            blendMode: 'ADD'
        });
        
        // Mostrar mensagem de efeito
        this.scene.events.emit('showBattleMessage', "O Distraidor está bombardeando você com informações! Evite as distrações!");
        
        // Destruir partículas após 3 segundos
        this.scene.time.delayedCall(3000, () => {
            particles.destroy();
        });
        
        // Reduzir poder de ataque temporariamente
        this.playerBuffs.attack *= 0.8;
        
        // Restaurar após 4 segundos
        this.scene.time.delayedCall(4000, () => {
            this.playerBuffs.attack /= 0.8;
            this.scene.events.emit('showBattleMessage', "Você recuperou seu foco!");
        });
    }
    
    // Ataque especial do Sabotador
    specialAttackSemearDuvida() {
        // Reduzir todos os buffs do jogador temporariamente
        this.playerBuffs.attack *= 0.7;
        this.playerBuffs.defense *= 0.7;
        
        // Efeito visual
        this.scene.cameras.main.flash(500, 0, 0, 0);
        
        // Mostrar mensagem de efeito
        this.scene.events.emit('showBattleMessage', "O Sabotador plantou dúvidas em sua mente! Seu ataque e defesa foram reduzidos.");
        
        // Restaurar após 6 segundos
        this.scene.time.delayedCall(6000, () => {
            this.playerBuffs.attack /= 0.7;
            this.playerBuffs.defense /= 0.7;
            this.scene.events.emit('showBattleMessage', "Você superou as dúvidas!");
        });
    }
    
    // Ataque especial do Comparador
    specialAttackEspelhoDistorcido() {
        // Criar efeito de espelho distorcido
        const mirror = this.scene.add.image(this.scene.player.x, this.scene.player.y, 'tiles_things', 5);
        mirror.setAlpha(0.7);
        mirror.setScale(3);
        
        // Mostrar mensagem de efeito
        this.scene.events.emit('showBattleMessage', "O Comparador está distorcendo sua percepção! Você está se comparando com padrões impossíveis.");
        
        // Inverter controles temporariamente
        this.scene.events.emit('invertControls', true);
        
        // Restaurar após 5 segundos
        this.scene.time.delayedCall(5000, () => {
            mirror.destroy();
            this.scene.events.emit('invertControls', false);
            this.scene.events.emit('showBattleMessage', "Você recuperou sua percepção correta!");
        });
    }
    
    // Derrotar boss
    defeatBoss() {
        if (!this.bossActive) return;
        
        this.bossActive = false;
        
        // Efeito visual de derrota
        this.scene.tweens.add({
            targets: this.bossSprite,
            alpha: 0,
            y: this.bossSprite.y - 50,
            scale: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Remover sprite do boss
                this.bossSprite.destroy();
                
                // Emitir evento de boss derrotado
                this.scene.events.emit('bossDefeated', this.currentBoss.name);
                
                // Iniciar diálogo de vitória
                this.startVictoryDialogue();
            }
        });
        
        // Adicionar partículas de derrota
        const particles = this.scene.add.particles(this.bossSprite.x, this.bossSprite.y, 'tiles_things', {
            frame: 0,
            lifespan: 1000,
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            quantity: 30,
            blendMode: 'ADD'
        });
        
        // Auto-destruir sistema de partículas após 1 segundo
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }
    
    // Iniciar diálogo de vitória
    startVictoryDialogue() {
        let victoryDialogue;
        
        switch (this.currentBoss.name) {
            case "Mestre Procrastinador":
                victoryDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: "Incrível! Você derrotou o Mestre Procrastinador! Agora você dominou o poder do ISOLAMENTO.",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "Você evoluiu do estado INCONFORMADO para o estado EXPLORADOR! Agora está pronto para explorar novos caminhos.",
                        next: {
                            character: 'player',
                            text: "Sinto que minha capacidade de foco aumentou! Estou pronto para o próximo desafio!",
                            next: null
                        }
                    }
                };
                break;
                
            case "Grande Distraidor":
                victoryDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: "Fantástico! Você derrotou o Grande Distraidor! Agora você dominou o poder da INTENCIONALIDADE.",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "Você evoluiu do estado EXPLORADOR para o estado PERCEPTIVO! Sua clareza de propósito está mais forte que nunca.",
                        next: {
                            character: 'player',
                            text: "Agora consigo ver claramente meus objetivos sem me distrair com o que não importa!",
                            next: null
                        }
                    }
                };
                break;
                
            case "Sabotador Interno":
                victoryDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: "Extraordinário! Você derrotou o Sabotador Interno! Agora você dominou o poder da INTENSIDADE.",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "Você evoluiu do estado PERCEPTIVO para o estado PERSISTENTE! Sua determinação é inabalável.",
                        next: {
                            character: 'player',
                            text: "Não vou mais duvidar da minha capacidade. Vou dar o meu máximo em cada desafio!",
                            next: null
                        }
                    }
                };
                break;
                
            default:
                victoryDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: "Parabéns! Você derrotou o boss e está mais próximo de dominar o Modo Caverna!",
                    next: {
                        character: 'player',
                        text: "Estou evoluindo cada vez mais!",
                        next: null
                    }
                };
        }
        
        // Iniciar diálogo de vitória
        this.scene.events.emit('startDialogue', victoryDialogue);
        
        // Quando o diálogo terminar, desbloquear próximo nível
        this.scene.events.once('endDialogue', () => {
            this.scene.events.emit('unlockNextLevel');
        });
    }
    
    // Atualizar estado do sistema de boss
    update() {
        if (!this.bossActive || !this.bossSprite) return;
        
        // Comportamento do boss durante a batalha
        // Pode ser expandido com movimentos, padrões de ataque, etc.
    }
}
