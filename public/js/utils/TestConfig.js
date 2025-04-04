// Configuração para testes do jogo Modo Caverna
class TestConfig {
    constructor() {
        // Flags para ativar/desativar recursos durante testes
        this.debugMode = false;
        this.showFPS = false;
        this.invincible = false;
        this.skipDialogue = false;
        this.unlockAllLevels = false;
        this.fastEvolution = false;
        
        // Contadores para estatísticas
        this.dialoguesTriggered = 0;
        this.enemiesDefeated = 0;
        this.crystalsCollected = 0;
        this.playerDeaths = 0;
        this.timeStarted = Date.now();
        
        // Registro de eventos para debugging
        this.eventLog = [];
    }
    
    // Ativar modo de debug
    enableDebug() {
        this.debugMode = true;
        console.log('Modo de debug ativado');
        return this;
    }
    
    // Registrar evento
    logEvent(eventType, data) {
        if (!this.debugMode) return;
        
        const timestamp = Date.now();
        const timeElapsed = timestamp - this.timeStarted;
        
        const event = {
            type: eventType,
            time: new Date(timestamp).toISOString(),
            timeElapsed: `${Math.floor(timeElapsed / 1000)}s`,
            data: data
        };
        
        this.eventLog.push(event);
        console.log(`[${event.timeElapsed}] ${eventType}:`, data);
    }
    
    // Obter relatório de testes
    getTestReport() {
        const timeElapsed = Date.now() - this.timeStarted;
        
        return {
            testDuration: `${Math.floor(timeElapsed / 1000)}s`,
            dialoguesTriggered: this.dialoguesTriggered,
            enemiesDefeated: this.enemiesDefeated,
            crystalsCollected: this.crystalsCollected,
            playerDeaths: this.playerDeaths,
            eventLog: this.debugMode ? this.eventLog : 'Debug mode disabled'
        };
    }
    
    // Resetar estatísticas
    resetStats() {
        this.dialoguesTriggered = 0;
        this.enemiesDefeated = 0;
        this.crystalsCollected = 0;
        this.playerDeaths = 0;
        this.timeStarted = Date.now();
        this.eventLog = [];
    }
}

// Exportar instância global para testes
const TEST_CONFIG = new TestConfig();
