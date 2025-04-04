// Sprites para os bosses do Modo Caverna
class BossSpriteGenerator {
    constructor(scene) {
        this.scene = scene;
        this.generatedSprites = {};
    }
    
    // Gerar sprites para todos os bosses
    generateAllBossSprites() {
        this.generateProcrastinadorSprite();
        this.generateDistraidorSprite();
        this.generateSabotadorSprite();
        this.generateComparadorSprite();
        
        return this.generatedSprites;
    }
    
    // Gerar sprite para o Mestre Procrastinador
    generateProcrastinadorSprite() {
        // Criar canvas para desenhar o sprite
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Cores
        const colors = {
            body: '#555555',
            details: '#333333',
            accent: '#8a8a8a',
            eyes: '#ffffff',
            pupils: '#000000',
            highlight: '#ff0000'
        };
        
        // Desenhar corpo (forma de lesma/caracol para representar lentidão)
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.ellipse(32, 40, 24, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar carapaça/casca (representando proteção/conforto)
        ctx.fillStyle = colors.details;
        ctx.beginPath();
        ctx.ellipse(32, 32, 20, 20, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // Padrão espiral na carapaça (simbolizando ciclos de procrastinação)
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const radius = 16 - (i * 4);
            ctx.arc(32, 32, radius, 0, Math.PI * 1.5);
        }
        ctx.stroke();
        
        // Desenhar olhos (parecem cansados/sonolentos)
        // Olho esquerdo
        ctx.fillStyle = colors.eyes;
        ctx.beginPath();
        ctx.ellipse(24, 30, 4, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Olho direito
        ctx.beginPath();
        ctx.ellipse(40, 30, 4, 6, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas (olhando para baixo/para longe - evitando responsabilidade)
        ctx.fillStyle = colors.pupils;
        ctx.beginPath();
        ctx.arc(25, 32, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(39, 32, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar boca (sorriso relaxado)
        ctx.strokeStyle = colors.details;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, 40, 8, 0.1, Math.PI - 0.1);
        ctx.stroke();
        
        // Desenhar relógio quebrado (simbolizando tempo desperdiçado)
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(48, 20, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = colors.details;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(48, 20, 6, 0, Math.PI * 2);
        ctx.moveTo(48, 20);
        ctx.lineTo(48, 16);
        ctx.moveTo(48, 20);
        ctx.lineTo(51, 22);
        ctx.stroke();
        
        // Adicionar rachadura no relógio
        ctx.strokeStyle = colors.highlight;
        ctx.beginPath();
        ctx.moveTo(45, 17);
        ctx.lineTo(51, 23);
        ctx.stroke();
        
        // Adicionar travesseiro pequeno (símbolo de conforto/preguiça)
        ctx.fillStyle = colors.accent;
        ctx.fillRect(16, 48, 10, 6);
        
        ctx.fillStyle = colors.details;
        ctx.fillRect(14, 48, 2, 6);
        ctx.fillRect(26, 48, 2, 6);
        
        // Converter para textura e adicionar ao jogo
        const texture = this.createTextureFromCanvas('boss_procrastinador', canvas);
        this.generatedSprites.procrastinador = texture;
        
        return texture;
    }
    
    // Gerar sprite para o Grande Distraidor
    generateDistraidorSprite() {
        // Criar canvas para desenhar o sprite
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Cores
        const colors = {
            body: '#4a90e2',
            details: '#2c3e50',
            accent: '#f39c12',
            eyes: '#ffffff',
            pupils: '#000000',
            highlight: '#ff0000'
        };
        
        // Desenhar corpo (forma de nuvem/fumaça para representar dispersão)
        ctx.fillStyle = colors.body;
        // Círculo principal
        ctx.beginPath();
        ctx.arc(32, 32, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Bolhas adicionais para forma de nuvem
        ctx.beginPath();
        ctx.arc(20, 28, 12, 0, Math.PI * 2);
        ctx.arc(44, 28, 12, 0, Math.PI * 2);
        ctx.arc(26, 20, 10, 0, Math.PI * 2);
        ctx.arc(38, 20, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Desenhar olhos (grandes e arregalados, olhando em direções diferentes)
        // Olho esquerdo
        ctx.fillStyle = colors.eyes;
        ctx.beginPath();
        ctx.arc(24, 30, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Olho direito
        ctx.beginPath();
        ctx.arc(40, 30, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas (olhando em direções diferentes)
        ctx.fillStyle = colors.pupils;
        ctx.beginPath();
        ctx.arc(22, 28, 3, 0, Math.PI * 2); // Olhando para cima/esquerda
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(43, 32, 3, 0, Math.PI * 2); // Olhando para baixo/direita
        ctx.fill();
        
        // Desenhar boca (falando/tagarelando)
        ctx.fillStyle = colors.details;
        ctx.beginPath();
        ctx.ellipse(32, 42, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.ellipse(32, 41, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Adicionar símbolos de notificação/informação ao redor
        // Símbolo de notificação 1 (sino)
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = colors.details;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(16, 12);
        ctx.lineTo(16, 10);
        ctx.stroke();
        
        // Símbolo de notificação 2 (envelope)
        ctx.fillStyle = colors.accent;
        ctx.fillRect(44, 12, 8, 6);
        
        ctx.strokeStyle = colors.details;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(44, 12);
        ctx.lineTo(48, 15);
        ctx.lineTo(52, 12);
        ctx.stroke();
        
        // Símbolos de mídia social/informação flutuando
        // Símbolo 1
        ctx.fillStyle = colors.highlight;
        ctx.beginPath();
        ctx.arc(54, 32, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Símbolo 2
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(10, 36, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Símbolo 3
        ctx.fillStyle = colors.details;
        ctx.beginPath();
        ctx.arc(32, 10, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Converter para textura e adicionar ao jogo
        const texture = this.createTextureFromCanvas('boss_distraidor', canvas);
        this.generatedSprites.distraidor = texture;
        
        return texture;
    }
    
    // Gerar sprite para o Sabotador Interno
    generateSabotadorSprite() {
        // Criar canvas para desenhar o sprite
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Cores
        const colors = {
            body: '#2c3e50',
            details: '#1a1a1a',
            accent: '#7f8c8d',
            eyes: '#e74c3c',
            highlight: '#ff0000',
            shadow: 'rgba(0,0,0,0.5)'
        };
        
        // Desenhar corpo (forma sombria/encapuzada)
        ctx.fillStyle = colors.body;
        // Forma principal (como um manto/capa)
        ctx.beginPath();
        ctx.moveTo(20, 16);
        ctx.lineTo(44, 16);
        ctx.lineTo(50, 50);
        ctx.lineTo(14, 50);
        ctx.closePath();
        ctx.fill();
        
        // Capuz
        ctx.fillStyle = colors.details;
        ctx.beginPath();
        ctx.arc(32, 20, 16, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // Sombra sob o capuz (escondendo o rosto)
        ctx.fillStyle = colors.shadow;
        ctx.beginPath();
        ctx.arc(32, 24, 12, 0, Math.PI);
        ctx.fill();
        
        // Olhos brilhantes vermelhos na sombra
        ctx.fillStyle = colors.eyes;
        ctx.beginPath();
        ctx.arc(26, 24, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(38, 24, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Brilho nos olhos
        ctx.fillStyle = colors.highlight;
        ctx.beginPath();
        ctx.arc(26, 23, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(38, 23, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Mãos com garras saindo do manto
        ctx.fillStyle = colors.details;
        // Mão esquerda
        ctx.beginPath();
        ctx.moveTo(18, 36);
        ctx.lineTo(14, 42);
        ctx.lineTo(12, 40);
        ctx.lineTo(10, 44);
        ctx.lineTo(14, 46);
        ctx.lineTo(18, 40);
        ctx.closePath();
        ctx.fill();
        
        // Mão direita
        ctx.beginPath();
        ctx.moveTo(46, 36);
        ctx.lineTo(50, 42);
        ctx.lineTo(52, 40);
        ctx.lineTo(54, 44);
        ctx.lineTo(50, 46);
        ctx.lineTo(46, 40);
        ctx.closePath();
        ctx.fill();
        
        // Adicionar símbolos negativos/dúvida ao redor
        // Símbolo de dúvida 1 (ponto de interrogação)
        ctx.fillStyle = colors.accent;
        ctx.font = '12px Arial';
        ctx.fillText('?', 20, 14);
        
        // Símbolo de dúvida 2
        ctx.fillText('?', 40, 14);
        
        // Símbolo de negação (X)
        ctx.strokeStyle = colors.highlight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(28, 54);
        ctx.lineTo(36, 58);
        ctx.moveTo(36, 54);
        ctx.lineTo(28, 58);
        ctx.stroke();
        
        // Converter para textura e adicionar ao jogo
        const texture = this.createTextureFromCanvas('boss_sabotador', canvas);
        this.generatedSprites.sabotador = texture;
        
        return texture;
    }
    
    // Gerar sprite para o Comparador Supremo
    generateComparadorSprite() {
        // Criar canvas para desenhar o sprite
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Cores
        const colors = {
            body: '#8e44ad',
            details: '#6c3483',
            accent: '#9b59b6',
            eyes: '#ecf0f1',
            highlight: '#f1c40f',
            shadow: 'rgba(0,0,0,0.5)'
        };
        
        // Desenhar corpo (forma de espelho/prisma)
        ctx.fillStyle = colors.body;
        // Forma de diamante/prisma
        ctx.beginPath();
        ctx.moveTo(32, 10);
        ctx.lineTo(50, 32);
        ctx.lineTo(32, 54);
        ctx.lineTo(14, 32);
        ctx.closePath();
        ctx.fill();
        
        // Reflexo no espelho/prisma
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.moveTo(32, 16);
        ctx.lineTo(44, 32);
        ctx.lineTo(32, 48);
        ctx.lineTo(20, 32);
        ctx.closePath();
        ctx.fill();
        
        // Brilho no espelho
        ctx.fillStyle = colors.highlight;
        ctx.beginPath();
        ctx.moveTo(28, 20);
        ctx.lineTo(32, 24);
        ctx.lineTo(28, 28);
        ctx.lineTo(24, 24);
        ctx.closePath();
        ctx.fill();
        
        // Olhos (múltiplos, representando diferentes perspectivas/comparações)
        // Olhos principais
        ctx.fillStyle = colors.eyes;
        ctx.beginPath();
        ctx.arc(26, 30, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(38, 30, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas
        ctx.fillStyle = colors.details;
        ctx.beginPath();
        ctx.arc(26, 30, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(38, 30, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Olhos secundários (menores, representando outras perspectivas)
        ctx.fillStyle = colors.eyes;
        ctx.beginPath();
        ctx.arc(22, 36, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(42, 36, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupilas secundárias
        ctx.fillStyle = colors.details;
        ctx.beginPath();
        ctx.arc(22, 36, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(42, 36, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Boca (expressão de julgamento)
        ctx.strokeStyle = colors.details;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, 40, 6, 0.2, Math.PI - 0.2, true);
        ctx.stroke();
        
        // Adicionar símbolos de comparação
        // Símbolo maior que
        ctx.strokeStyle = colors.highlight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(54, 26);
        ctx.lineTo(58, 32);
        ctx.lineTo(54, 38);
        ctx.stroke();
        
        // Símbolo menor que
        ctx.beginPath();
        ctx.moveTo(10, 26);
        ctx.lineTo(6, 32);
        ctx.lineTo(10, 38);
        ctx.stroke();
        
        // Converter para textura e adicionar ao jogo
        const texture = this.createTextureFromCanvas('boss_comparador', canvas);
        this.generatedSprites.comparador = texture;
        
        return texture;
    }
    
    // Criar textura a partir de um canvas
    createTextureFromCanvas(key, canvas) {
        // Converter canvas para base64
        const base64 = canvas.toDataURL();
        
        // Carregar imagem no Phaser
        if (!this.scene.textures.exists(key)) {
            this.scene.textures.addBase64(key, base64);
        }
        
        return key;
    }
}
