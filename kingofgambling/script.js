const symbols = [
    'images/cherries.png',
    'images/7win.png',
    'images/dices.png',
    'images/lollipop.png',
    'images/martini.png',
    'images/skull.png',
    'images/dices.png'
];


const reelCount = 3;
const symbolHeight = 150;
const spinDuration = 3000;

// DEFINE AQUÍ LA IMAGEN GANADORA (usa el índice del array o la ruta completa)
const WINNING_SYMBOL = 'images/7win.png'; // Cambia por la ruta de la imagen que quieras

// Inicializar los rodillos con imágenes duplicadas para efecto continuo
function initReels() {
    for (let i = 1; i <= reelCount; i++) {
        const symbolsContainer = document.getElementById(`symbols${i}`);
        symbolsContainer.innerHTML = '';
        
        // Crear múltiples copias de todas las imágenes para giro continuo
        for (let repeat = 0; repeat < 4; repeat++) {
            symbols.forEach(imagePath => {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'symbol';
                
                // Crear elemento de imagen
                const img = document.createElement('img');
                img.src = imagePath;
                img.className = 'symbol-image';
                img.alt = 'Símbolo';
                
                symbolDiv.appendChild(img);
                symbolsContainer.appendChild(symbolDiv);
            });
        }
    }
}

// Función para girar un rodillo específico con animación visible
function spinReel(reelNumber, duration, targetSymbol) {
    return new Promise((resolve) => {
        const symbolsContainer = document.getElementById(`symbols${reelNumber}`);
        const allSymbols = symbolsContainer.querySelectorAll('.symbol');
        
        // Fase 1: Giro rápido y continuo
        symbolsContainer.classList.add('spinning');
        symbolsContainer.style.transition = 'none';
        
        // Reiniciar posición para el giro continuo
        symbolsContainer.style.transform = 'translateY(0)';
        
        // Después de un tiempo, preparar la parada
        setTimeout(() => {
            // Quitar la animación CSS de giro continuo
            symbolsContainer.classList.remove('spinning');
            
            // Buscar el símbolo objetivo en la segunda repetición
            let targetIndex = -1;
            const startSearch = symbols.length; // Empezar desde la segunda repetición
            const endSearch = symbols.length * 2; // Hasta la tercera repetición
            
            for (let i = startSearch; i < endSearch; i++) {
                if (allSymbols[i]) {
                    const img = allSymbols[i].querySelector('img');
                    if (img && img.src.includes(targetSymbol)) {
                        targetIndex = i;
                        break;
                    }
                }
            }
            
            // Si no se encuentra, usar el primer símbolo de la segunda repetición
            if (targetIndex === -1) {
                targetIndex = startSearch;
                const img = allSymbols[targetIndex].querySelector('img');
                if (img) {
                    img.src = targetSymbol;
                }
            }
            
            // Fase 2: Desaceleración suave hasta el símbolo objetivo
            const finalPosition = targetIndex * symbolHeight;
            symbolsContainer.style.transition = `transform ${duration / 2}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
            symbolsContainer.style.transform = `translateY(-${finalPosition}px)`;
            
            setTimeout(() => {
                resolve();
            }, duration / 2);
            
        }, duration / 2);
    });
}

// Función principal para girar todos los rodillos
async function spin() {
    const button = document.getElementById('spinButton');
    const resultDiv = document.getElementById('result');
    
    button.disabled = true;
    resultDiv.textContent = '';
    
    // Reiniciar rodillos
    initReels();
    
    // Girar los rodillos con diferentes delays, todos hacia la MISMA imagen predefinida
    const spinPromises = [];
    for (let i = 0; i < reelCount; i++) {
        const delay = i * 300;
        const reelDuration = spinDuration + (i * 400);
        
        setTimeout(() => {
            spinPromises.push(spinReel(i + 1, reelDuration, WINNING_SYMBOL));
        }, delay);
    }
    
    // Esperar a que todos los rodillos terminen
    await Promise.all(spinPromises);
    
    // Mostrar resultado con la imagen
    resultDiv.innerHTML = `🎉 ¡GANASTE! <img src="${WINNING_SYMBOL}" class="result-image" alt="Premio"><img src="${WINNING_SYMBOL}" class="result-image" alt="Premio"><img src="${WINNING_SYMBOL}" class="result-image" alt="Premio">`;
    resultDiv.style.color = '#00ff00';
    
    button.disabled = false;
}

// Event listener para el botón
document.getElementById('spinButton').addEventListener('click', spin);

// Inicializar al cargar la página
initReels();


