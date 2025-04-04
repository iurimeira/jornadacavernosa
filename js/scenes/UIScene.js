class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Referência à cena principal do jogo
        this.gameScene = this.scene.get('GameScene');
        
        // Criar elementos da UI
        this.createUI();
        
        // Configurar sistema de diálogo
        this.createDialogueSystem();
        
        // Escutar eventos de diálogo da cena principal
        this.gameScene.events.on('startDialogue', this.startDialogue, this);
    }
    
    createUI() {
        // Criar container para UI
        this.uiContainer = this.add.container(0, 0);
        
        // Barra de status no topo
        this.statusBar = this.add.graphics();
        this.statusBar.fillStyle(GAME.colors.darkGray, 0.8);
        this.statusBar.fillRect(0, 0, 800, 40);
        this.uiContainer.add(this.statusBar);
        
        // Ícone do Modo Caverna
        this.logo = this.add.image(30, 20, 'logo');
        this.logo.setScale(0.05);
        this.uiContainer.add(this.logo);
        
        // Contador de dias
        this.dayCounter = this.add.text(60, 20, 'DIA: 1/40', {
            font: '16px Arial',
            fill: GAME.colors.white
        });
        this.dayCounter.setOrigin(0, 0.5);
        this.uiContainer.add(this.dayCounter);
        
        // Indicadores dos três pilares
        this.createPillarIndicators();
    }
    
    createPillarIndicators() {
        // Container para os indicadores
        this.pillarContainer = this.add.container(400, 20);
        this.uiContainer.add(this.pillarContainer);
        
        // Isolamento (azul)
        this.isolamentoIcon = this.add.graphics();
        this.isolamentoIcon.fillStyle(0x3498db, 1);
        this.isolamentoIcon.fillCircle(0, 0, 8);
        this.isolamentoText = this.add.text(15, 0, 'ISOLAMENTO', {
            font: '12px Arial',
            fill: GAME.colors.white
        });
        this.isolamentoText.setOrigin(0, 0.5);
        
        // Intencionalidade (verde)
        this.intencionalidadeIcon = this.add.graphics();
        this.intencionalidadeIcon.fillStyle(0x2ecc71, 1);
        this.intencionalidadeIcon.fillCircle(120, 0, 8);
        this.intencionalidadeText = this.add.text(135, 0, 'INTENCIONALIDADE', {
            font: '12px Arial',
            fill: GAME.colors.white
        });
        this.intencionalidadeText.setOrigin(0, 0.5);
        
        // Intensidade (vermelho)
        this.intensidadeIcon = this.add.graphics();
        this.intensidadeIcon.fillStyle(0xff0000, 1);
        this.intensidadeIcon.fillCircle(280, 0, 8);
        this.intensidadeText = this.add.text(295, 0, 'INTENSIDADE', {
            font: '12px Arial',
            fill: GAME.colors.white
        });
        this.intensidadeText.setOrigin(0, 0.5);
        
        // Adicionar ao container
        this.pillarContainer.add([
            this.isolamentoIcon, 
            this.isolamentoText,
            this.intencionalidadeIcon,
            this.intencionalidadeText,
            this.intensidadeIcon,
            this.intensidadeText
        ]);
    }
    
    createDialogueSystem() {
        // Container para o sistema de diálogo
        this.dialogueContainer = this.add.container(0, 0);
        this.dialogueContainer.setVisible(false);
        
        // Fundo semi-transparente
        this.dialogueBackground = this.add.graphics();
        this.dialogueBackground.fillStyle(0x000000, 0.7);
        this.dialogueBackground.fillRect(0, 400, 800, 200);
        this.dialogueContainer.add(this.dialogueBackground);
        
        // Área para retrato do personagem
        this.portraitBackground = this.add.graphics();
        this.portraitBackground.fillStyle(GAME.colors.darkGray, 1);
        this.portraitBackground.fillRect(20, 420, 160, 160);
        this.dialogueContainer.add(this.portraitBackground);
        
        // Retrato do personagem (será definido dinamicamente)
        this.portrait = this.add.image(100, 500, 'capitao_welcome');
        this.portrait.setScale(0.2);
        this.dialogueContainer.add(this.portrait);
        
        // Nome do personagem
        this.characterName = this.add.text(200, 430, 'CAPITÃO CAVERNA', {
            font: 'bold 18px Arial',
            fill: GAME.colors.red
        });
        this.dialogueContainer.add(this.characterName);
        
        // Texto do diálogo
        this.dialogueText = this.add.text(200, 470, '', {
            font: '16px Arial',
            fill: GAME.colors.white,
            wordWrap: { width: 580 }
        });
        this.dialogueContainer.add(this.dialogueText);
        
        // Indicador de continuar
        this.continueIndicator = this.add.text(750, 560, '▼', {
            font: '24px Arial',
            fill: GAME.colors.red
        });
        this.continueIndicator.setOrigin(1, 1);
        this.dialogueContainer.add(this.continueIndicator);
        
        // Animação do indicador de continuar
        this.tweens.add({
            targets: this.continueIndicator,
            y: 550,
            duration: 500,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });
        
        // Adicionar evento de clique para avançar o diálogo
        this.input.on('pointerdown', this.advanceDialogue, this);
    }
    
    startDialogue(dialogueData) {
        // Ativar flag de diálogo
        GAME.dialogActive = true;
        
        // Armazenar dados do diálogo atual e próximos
        this.currentDialogue = dialogueData;
        
        // Mostrar container de diálogo
        this.dialogueContainer.setVisible(true);
        
        // Definir nome do personagem
        if (dialogueData.character === 'capitao') {
            this.characterName.setText('CAPITÃO CAVERNA');
            this.characterName.setFill(GAME.colors.red);
        } else if (dialogueData.character === 'player') {
            this.characterName.setText('VOCÊ');
            this.characterName.setFill('#3498db');
        }
        
        // Definir retrato do personagem
        if (dialogueData.portrait) {
            this.portrait.setTexture(dialogueData.portrait);
            this.portrait.setVisible(true);
        } else if (dialogueData.character === 'player') {
            this.portrait.setVisible(false);
        }
        
        // Animação de digitação do texto
        this.typewriteText(dialogueData.text);
    }
    
    typewriteText(text) {
        // Limpar texto atual
        this.dialogueText.setText('');
        
        // Configurar animação de digitação
        this.textToType = text;
        this.typewriteIndex = 0;
        this.typewriteSpeed = 30; // ms por caractere
        
        // Iniciar animação de digitação
        this.typewriteEvent = this.time.addEvent({
            delay: this.typewriteSpeed,
            callback: this.typeNextCharacter,
            callbackScope: this,
            loop: true
        });
    }
    
    typeNextCharacter() {
        // Adicionar próximo caractere
        this.typewriteIndex++;
        this.dialogueText.setText(this.textToType.substring(0, this.typewriteIndex));
        
        // Parar quando todo o texto for digitado
        if (this.typewriteIndex === this.textToType.length) {
            this.typewriteEvent.remove();
            this.textFullyTyped = true;
        }
    }
    
    advanceDialogue() {
        // Ignorar se o diálogo não estiver ativo
        if (!GAME.dialogActive) return;
        
        // Se o texto ainda estiver sendo digitado, mostrar tudo de uma vez
        if (!this.textFullyTyped) {
            this.typewriteEvent.remove();
            this.dialogueText.setText(this.textToType);
            this.textFullyTyped = true;
            return;
        }
        
        // Se houver próximo diálogo, avançar
        if (this.currentDialogue.next) {
            this.startDialogue(this.currentDialogue.next);
        } else {
            // Caso contrário, encerrar diálogo
            this.dialogueContainer.setVisible(false);
            GAME.dialogActive = false;
        }
    }
    
    update() {
        // Atualizar contador de dias
        this.dayCounter.setText(`DIA: ${GAME.currentDay}/${GAME.maxDays}`);
    }
}
