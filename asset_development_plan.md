# Estrutura de Diretórios do Jogo Modo Caverna

```
modo_caverna_game/
├── assets/
│   ├── sprites/
│   │   ├── player/
│   │   ├── capitao_caverna/
│   │   ├── enemies/
│   │   ├── npcs/
│   │   └── items/
│   ├── tiles/
│   │   ├── vale_despertar/
│   │   ├── ruinas_ruptura/
│   │   ├── floresta_chamado/
│   │   ├── montanhas_descoberta/
│   │   ├── lago_discernimento/
│   │   ├── torre_ascensao/
│   │   └── nucleo_caverna/
│   ├── ui/
│   ├── fonts/
│   └── audio/
│       ├── music/
│       └── sfx/
├── js/
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── PreloaderScene.js
│   │   ├── TitleScene.js
│   │   ├── GameScene.js
│   │   └── UIScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── CapitaoCaverna.js
│   │   └── Enemy.js
│   ├── systems/
│   │   ├── DialogueSystem.js
│   │   ├── QuestSystem.js
│   │   └── ProgressionSystem.js
│   └── utils/
├── index.html
├── style.css
└── game.js
```

# Plano de Desenvolvimento de Assets

## Sprites do Jogador
- Personagem principal com animações para:
  - Movimento (4 direções)
  - Ataque
  - Interação
  - Estados especiais (Isolamento, Intencionalidade, Intensidade)
- Evolução visual do personagem conforme progresso

## Sprites do Capitão Caverna
- Já temos sprites base do Capitão Caverna:
  - Apontando
  - Apresentando
  - Comemorando
  - Com celular
  - Com PC
  - Legal (polegar para cima)
  - Welcome (braços abertos)
- Precisamos adicionar:
  - Animações de fala
  - Transições entre poses
  - Efeitos especiais para momentos importantes

## Inimigos
- Procrastinadores: Criaturas lentas, aspecto preguiçoso
- Distraidores: Coloridos, barulhentos, movimento errático
- Sabotadores: Aparência sombria, movimentos furtivos
- Comparadores: Criaturas que mudam de forma
- Chefes: Versões maiores e mais detalhadas dos inimigos básicos

## Tiles e Ambientes
- Vale do Despertar: Ambiente inicial, cores neutras
- Ruínas da Ruptura: Estruturas quebradas, transição
- Floresta do Chamado: Densa, misteriosa, com caminhos ocultos
- Montanhas da Descoberta: Terreno elevado, desafiador
- Lago do Discernimento: Água reflexiva, ambiente calmo
- Torre da Ascensão: Vertical, imponente
- Núcleo da Caverna: Ambiente final, místico e transformador

## Interface do Usuário
- Medidor de Fogo: Mostra o nível de progresso
- Indicadores dos Três Pilares:
  - Isolamento: Medidor de silêncio
  - Intencionalidade: Lista de objetivos
  - Intensidade: Medidor de energia
- Contador de Dias: Mostra o progresso na jornada de 40 dias
- Sistema de Diálogo: Caixas de texto estilo RPG com retratos

## Fontes
- Fonte principal: Estilo pixel art, clara e legível
- Fonte para títulos: Mais estilizada, temática de caverna

## Áudio
- Música:
  - Tema principal
  - Temas para cada região
  - Música de batalha
  - Música para diálogos importantes
- Efeitos Sonoros:
  - Ações do jogador
  - Inimigos
  - Ambiente
  - Interface
  - Eventos especiais

# Recursos a Buscar no OpenGameArt.org
- Tiles base para ambientes de caverna
- Sprites de inimigos que possam ser adaptados
- Elementos de interface 8-bit
- Efeitos de fogo e luz
- Música ambiente estilo 8-bit

# Adaptação dos Sprites Existentes
- Os sprites do Capitão Caverna precisarão ser adaptados para o estilo 8-bit
- Manter a essência do personagem, mas com estética pixel art
- Criar versões menores para uso em caixas de diálogo
- Adicionar frames de animação para transições suaves
