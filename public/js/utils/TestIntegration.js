// Integração do sistema de testes com o jogo principal
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar botão de teste ao jogo (visível apenas em modo de desenvolvimento)
    const testButton = document.createElement('button');
    testButton.id = 'test-button';
    testButton.textContent = 'Executar Testes';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '1000';
    testButton.style.padding = '8px 16px';
    testButton.style.backgroundColor = '#ff0000';
    testButton.style.color = '#ffffff';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    testButton.style.display = 'none'; // Oculto por padrão
    
    document.body.appendChild(testButton);
    
    // Verificar se estamos em modo de desenvolvimento
    const isDevMode = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.search.includes('dev=true');
    
    if (isDevMode) {
        testButton.style.display = 'block';
        
        // Adicionar evento de clique para executar testes
        testButton.addEventListener('click', () => {
            if (window.game) {
                const tester = new GameTester(window.game);
                const results = tester.runAllTests();
                
                // Exibir resultados em um modal
                showTestResults(results);
            } else {
                alert('Jogo não inicializado. Aguarde o carregamento completo.');
            }
        });
    }
    
    // Função para exibir resultados dos testes
    function showTestResults(results) {
        // Criar modal para exibir resultados
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '2000';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        
        // Conteúdo do modal
        const content = document.createElement('div');
        content.style.backgroundColor = '#1A1A1A';
        content.style.color = '#ffffff';
        content.style.padding = '20px';
        content.style.borderRadius = '8px';
        content.style.maxWidth = '80%';
        content.style.maxHeight = '80%';
        content.style.overflow = 'auto';
        
        // Título
        const title = document.createElement('h2');
        title.textContent = `Resultados dos Testes: ${results.passedTests}/${results.totalTests} Passaram`;
        title.style.color = results.success ? '#2ecc71' : '#e74c3c';
        title.style.textAlign = 'center';
        content.appendChild(title);
        
        // Detalhes dos testes
        const details = document.createElement('div');
        details.style.marginTop = '20px';
        
        // Criar tabela de resultados
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        // Cabeçalho da tabela
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const testHeader = document.createElement('th');
        testHeader.textContent = 'Teste';
        testHeader.style.textAlign = 'left';
        testHeader.style.padding = '8px';
        testHeader.style.borderBottom = '1px solid #444';
        
        const resultHeader = document.createElement('th');
        resultHeader.textContent = 'Resultado';
        resultHeader.style.textAlign = 'center';
        resultHeader.style.padding = '8px';
        resultHeader.style.borderBottom = '1px solid #444';
        
        headerRow.appendChild(testHeader);
        headerRow.appendChild(resultHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Corpo da tabela
        const tbody = document.createElement('tbody');
        
        for (const [test, result] of Object.entries(results.results)) {
            const row = document.createElement('tr');
            
            const testCell = document.createElement('td');
            testCell.textContent = formatTestName(test);
            testCell.style.padding = '8px';
            testCell.style.borderBottom = '1px solid #333';
            
            const resultCell = document.createElement('td');
            resultCell.textContent = result ? 'PASSOU' : 'FALHOU';
            resultCell.style.textAlign = 'center';
            resultCell.style.padding = '8px';
            resultCell.style.color = result ? '#2ecc71' : '#e74c3c';
            resultCell.style.borderBottom = '1px solid #333';
            
            row.appendChild(testCell);
            row.appendChild(resultCell);
            tbody.appendChild(row);
        }
        
        table.appendChild(tbody);
        details.appendChild(table);
        
        // Adicionar estatísticas
        const stats = document.createElement('div');
        stats.style.marginTop = '20px';
        stats.style.padding = '10px';
        stats.style.backgroundColor = '#222';
        stats.style.borderRadius = '4px';
        
        stats.innerHTML = `
            <h3>Estatísticas</h3>
            <p>Duração do teste: ${results.details.testDuration}</p>
            <p>Diálogos acionados: ${results.details.dialoguesTriggered}</p>
            <p>Inimigos derrotados: ${results.details.enemiesDefeated}</p>
            <p>Cristais coletados: ${results.details.crystalsCollected}</p>
        `;
        
        details.appendChild(stats);
        content.appendChild(details);
        
        // Botão para fechar o modal
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Fechar';
        closeButton.style.display = 'block';
        closeButton.style.margin = '20px auto 0';
        closeButton.style.padding = '8px 16px';
        closeButton.style.backgroundColor = '#ff0000';
        closeButton.style.color = '#ffffff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        content.appendChild(closeButton);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }
    
    // Função para formatar nome do teste
    function formatTestName(testName) {
        return testName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
    }
});
