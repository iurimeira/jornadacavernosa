// Configuração principal do jogo
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloaderScene,
        TitleScene,
        GameScene,
        UIScene
    ]
};

// Variáveis globais do jogo
const GAME = {
    // Cores do Modo Caverna (baseadas no brandbook)
    colors: {
        black: '#000000',
        darkGray: '#1A1A1A',
        red: '#FF0000',
        white: '#FFFFFF'
    },
    // Estados do jogador
    playerStates: {
        INCONFORMADO: 'inconformado',
        EXPLORADOR: 'explorador',
        PERCEPTIVO: 'perceptivo',
        PERSISTENTE: 'persistente',
        VISIONARIO: 'visionario',
        INCANSAVEL: 'incansavel',
        INABALAVEL: 'inabalavel'
    },
    // Níveis do jogo
    levels: {
        VALE_DESPERTAR: 'vale_despertar',
        RUINAS_RUPTURA: 'ruinas_ruptura',
        FLORESTA_CHAMADO: 'floresta_chamado',
        MONTANHAS_DESCOBERTA: 'montanhas_descoberta',
        LAGO_DISCERNIMENTO: 'lago_discernimento',
        TORRE_ASCENSAO: 'torre_ascensao',
        NUCLEO_CAVERNA: 'nucleo_caverna'
    },
    // Pilares do Modo Caverna
    pilares: {
        ISOLAMENTO: 'isolamento',
        INTENCIONALIDADE: 'intencionalidade',
        INTENSIDADE: 'intensidade'
    },
    // Inimigos
    inimigos: {
        PROCRASTINADOR: 'procrastinador',
        DISTRAIDOR: 'distraidor',
        SABOTADOR: 'sabotador',
        COMPARADOR: 'comparador'
    },
    // Controle de progresso
    currentDay: 1,
    maxDays: 40,
    currentLevel: null,
    currentState: null,
    // Controle dos pilares
    isolamento: 0,
    intencionalidade: 0,
    intensidade: 0,
    // Controle de diálogo
    dialogActive: false
};

// Inicialização do jogo
window.onload = function() {
    // Remover tela de carregamento HTML quando o jogo estiver pronto
    const removeLoading = () => {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    };
    
    // Criar instância do jogo
    const game = new Phaser.Game(config);
    
    // Adicionar evento para remover tela de carregamento quando o jogo estiver pronto
    game.events.once('ready', removeLoading);
    
    // Expor o jogo globalmente para debugging
    window.game = game;
};
