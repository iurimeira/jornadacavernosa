class CapitaoCaverna extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'capitao_welcome');
        
        // Adicionar à cena e habilitar física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propriedades físicas
        this.setScale(0.1);
        this.setSize(20, 20);
        this.setOffset(40, 40);
        
        // Criar zona de interação
        this.interactionZone = scene.add.zone(x, y).setSize(40, 40);
        scene.physics.world.enable(this.interactionZone);
        
        // Diálogos disponíveis
        this.dialogues = this.setupDialogues();
        
        // Estado atual do Capitão Caverna
        this.currentState = 'idle';
    }
    
    setupDialogues() {
        return {
            // Diálogos de introdução
            intro: {
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
            },
            
            // Diálogos sobre os três pilares
            pilares: {
                character: 'capitao',
                portrait: 'capitao_apresentando',
                text: 'O Modo Caverna é baseado em três pilares: ISOLAMENTO, INTENCIONALIDADE e INTENSIDADE.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'O ISOLAMENTO não significa se afastar do mundo, mas sim eliminar distrações e criar um ambiente propício para o foco profundo.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'A INTENCIONALIDADE é sobre ter clareza absoluta do que você quer alcançar. É definir objetivos claros e específicos.',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_apontando',
                            text: 'A INTENSIDADE é a força com que você executa suas ações. É dar o seu máximo em cada tarefa, sem reservas.',
                            next: {
                                character: 'player',
                                text: 'Entendi. Preciso aplicar esses três pilares para evoluir.',
                                next: null
                            }
                        }
                    }
                }
            },
            
            // Diálogos sobre o Vale do Despertar
            vale_despertar: {
                character: 'capitao',
                portrait: 'capitao_apresentando',
                text: 'O Vale do Despertar representa o estado INCONFORMADO. É o momento em que você percebe que precisa de mudança.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'Aqui você aprenderá a usar o poder do ISOLAMENTO para eliminar distrações e criar seu próprio ambiente de foco.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_legal',
                        text: 'Colete os cristais de foco espalhados pelo vale. Eles fortalecerão sua chama interna e ajudarão a derrotar os Procrastinadores.',
                        next: {
                            character: 'player',
                            text: 'Vou encontrar esses cristais e fortalecer meu foco!',
                            next: null
                        }
                    }
                }
            },
            
            // Diálogos sobre o Isolamento
            isolamento: {
                character: 'capitao',
                portrait: 'capitao_celular',
                text: 'O ISOLAMENTO é o primeiro pilar do Modo Caverna. Ele representa a capacidade de criar um ambiente livre de distrações.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'Na prática, significa desligar notificações, afastar-se de interrupções e criar um espaço físico e mental para o foco profundo.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_bracos_cruzados',
                        text: 'Os Procrastinadores e Distraidores são manifestações das forças que tentam quebrar seu isolamento. Você deve derrotá-los!',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_legal',
                            text: 'Quando dominar o ISOLAMENTO, você evoluirá para o estado EXPLORADOR e poderá avançar para as Ruínas da Ruptura.',
                            next: {
                                character: 'player',
                                text: 'Vou praticar o isolamento e derrotar essas distrações!',
                                next: null
                            }
                        }
                    }
                }
            },
            
            // Diálogos sobre a evolução
            evolucao: {
                character: 'capitao',
                portrait: 'capitao_comemorando',
                text: 'Parabéns! Você está evoluindo na jornada do Modo Caverna. Cada nível representa um estado de consciência mais elevado.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apresentando',
                    text: 'Do INCONFORMADO ao INABALÁVEL, são sete estados que representam sua transformação pessoal.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'A cada evolução, sua chama interna fica mais forte, permitindo que você enfrente desafios maiores.',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_legal',
                            text: 'Continue coletando cristais e aplicando os três pilares para evoluir ainda mais!',
                            next: {
                                character: 'player',
                                text: 'Sinto que estou me transformando. Vou continuar nessa jornada!',
                                next: null
                            }
                        }
                    }
                }
            },
            
            // Diálogos sobre os inimigos
            inimigos: {
                character: 'capitao',
                portrait: 'capitao_bracos_cruzados',
                text: 'Os inimigos que você enfrenta são manifestações dos obstáculos internos que impedem sua evolução.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'Os Procrastinadores representam a tendência de adiar tarefas importantes. Eles são lentos, mas persistentes.',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: 'Os Distraidores simbolizam as interrupções constantes que quebram seu foco. Eles são rápidos e barulhentos.',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_apontando',
                            text: 'Os Sabotadores são mais perigosos. Eles representam o autodescarte e tentam destruir seu progresso.',
                            next: {
                                character: 'capitao',
                                portrait: 'capitao_apontando',
                                text: 'E os Comparadores fazem você duvidar de si mesmo, comparando sua jornada com a dos outros.',
                                next: {
                                    character: 'capitao',
                                    portrait: 'capitao_legal',
                                    text: 'Use os três pilares para derrotar esses inimigos. Cada um tem fraquezas específicas!',
                                    next: {
                                        character: 'player',
                                        text: 'Entendi. Esses inimigos são partes de mim que preciso superar.',
                                        next: null
                                    }
                                }
                            }
                        }
                    }
                }
            },
            
            // Diálogos motivacionais
            motivacional: {
                character: 'capitao',
                portrait: 'capitao_comemorando',
                text: '"A Caverna não é um lugar físico, é a representação da sua mente."',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_legal',
                    text: '"Agir com intensidade é um ato de fé. É a prova de que você realmente acredita no seu plano."',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: '"Não basta estar na Caverna. É preciso ATIVAR o MODO CAVERNA!"',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_welcome',
                            text: '"Você não precisa ser melhor que os outros. Precisa ser melhor que você mesmo ontem."',
                            next: {
                                character: 'player',
                                text: 'Essas palavras me motivam a continuar na jornada!',
                                next: null
                            }
                        }
                    }
                }
            },
            
            // Diálogos sobre o dia 40
            dia_40: {
                character: 'capitao',
                portrait: 'capitao_welcome',
                text: 'O Desafio Caverna dura 40 dias porque este é o tempo necessário para criar novos hábitos e transformar sua vida.',
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: 'Cada dia representa um passo na sua jornada de transformação. Não pule etapas!',
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_legal',
                        text: 'Ao final dos 40 dias, você terá se tornado uma pessoa completamente diferente. Mais forte, mais focada, mais determinada.',
                        next: {
                            character: 'capitao',
                            portrait: 'capitao_comemorando',
                            text: 'E o melhor: você terá as ferramentas para continuar evoluindo por conta própria!',
                            next: {
                                character: 'player',
                                text: 'Estou comprometido com essa jornada de 40 dias!',
                                next: null
                            }
                        }
                    }
                }
            }
        };
    }
    
    update() {
        // Atualizar posição da zona de interação
        this.interactionZone.x = this.x;
        this.interactionZone.y = this.y;
        
        // Animações ou comportamentos baseados no estado atual
        switch (this.currentState) {
            case 'idle':
                // Comportamento padrão
                break;
            case 'talking':
                // Comportamento durante diálogo
                break;
        }
    }
    
    // Iniciar diálogo específico
    startDialogue(dialogueKey) {
        if (this.dialogues[dialogueKey]) {
            this.currentState = 'talking';
            this.scene.events.emit('startDialogue', this.dialogues[dialogueKey]);
            return true;
        }
        return false;
    }
    
    // Verificar se o jogador está na zona de interação
    isPlayerInRange(player) {
        return this.scene.physics.overlap(player, this.interactionZone);
    }
}
