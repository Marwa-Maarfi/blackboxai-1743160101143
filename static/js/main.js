document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('file-upload');
    const visualizationContainer = document.getElementById('visualization-container');
    
    fileUpload.addEventListener('change', handleFileUpload);

    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        visualizationContainer.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin text-3xl text-primary"></i><p>Analyse des données...</p></div>';

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                // Request visualization recommendations
                const vizResponse = await fetch('/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result.data)
                });

                const recommendations = await vizResponse.json();
                displayVisualizations(recommendations, result.data);
            } else {
                throw new Error(result.error || 'Erreur inconnue');
            }
        } catch (error) {
            visualizationContainer.innerHTML = `
                <div class="text-center text-red-500">
                    <i class="fas fa-exclamation-triangle text-3xl"></i>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    function displayVisualizations(recommendations, data) {
        visualizationContainer.innerHTML = '';
        
        if (recommendations.error) {
            visualizationContainer.innerHTML = `
                <div class="text-center text-red-500">
                    <i class="fas fa-exclamation-triangle text-3xl"></i>
                    <p>${recommendations.error}</p>
                </div>
            `;
            return;
        }

        // Create tabs for each visualization
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'flex border-b border-gray-200 mb-4';
        
        const contentContainer = document.createElement('div');
        contentContainer.className = 'viz-content';

        recommendations.forEach((viz, index) => {
            // Create tab button
            const tab = document.createElement('button');
            tab.className = `py-2 px-4 font-medium ${index === 0 ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`;
            tab.textContent = viz.title || `Visualisation ${index + 1}`;
            tab.onclick = () => switchTab(index, recommendations, contentContainer, tabsContainer);
            tabsContainer.appendChild(tab);

            // Create visualization content
            if (index === 0) {
                const vizElement = createVisualization(viz, data);
                contentContainer.appendChild(vizElement);
            }
        });

        visualizationContainer.appendChild(tabsContainer);
        visualizationContainer.appendChild(contentContainer);
    }

    function switchTab(index, recommendations, contentContainer, tabsContainer) {
        // Update active tab styling
        Array.from(tabsContainer.children).forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('border-b-2', 'border-primary', 'text-primary');
                tab.classList.remove('text-gray-500');
            } else {
                tab.classList.remove('border-b-2', 'border-primary', 'text-primary');
                tab.classList.add('text-gray-500');
            }
        });

        // Update content
        contentContainer.innerHTML = '';
        const vizElement = createVisualization(recommendations[index], data);
        contentContainer.appendChild(vizElement);
    }

    function createVisualization(viz, data) {
        const vizElement = document.createElement('div');
        vizElement.className = 'p-4';
        
        // In a real implementation, this would use Plotly or similar
        vizElement.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${viz.title || 'Visualisation'}</h3>
            <p class="text-gray-600 mb-4">${viz.reason || ''}</p>
            <div class="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                <p class="text-gray-500">${viz.chart_type} chart would display here</p>
            </div>
        `;
        
        return vizElement;
    }
});