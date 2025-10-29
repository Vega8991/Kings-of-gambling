const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];
const reelCount = 3;
const symbolHeight = 150;
const spinDuration = 2000;

// DEFINE AQUÍ EL ICONO GANADOR (usa 'IMAGE' para el PNG personalizado)
const WINNING_SYMBOL = 'IMAGE'; // Cambiar a un emoji para usar emojis normales
const WINNING_IMAGE_PATH = 'images/7win.png'; // Ruta de tu imagen PNG

// Inicializar los rodillos con símbolos duplicados para efecto continuo
function initReels() {
    for (let i = 1; i <= reelCount; i++) {
        const symbolsContainer = document.getElementById(`symbols${i}`);
        symbolsContainer.innerHTML = '';
        
        // Crear múltiples copias de todos los símbolos para giro continuo
        for (let repeat = 0; repeat < 4; repeat++) {
            symbols.forEach(symbol => {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'symbol';
                symbolDiv.textContent = symbol;
                symbolsContainer.appendChild(symbolDiv);
            });
        }
    }
}

// Función auxiliar para crear un símbolo (texto o imagen)
function createSymbolElement(symbolValue) {
    const symbolDiv = document.createElement('div');
    symbolDiv.className = 'symbol';
    
    if (symbolValue === 'IMAGE') {
        const img = document.createElement('img');
        img.src = WINNING_IMAGE_PATH;
        img.className = 'symbol-image';
        img.alt = 'Símbolo ganador';
        symbolDiv.appendChild(img);
    } else {
        symbolDiv.textContent = symbolValue;
    }
    
    return symbolDiv;
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
                    if (targetSymbol === 'IMAGE') {
                        // Reemplazar con imagen
                        allSymbols[i].innerHTML = '';
                        const img = document.createElement('img');
                        img.src = WINNING_IMAGE_PATH;
                        img.className = 'symbol-image';
                        img.alt = 'Símbolo ganador';
                        allSymbols[i].appendChild(img);
                        targetIndex = i;
                        break;
                    } else if (allSymbols[i].textContent === targetSymbol) {
                        targetIndex = i;
                        break;
                    }
                }
            }
            
            // Si no se encuentra, usar el primer símbolo de la segunda repetición
            if (targetIndex === -1) {
                targetIndex = startSearch;
                allSymbols[targetIndex].innerHTML = '';
                if (targetSymbol === 'IMAGE') {
                    const img = document.createElement('img');
                    img.src = WINNING_IMAGE_PATH;
                    img.className = 'symbol-image';
                    img.alt = 'Símbolo ganador';
                    allSymbols[targetIndex].appendChild(img);
                } else {
                    allSymbols[targetIndex].textContent = targetSymbol;
                }
            }
            
            // Fase 2: Desaceleración suave hasta el símbolo objetivo
            const finalPosition = targetIndex * symbolHeight;
            symbolsContainer.style.transition = `transform ${duration / 1.002}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
            symbolsContainer.style.transform = `translateY(-${finalPosition}px)`;
            
            setTimeout(() => {
                resolve();
            }, duration / 1.002);
            
        }, duration / 1.002);
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
    
    // Girar los rodillos con diferentes delays, todos hacia el MISMO icono predefinido
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
    
    // Mostrar resultado
    if (WINNING_SYMBOL === 'IMAGE') {
        resultDiv.innerHTML = `🎉 ¡GANASTE! <img src="${WINNING_IMAGE_PATH}" class="result-image" alt="Premio">`;
    } else {
        resultDiv.textContent = `🎉 ¡GANASTE! ${WINNING_SYMBOL}${WINNING_SYMBOL}${WINNING_SYMBOL}`;
    }
    resultDiv.style.color = '#00ff00';
    
    button.disabled = false;
}

// Event listener para el botón
document.getElementById('spinButton').addEventListener('click', spin);

// Inicializar al cargar la página
initReels();


