// Utilitários para o jogo Modo Caverna
class GameUtils {
    // Converter segundos em formato de tempo (dias:horas:minutos)
    static formatGameTime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        return `Dia ${days + 1} - ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Gerar um ID único
    static generateID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Verificar colisão entre dois objetos
    static checkCollision(obj1, obj2, tolerance = 0) {
        return Phaser.Geom.Rectangle.Overlaps(
            new Phaser.Geom.Rectangle(
                obj1.x - obj1.width/2 - tolerance,
                obj1.y - obj1.height/2 - tolerance,
                obj1.width + tolerance * 2,
                obj1.height + tolerance * 2
            ),
            new Phaser.Geom.Rectangle(
                obj2.x - obj2.width/2,
                obj2.y - obj2.height/2,
                obj2.width,
                obj2.height
            )
        );
    }
    
    // Obter texto baseado no idioma (para futuro suporte multi-idioma)
    static getText(key, language = 'pt') {
        const texts = {
            pt: {
                // Textos gerais
                game_title: 'Modo Caverna - A Jornada',
                loading: 'CARREGANDO...',
                start_game: 'CLIQUE PARA INICIAR',
                continue: 'CONTINUAR',
                day: 'DIA',
                
                // Estados do jogador
                state_inconformado: 'INCONFORMADO',
                state_explorador: 'EXPLORADOR',
                state_perceptivo: 'PERCEPTIVO',
                state_persistente: 'PERSISTENTE',
                state_visionario: 'VISIONÁRIO',
                state_incansavel: 'INCANSÁVEL',
                state_inabalavel: 'INABALÁVEL',
                
                // Pilares
                pilar_isolamento: 'ISOLAMENTO',
                pilar_intencionalidade: 'INTENCIONALIDADE',
                pilar_intensidade: 'INTENSIDADE',
                
                // Níveis
                level_vale_despertar: 'Vale do Despertar',
                level_ruinas_ruptura: 'Ruínas da Ruptura',
                level_floresta_chamado: 'Floresta do Chamado',
                level_montanhas_descoberta: 'Montanhas da Descoberta',
                level_lago_discernimento: 'Lago do Discernimento',
                level_torre_ascensao: 'Torre da Ascensão',
                level_nucleo_caverna: 'Núcleo da Caverna',
                
                // Inimigos
                enemy_procrastinador: 'Procrastinador',
                enemy_distraidor: 'Distraidor',
                enemy_sabotador: 'Sabotador',
                enemy_comparador: 'Comparador',
                
                // Mensagens
                msg_level_complete: 'Nível Completo!',
                msg_game_over: 'Fim de Jogo',
                msg_retry: 'Tentar Novamente',
                msg_next_level: 'Próximo Nível',
                msg_crystal_found: 'Cristal de Foco Encontrado!',
                msg_enemy_defeated: 'Inimigo Derrotado!',
                msg_evolution: 'Evolução Alcançada!'
            },
            en: {
                // Versão em inglês para referência futura
                game_title: 'Cave Mode - The Journey',
                loading: 'LOADING...',
                start_game: 'CLICK TO START',
                continue: 'CONTINUE',
                day: 'DAY'
                // Outros textos seriam adicionados aqui
            }
        };
        
        return texts[language][key] || key;
    }
    
    // Criar efeito de partículas para cristais
    static createCrystalParticles(scene, x, y, color = 0x3498db) {
        const particles = scene.add.particles(x, y, 'tiles_things', {
            frame: 0,
            lifespan: 1000,
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            quantity: 10,
            tint: color,
            blendMode: 'ADD'
        });
        
        // Auto-destruir sistema de partículas após 1 segundo
        scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
        
        return particles;
    }
    
    // Criar efeito de texto flutuante
    static createFloatingText(scene, x, y, text, style = {}) {
        const defaultStyle = {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        };
        
        const mergedStyle = {...defaultStyle, ...style};
        
        const floatingText = scene.add.text(x, y, text, mergedStyle);
        floatingText.setOrigin(0.5);
        
        scene.tweens.add({
            targets: floatingText,
            y: y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                floatingText.destroy();
            }
        });
        
        return floatingText;
    }
}
