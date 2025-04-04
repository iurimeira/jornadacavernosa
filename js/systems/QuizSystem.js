class QuizSystem {
    constructor(scene) {
        this.scene = scene;
        this.quizActive = false;
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.maxScore = 0;
        this.bossEncounter = null;
        
        // Referência ao sistema de diálogo
        this.dialogueSystem = null;
        
        // Banco de perguntas organizadas por nível e tipo
        this.quizDatabase = this.setupQuizDatabase();
    }
    
    // Inicializar com referência ao sistema de diálogo
    init(dialogueSystem) {
        this.dialogueSystem = dialogueSystem;
    }
    
    // Configurar banco de perguntas
    setupQuizDatabase() {
        return {
            // Vale do Despertar - Foco no Isolamento
            vale_despertar: {
                conceitual: [
                    {
                        pergunta: "O que significa realmente o Isolamento no contexto do Modo Caverna?",
                        opcoes: [
                            "Afastar-se completamente das pessoas",
                            "Eliminar distrações e criar um ambiente propício para o foco",
                            "Trabalhar apenas durante a noite",
                            "Desligar-se de toda tecnologia"
                        ],
                        resposta: 1,
                        explicacao: "O Isolamento no Modo Caverna não significa se afastar das pessoas, mas sim eliminar distrações e criar um ambiente que favoreça o foco profundo."
                    },
                    {
                        pergunta: "Qual é o principal benefício do Isolamento?",
                        opcoes: [
                            "Evitar responsabilidades sociais",
                            "Economizar energia elétrica",
                            "Aumentar a capacidade de foco e concentração",
                            "Reduzir o estresse causado por outras pessoas"
                        ],
                        resposta: 2,
                        explicacao: "O principal benefício do Isolamento é aumentar sua capacidade de foco e concentração, permitindo que você realize tarefas com maior eficiência e qualidade."
                    },
                    {
                        pergunta: "Qual destas NÃO é uma prática recomendada para o Isolamento?",
                        opcoes: [
                            "Desativar notificações do celular",
                            "Criar um espaço físico dedicado ao trabalho",
                            "Ignorar completamente amigos e família por 40 dias",
                            "Estabelecer horários específicos para verificar e-mails"
                        ],
                        resposta: 2,
                        explicacao: "Ignorar completamente amigos e família não é o objetivo do Isolamento. O Modo Caverna busca equilíbrio, não isolamento social extremo."
                    }
                ],
                pratico: [
                    {
                        pergunta: "Você está trabalhando em uma tarefa importante e recebe uma notificação de rede social. O que você faz?",
                        opcoes: [
                            "Verifica imediatamente, pode ser importante",
                            "Ignora e continua trabalhando, verificando apenas no intervalo programado",
                            "Para o que está fazendo e verifica todas as redes sociais",
                            "Desiste da tarefa pois já perdeu o foco"
                        ],
                        resposta: 1,
                        explicacao: "No Isolamento, você deve ignorar distrações momentâneas e estabelecer momentos específicos para verificar notificações."
                    },
                    {
                        pergunta: "Como você organizaria seu ambiente para maximizar o Isolamento?",
                        opcoes: [
                            "Trabalhar na sala com a TV ligada para ter barulho de fundo",
                            "Trabalhar em um café movimentado para se sentir produtivo",
                            "Criar um espaço dedicado, livre de distrações, com o necessário para suas tarefas",
                            "Trabalhar na cama para ficar confortável"
                        ],
                        resposta: 2,
                        explicacao: "Um ambiente dedicado e livre de distrações é fundamental para o Isolamento efetivo."
                    },
                    {
                        pergunta: "Seu amigo insiste em conversar durante seu horário de foco. Qual a melhor abordagem?",
                        opcoes: [
                            "Conversar mesmo assim, para não ser rude",
                            "Explicar que está em período de foco e sugerir conversar em outro momento",
                            "Ignorar completamente sem dar explicações",
                            "Desistir do período de foco por hoje"
                        ],
                        resposta: 1,
                        explicacao: "Comunicar claramente seus limites e sugerir alternativas é a melhor forma de manter o Isolamento sem prejudicar relacionamentos."
                    }
                ]
            },
            
            // Ruínas da Ruptura - Foco na Intencionalidade
            ruinas_ruptura: {
                conceitual: [
                    {
                        pergunta: "O que é Intencionalidade no contexto do Modo Caverna?",
                        opcoes: [
                            "Fazer muitas coisas ao mesmo tempo",
                            "Ter clareza absoluta do que se quer alcançar",
                            "Seguir a intuição sem planejar",
                            "Copiar os objetivos de pessoas bem-sucedidas"
                        ],
                        resposta: 1,
                        explicacao: "Intencionalidade é ter clareza absoluta do que você quer alcançar, definindo objetivos claros e específicos."
                    },
                    {
                        pergunta: "Por que a Intencionalidade é importante?",
                        opcoes: [
                            "Porque impressiona outras pessoas",
                            "Porque permite economizar recursos",
                            "Porque direciona seu foco e energia para o que realmente importa",
                            "Porque é mais fácil que ser espontâneo"
                        ],
                        resposta: 2,
                        explicacao: "A Intencionalidade direciona seu foco e energia para o que realmente importa, evitando desperdício de tempo e esforço."
                    },
                    {
                        pergunta: "Qual é a relação entre Intencionalidade e planejamento?",
                        opcoes: [
                            "São conceitos opostos",
                            "A Intencionalidade substitui a necessidade de planejamento",
                            "O planejamento é uma ferramenta para materializar a Intencionalidade",
                            "Não há relação entre eles"
                        ],
                        resposta: 2,
                        explicacao: "O planejamento é uma ferramenta que ajuda a materializar sua Intencionalidade, transformando objetivos claros em ações concretas."
                    }
                ],
                pratico: [
                    {
                        pergunta: "Você tem várias tarefas para fazer hoje. Como aplicaria a Intencionalidade?",
                        opcoes: [
                            "Faria todas simultaneamente para economizar tempo",
                            "Identificaria a mais importante baseada em seus objetivos e a priorizaria",
                            "Começaria pela mais fácil para ganhar motivação",
                            "Delegaria todas para ter tempo livre"
                        ],
                        resposta: 1,
                        explicacao: "A Intencionalidade nos leva a priorizar tarefas baseadas em sua importância para nossos objetivos maiores."
                    },
                    {
                        pergunta: "Como você definiria um objetivo com Intencionalidade?",
                        opcoes: [
                            "'Quero ser mais saudável'",
                            "'Vou tentar melhorar minha carreira'",
                            "'Vou perder 5kg em 2 meses seguindo um plano alimentar e exercícios 3x por semana'",
                            "'Seria bom ganhar mais dinheiro'"
                        ],
                        resposta: 2,
                        explicacao: "Objetivos com Intencionalidade são específicos, mensuráveis, alcançáveis, relevantes e temporais (SMART)."
                    },
                    {
                        pergunta: "Você recebe um convite para um evento. Como decide com Intencionalidade se deve ir?",
                        opcoes: [
                            "Aceita automaticamente para não perder oportunidades",
                            "Recusa para economizar tempo",
                            "Avalia se o evento está alinhado com seus objetivos atuais e prioridades",
                            "Pergunta se outras pessoas vão antes de decidir"
                        ],
                        resposta: 2,
                        explicacao: "Decisões com Intencionalidade são baseadas no alinhamento com seus objetivos e prioridades, não em pressão social ou FOMO."
                    }
                ]
            },
            
            // Floresta do Chamado - Foco na Intensidade
            floresta_chamado: {
                conceitual: [
                    {
                        pergunta: "O que significa Intensidade no Modo Caverna?",
                        opcoes: [
                            "Trabalhar muitas horas sem parar",
                            "Gritar e se emocionar enquanto trabalha",
                            "A força com que você executa suas ações, dando o máximo em cada tarefa",
                            "Fazer tudo com pressa e agitação"
                        ],
                        resposta: 2,
                        explicacao: "Intensidade é a força com que você executa suas ações, dando o máximo de si em cada tarefa, sem reservas."
                    },
                    {
                        pergunta: "Por que a Intensidade é considerada um pilar do Modo Caverna?",
                        opcoes: [
                            "Porque causa adrenalina que vicia",
                            "Porque impressiona os outros",
                            "Porque transforma esforço comum em resultados extraordinários",
                            "Porque é mais divertido que trabalhar devagar"
                        ],
                        resposta: 2,
                        explicacao: "A Intensidade é um pilar porque transforma esforço comum em resultados extraordinários, acelerando seu progresso."
                    },
                    {
                        pergunta: "Como a Intensidade se relaciona com os outros pilares?",
                        opcoes: [
                            "Ela substitui os outros quando você está cansado",
                            "Ela funciona independentemente dos outros pilares",
                            "Ela potencializa o Isolamento e a Intencionalidade, criando um efeito multiplicador",
                            "Ela é menos importante que os outros pilares"
                        ],
                        resposta: 2,
                        explicacao: "A Intensidade potencializa os outros pilares: com Isolamento você elimina distrações, com Intencionalidade você define o alvo, e com Intensidade você atinge esse alvo com força máxima."
                    }
                ],
                pratico: [
                    {
                        pergunta: "Como você aplicaria Intensidade ao estudar para uma prova importante?",
                        opcoes: [
                            "Estudaria 24 horas seguidas na véspera",
                            "Estudaria com foco total em sessões planejadas, eliminando distrações e dando o máximo em cada sessão",
                            "Leria o material enquanto assiste TV para otimizar tempo",
                            "Estudaria apenas o que acha que vai cair na prova"
                        ],
                        resposta: 1,
                        explicacao: "A Intensidade não é sobre quantidade de horas, mas sobre qualidade de foco e esforço durante o tempo dedicado."
                    },
                    {
                        pergunta: "Você está com pouca energia hoje. Como aplicar Intensidade mesmo assim?",
                        opcoes: [
                            "Desistir e tentar novamente amanhã",
                            "Tomar vários energéticos para ficar agitado",
                            "Reduzir o escopo do trabalho, mas manter o foco total no que for fazer",
                            "Fingir que está trabalhando com intensidade"
                        ],
                        resposta: 2,
                        explicacao: "Intensidade é adaptável: em dias de baixa energia, você pode reduzir o escopo, mas manter a qualidade do foco no que decidir fazer."
                    },
                    {
                        pergunta: "Como você saberia que está aplicando Intensidade corretamente?",
                        opcoes: [
                            "Você se sente exausto e estressado o tempo todo",
                            "Você termina tarefas mais rápido e com maior qualidade que o normal",
                            "Outras pessoas comentam que você parece ocupado",
                            "Você não consegue dormir à noite de tanta adrenalina"
                        ],
                        resposta: 1,
                        explicacao: "A verdadeira Intensidade se manifesta em resultados: maior velocidade e qualidade nas entregas, não em aparência de ocupação ou esgotamento."
                    }
                ]
            }
        };
    }
    
    // Iniciar quiz para um determinado nível
    startQuiz(level, bossEncounter = null) {
        if (!this.quizDatabase[level]) {
            console.error(`Quiz não encontrado para o nível: ${level}`);
            return false;
        }
        
        this.quizActive = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.bossEncounter = bossEncounter;
        
        // Criar quiz com perguntas conceituais e práticas
        this.currentQuiz = {
            level: level,
            questions: [
                ...this.getRandomQuestions(this.quizDatabase[level].conceitual, 2),
                ...this.getRandomQuestions(this.quizDatabase[level].pratico, 2)
            ]
        };
        
        this.maxScore = this.currentQuiz.questions.length;
        
        // Iniciar o quiz com diálogo introdutório
        this.startQuizIntroduction(level);
        
        return true;
    }
    
    // Obter perguntas aleatórias de uma categoria
    getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    // Iniciar introdução do quiz baseada no nível
    startQuizIntroduction(level) {
        let introDialogue;
        
        switch (level) {
            case 'vale_despertar':
                introDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_bracos_cruzados',
                    text: "Você chegou ao final do Vale do Despertar! Antes de prosseguir, preciso testar seu conhecimento sobre o ISOLAMENTO.",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "O Mestre Procrastinador aguarda você, mas primeiro responda a algumas perguntas para provar que está pronto para enfrentá-lo!",
                        next: {
                            character: 'player',
                            text: "Estou pronto para o desafio!",
                            next: null
                        }
                    }
                };
                break;
                
            case 'ruinas_ruptura':
                introDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_bracos_cruzados',
                    text: "Você chegou ao final das Ruínas da Ruptura! Agora preciso testar seu conhecimento sobre INTENCIONALIDADE.",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "O Grande Distraidor está à sua espera, mas primeiro responda a estas perguntas para provar que está pronto!",
                        next: {
                            character: 'player',
                            text: "Vamos lá, estou preparado!",
                            next: null
                        }
                    }
                };
                break;
                
            case 'floresta_chamado':
                introDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_bracos_cruzados',
                    text: "Você chegou ao final da Floresta do Chamado! Agora vou testar seu conhecimento sobre INTENSIDADE.",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "O Sabotador Interno está à sua espera, mas primeiro responda a estas perguntas para provar seu valor!",
                        next: {
                            character: 'player',
                            text: "Vou dar o meu máximo!",
                            next: null
                        }
                    }
                };
                break;
                
            default:
                introDialogue = {
                    character: 'capitao',
                    portrait: 'capitao_welcome',
                    text: "Vamos testar seu conhecimento sobre o Modo Caverna!",
                    next: {
                        character: 'player',
                        text: "Estou pronto!",
                        next: null
                    }
                };
        }
        
        // Iniciar diálogo de introdução
        this.dialogueSystem.queueDialogue(introDialogue);
        
        // Configurar callback para quando o diálogo terminar
        this.scene.events.once('endDialogue', () => {
            this.presentNextQuestion();
        });
    }
    
    // Apresentar próxima pergunta
    presentNextQuestion() {
        if (!this.quizActive || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.finishQuiz();
            return;
        }
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        // Criar diálogo para a pergunta
        const questionDialogue = {
            character: 'capitao',
            portrait: 'capitao_apresentando',
            text: question.pergunta,
            options: question.opcoes,
            callback: (optionIndex) => {
                this.processAnswer(optionIndex);
            }
        };
        
        // Apresentar pergunta como diálogo com opções
        this.scene.events.emit('startQuizQuestion', questionDialogue);
    }
    
    // Processar resposta do jogador
    processAnswer(optionIndex) {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const isCorrect = optionIndex === question.resposta;
        
        if (isCorrect) {
            this.score++;
        }
        
        // Criar diálogo de feedback
        const feedbackDialogue = {
            character: 'capitao',
            portrait: isCorrect ? 'capitao_comemorando' : 'capitao_bracos_cruzados',
            text: isCorrect ? 
                "Correto! " + question.explicacao : 
                "Não é bem isso... " + question.explicacao,
            next: {
                character: 'player',
                text: isCorrect ? "Ótimo! Vamos para a próxima." : "Entendi. Vamos continuar.",
                next: null
            }
        };
        
        // Apresentar feedback
        this.dialogueSystem.queueDialogue(feedbackDialogue);
        
        // Avançar para próxima pergunta quando o diálogo terminar
        this.scene.events.once('endDialogue', () => {
            this.currentQuestionIndex++;
            this.presentNextQuestion();
        });
    }
    
    // Finalizar quiz e apresentar resultados
    finishQuiz() {
        const passThreshold = this.maxScore * 0.75; // 75% para passar
        const passed = this.score >= passThreshold;
        
        let resultDialogue;
        
        if (passed) {
            resultDialogue = {
                character: 'capitao',
                portrait: 'capitao_comemorando',
                text: `Excelente! Você acertou ${this.score} de ${this.maxScore} perguntas. Está pronto para enfrentar o desafio final deste nível!`,
                next: {
                    character: 'capitao',
                    portrait: 'capitao_legal',
                    text: "Seu conhecimento fortaleceu sua determinação. Agora você está preparado para enfrentar o boss!",
                    next: {
                        character: 'player',
                        text: "Estou pronto para o desafio final!",
                        next: null
                    }
                }
            };
        } else {
            resultDialogue = {
                character: 'capitao',
                portrait: 'capitao_bracos_cruzados',
                text: `Você acertou ${this.score} de ${this.maxScore} perguntas. Ainda precisa compreender melhor os conceitos antes de enfrentar o desafio final.`,
                next: {
                    character: 'capitao',
                    portrait: 'capitao_apontando',
                    text: "Não desanime! Revise os conceitos e tente novamente quando estiver preparado.",
                    next: {
                        character: 'player',
                        text: "Vou me preparar melhor e tentar novamente!",
                        next: null
                    }
                }
            };
        }
        
        // Apresentar resultados
        this.dialogueSystem.queueDialogue(resultDialogue);
        
        // Finalizar quiz quando o diálogo terminar
        this.scene.events.once('endDialogue', () => {
            this.quizActive = false;
            
            // Se passou no quiz e há um encontro com boss configurado, iniciá-lo
            if (passed && this.bossEncounter) {
                this.startBossEncounter();
            }
            
            // Emitir evento de quiz finalizado
            this.scene.events.emit('quizCompleted', {
                level: this.currentQuiz.level,
                score: this.score,
                maxScore: this.maxScore,
                passed: passed
            });
        });
    }
    
    // Iniciar encontro com boss
    startBossEncounter() {
        if (!this.bossEncounter) return;
        
        // Iniciar encontro com boss baseado no nível atual
        switch (this.currentQuiz.level) {
            case 'vale_despertar':
                this.startProcrastinadorBoss();
                break;
                
            case 'ruinas_ruptura':
                this.startDistraidorBoss();
                break;
                
            case 'floresta_chamado':
                this.startSabotadorBoss();
                break;
                
            default:
                console.error(`Boss não definido para o nível: ${this.currentQuiz.level}`);
        }
    }
    
    // Boss do Vale do Despertar: Mestre Procrastinador
    startProcrastinadorBoss() {
        const bossDialogue = {
            character: 'procrastinador',
            portrait: 'boss_procrastinador',
            text: "Ah, então você acha que está pronto para me enfrentar? Por que não deixamos isso para amanhã? Ou melhor, para a próxima semana?",
            next: {
                character: 'procrastinador',
                portrait: 'boss_procrastinador',
                text: "Não há pressa, não é mesmo? Você pode sempre começar sua jornada depois... Talvez quando estiver mais preparado...",
                next: {
                    character: 'player',
                    text: "Não! O momento de agir é agora. Não vou adiar mais minha evolução!",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_comemorando',
                        text: "Isso! Use o poder do ISOLAMENTO para focar no presente e derrotar o Mestre Procrastinador!",
                        next: null
                    }
                }
            }
        };
        
        // Iniciar diálogo com o boss
        this.dialogueSystem.queueDialogue(bossDialogue);
        
        // Iniciar batalha quando o diálogo terminar
        this.scene.events.once('endDialogue', () => {
            this.scene.events.emit('startBossBattle', 'procrastinador');
        });
    }
    
    // Boss das Ruínas da Ruptura: Grande Distraidor
    startDistraidorBoss() {
        const bossDialogue = {
            character: 'distraidor',
            portrait: 'boss_distraidor',
            text: "Olá! Você sabia que existem mais de 8 milhões de cores que o olho humano pode distinguir? Fascinante, não é?",
            next: {
                character: 'distraidor',
                portrait: 'boss_distraidor',
                text: "Ah, e você viu aquele novo vídeo viral? E aquela série que todo mundo está assistindo? E aquela notícia sobre aquela celebridade?",
                next: {
                    character: 'player',
                    text: "Não vou me distrair! Estou focado no meu objetivo e nada vai me desviar dele!",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_apontando',
                        text: "Exatamente! Use o poder da INTENCIONALIDADE para manter o foco no que realmente importa!",
                        next: null
                    }
                }
            }
        };
        
        // Iniciar diálogo com o boss
        this.dialogueSystem.queueDialogue(bossDialogue);
        
        // Iniciar batalha quando o diálogo terminar
        this.scene.events.once('endDialogue', () => {
            this.scene.events.emit('startBossBattle', 'distraidor');
        });
    }
    
    // Boss da Floresta do Chamado: Sabotador Interno
    startSabotadorBoss() {
        const bossDialogue = {
            character: 'sabotador',
            portrait: 'boss_sabotador',
            text: "Você realmente acha que é capaz de me derrotar? Olhe para você... Não tem o que é preciso.",
            next: {
                character: 'sabotador',
                portrait: 'boss_sabotador',
                text: "Por que se esforçar tanto? Você provavelmente vai falhar como das outras vezes. Melhor desistir agora e evitar a decepção...",
                next: {
                    character: 'player',
                    text: "Essas dúvidas não são reais! Eu sei do que sou capaz e vou dar o meu máximo!",
                    next: {
                        character: 'capitao',
                        portrait: 'capitao_comemorando',
                        text: "Isso! Use o poder da INTENSIDADE para superar suas limitações e dar o seu melhor!",
                        next: null
                    }
                }
            }
        };
        
        // Iniciar diálogo com o boss
        this.dialogueSystem.queueDialogue(bossDialogue);
        
        // Iniciar batalha quando o diálogo terminar
        this.scene.events.once('endDialogue', () => {
            this.scene.events.emit('startBossBattle', 'sabotador');
        });
    }
}
