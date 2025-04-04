class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.dialogueQueue = [];
        this.isActive = false;
        this.currentDialogue = null;
        this.textTyping = false;
        
        // Referência ao container de diálogo na UIScene
        this.uiScene = this.scene.scene.get('UIScene');
    }
    
    // Adicionar diálogo à fila
    queueDialogue(dialogueData) {
        this.dialogueQueue.push(dialogueData);
        
        // Se não houver diálogo ativo, iniciar o próximo
        if (!this.isActive) {
            this.startNextDialogue();
        }
    }
    
    // Iniciar próximo diálogo na fila
    startNextDialogue() {
        if (this.dialogueQueue.length > 0) {
            this.currentDialogue = this.dialogueQueue.shift();
            this.isActive = true;
            GAME.dialogActive = true;
            
            // Emitir evento para a UIScene
            this.scene.events.emit('startDialogue', this.currentDialogue);
        } else {
            this.isActive = false;
            GAME.dialogActive = false;
        }
    }
    
    // Avançar para o próximo diálogo ou finalizar
    advanceDialogue() {
        if (!this.isActive) return;
        
        // Se houver próximo diálogo no atual, avançar para ele
        if (this.currentDialogue.next) {
            this.currentDialogue = this.currentDialogue.next;
            this.scene.events.emit('startDialogue', this.currentDialogue);
        } else {
            // Verificar se há mais diálogos na fila
            if (this.dialogueQueue.length > 0) {
                this.startNextDialogue();
            } else {
                this.isActive = false;
                GAME.dialogActive = false;
                this.scene.events.emit('endDialogue');
            }
        }
    }
    
    // Carregar diálogos de um arquivo JSON
    loadDialoguesFromJSON(key) {
        return this.scene.cache.json.get(key);
    }
    
    // Obter diálogos específicos para o nível atual
    getDialoguesForLevel(level) {
        const allDialogues = {
            // Vale do Despertar (Nível 1)
            vale_despertar: {
                intro: {
                    character: 'capitao',
                    portrait: 'capitao_welcome',
                    text: 'Bem-vindo ao Vale do Despertar! Este é o primeiro passo da sua jornada no Modo Caverna.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'Aqui você aprenderá sobre o poder do ISOLAMENTO, o primeiro pilar do Modo Caverna.',
                        next: {
                            character: 'player',
                            text: 'O que exatamente é o Isolamento?',
                            next: {
                                character: 'capitao',
                                portrait: 'capitao_apresentando',
                                text: 'O Isolamento não é se afastar do mundo, mas sim eliminar distrações. É criar um ambiente propício para o foco profundo.',
                                next: {
                                    character: 'capitao',
                                    portrait: 'capitao_celular',
                                    text: 'Na prática, significa desligar notificações, afastar-se de interrupções e criar um espaço físico e mental para o trabalho intenso.',
                                    next: null
                                }
                            }
                        }
                    }
                },
                
                cristal_encontrado: {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: 'Excelente! Você encontrou um Cristal de Foco. Estes cristais fortalecem sua capacidade de Isolamento.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'Colete mais cristais para aumentar seu poder e derrotar os Procrastinadores que bloqueiam seu caminho.',
                        next: null
                    }
                },
                
                inimigo_derrotado: {
                    character: 'capitao',
                    portrait: 'capitao_legal',
                    text: 'Muito bem! Você derrotou um Procrastinador. Estas criaturas representam a tendência de adiar tarefas importantes.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'Cada inimigo derrotado fortalece sua determinação e te aproxima da evolução para o próximo estado.',
                        next: null
                    }
                },
                
                evolucao: {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: 'PARABÉNS! Você evoluiu do estado INCONFORMADO para o estado EXPLORADOR!',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apresentando',
                        text: 'Como EXPLORADOR, você agora está pronto para romper com velhos padrões e explorar novos caminhos.',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_apontando',
                            text: 'O portal para as Ruínas da Ruptura está aberto. Continue sua jornada e descubra o poder da INTENCIONALIDADE!',
                            next: null
                        }
                    }
                }
            },
            
            // Ruínas da Ruptura (Nível 2)
            ruinas_ruptura: {
                intro: {
                    character: 'capitao',
                    portrait: 'capitao_welcome',
                    text: 'Bem-vindo às Ruínas da Ruptura! Este é o segundo nível da sua jornada no Modo Caverna.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'Aqui você aprenderá sobre o poder da INTENCIONALIDADE, o segundo pilar do Modo Caverna.',
                        next: {
                            character: 'player',
                            text: 'O que significa Intencionalidade?',
                            next: {
                                character: 'capitao',
                                portrait: 'capitao_apresentando',
                                text: 'A Intencionalidade é sobre ter clareza absoluta do que você quer alcançar. É definir objetivos claros e específicos.',
                                next: {
                                    character: 'capitao',
                                    portrait: 'capitao_pc',
                                    text: 'Na prática, significa planejar suas ações com propósito, eliminando atividades que não te levam ao seu objetivo.',
                                    next: null
                                }
                            }
                        }
                    }
                }
            },
            
            // Frases motivacionais que podem aparecer em qualquer nível
            motivacionais: [
                {
                    character: 'capitao',
                    portrait: 'capitao_legal',
                    text: '"A Caverna não é um lugar físico, é a representação da sua mente."',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: '"Não basta estar na Caverna. É preciso ATIVAR o MODO CAVERNA!"',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_comemorando',
                    text: '"Agir com intensidade é um ato de fé. É a prova de que você realmente acredita no seu plano."',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_welcome',
                    text: '"Você não precisa ser melhor que os outros. Precisa ser melhor que você mesmo ontem."',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_bracos_cruzados',
                    text: '"Isolamento não é se afastar do mundo — é sobre ser mais seletivo."',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_celular',
                    text: '"Intencionalidade é saber exatamente o que você quer alcançar."',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_pc',
                    text: '"Intensidade é a força com que você executa suas ações. É dar o seu máximo em cada tarefa."',
                    next: null
                },
                {
                    character: 'capitao',
                    portrait: 'capitao_legal',
                    text: '"Agora, ele não precisa mais de um caminho. Agora, ele é o próprio caminho."',
                    next: null
                }
            ]
        };
        
        return allDialogues[level] || allDialogues.motivacionais;
    }
    
    // Obter uma frase motivacional aleatória
    getRandomMotivationalQuote() {
        const motivacionais = this.getDialoguesForLevel('motivacionais');
        const randomIndex = Math.floor(Math.random() * motivacionais.length);
        return motivacionais[randomIndex];
    }
}
