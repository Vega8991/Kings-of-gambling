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

// Array para almacenar los nombres de los jugadores
let playerNames = [];

// Rutas de los símbolos especiales
const SKULL_SYMBOL = 'images/skull.png';
const WIN_SYMBOL = 'images/7win.png';

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

// Función para añadir un nombre a la lista
function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name === '') {
        alert('Por favor, introduce un nombre válido');
        return;
    }
    
    if (playerNames.includes(name)) {
        alert('Este nombre ya está en la lista');
        return;
    }
    
    playerNames.push(name);
    nameInput.value = '';
    updateNamesList();
    updateSpinButton();
}

// Función para actualizar la visualización de la lista de nombres
function updateNamesList() {
    const namesList = document.getElementById('namesList');
    const namesCount = document.getElementById('namesCount');
    
    namesList.innerHTML = '';
    
    playerNames.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = name;
        
        // Botón para eliminar manualmente
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => removeName(index);
        
        li.appendChild(deleteBtn);
        namesList.appendChild(li);
    });
    
    namesCount.textContent = `${playerNames.length} jugador${playerNames.length !== 1 ? 'es' : ''}`;
}

// Función para eliminar un nombre manualmente
function removeName(index) {
    playerNames.splice(index, 1);
    updateNamesList();
    updateSpinButton();
}

// Función para eliminar un nombre aleatorio
function removeRandomName() {
    if (playerNames.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * playerNames.length);
    const removedName = playerNames.splice(randomIndex, 1)[0];
    
    updateNamesList();
    return removedName;
}

// Función para habilitar/deshabilitar el botón de girar
function updateSpinButton() {
    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = playerNames.length < 2;
}

// Función para girar un rodillo específico con animación visible y desaceleración gradual
function spinReel(reelNumber, duration, targetSymbol) {
    return new Promise((resolve) => {
        const symbolsContainer = document.getElementById(`symbols${reelNumber}`);
        const allSymbols = symbolsContainer.querySelectorAll('.symbol');
        
        // Buscar el símbolo objetivo en la segunda repetición
        let targetIndex = -1;
        const startSearch = symbols.length;
        const endSearch = symbols.length * 2;
        
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
        
        const symbolHeight = 150;
        const finalPosition = targetIndex * symbolHeight;
        
        // Parámetros de la animación
        const startTime = Date.now();
        const spinFastDuration = duration * 0.6; // 60% del tiempo girando rápido
        const slowDownDuration = duration * 0.4; // 40% del tiempo desacelerando
        const totalRotations = 8; // Número de vueltas completas
        const fastSpinDistance = symbolHeight * symbols.length * totalRotations;
        
        // Reiniciar posición
        symbolsContainer.style.transition = 'none';
        symbolsContainer.style.transform = 'translateY(0)';
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const totalDuration = spinFastDuration + slowDownDuration;
            
            if (elapsed < spinFastDuration) {
                // FASE 1: Giro rápido constante
                const progress = elapsed / spinFastDuration;
                const currentPosition = progress * fastSpinDistance;
                symbolsContainer.style.transform = `translateY(-${currentPosition % (symbolHeight * symbols.length)}px)`;
                requestAnimationFrame(animate);
                
            } else if (elapsed < totalDuration) {
                // FASE 2: Desaceleración gradual con easing suave
                const slowDownElapsed = elapsed - spinFastDuration;
                const slowDownProgress = slowDownElapsed / slowDownDuration;
                
                // Función de easing para desaceleración suave (ease-out cubic)
                const easeOutCubic = 1 - Math.pow(1 - slowDownProgress, 3);
                
                // Calcular posición durante la desaceleración
                const slowDownStart = fastSpinDistance % (symbolHeight * symbols.length);
                const additionalDistance = (symbolHeight * symbols.length * 2) + finalPosition;
                const currentPosition = slowDownStart + (easeOutCubic * additionalDistance);
                
                symbolsContainer.style.transform = `translateY(-${currentPosition}px)`;
                requestAnimationFrame(animate);
                
            } else {
                // FASE 3: Parada final - asegurar posición exacta
                const finalAbsolutePosition = (symbolHeight * symbols.length * 2) + finalPosition;
                symbolsContainer.style.transform = `translateY(-${finalAbsolutePosition}px)`;
                resolve();
            }
        }
        
        animate();
    });
}


// Función principal para girar todos los rodillos
// Función principal para girar todos los rodillos
async function spin() {
    const button = document.getElementById('spinButton');
    const resultDiv = document.getElementById('result');
    
    if (playerNames.length < 2) {
        alert('Necesitas al menos 2 jugadores para empezar');
        return;
    }
    
    button.disabled = true;
    resultDiv.textContent = '';
    
    // Reiniciar rodillos
    initReels();
    
    // Determinar el símbolo según cuántos jugadores quedan
    let targetSymbol;
    
    if (playerNames.length === 2) {
        // Solo quedan 2 jugadores, mostrar 7win (último giro)
        targetSymbol = WIN_SYMBOL;
    } else {
        // Más de 2 jugadores, mostrar skull
        targetSymbol = SKULL_SYMBOL;
    }
    
    // Crear array de promesas con los delays incluidos
    const spinPromises = [];
    
    for (let i = 0; i < reelCount; i++) {
        const delay = i * 300;
        const reelDuration = spinDuration + (i * 400);
        
        // Crear una promesa que incluye el delay Y el giro completo
        const delayedSpin = new Promise((resolve) => {
            setTimeout(async () => {
                await spinReel(i + 1, reelDuration, targetSymbol);
                resolve();
            }, delay);
        });
        
        spinPromises.push(delayedSpin);
    }
    
    // ESPERAR a que TODOS los rodillos (incluyendo delays) terminen
    await Promise.all(spinPromises);
    
    // Pequeño delay adicional para efecto dramático
    await new Promise(resolve => setTimeout(resolve));
    
    // AHORA sí mostrar el resultado - GARANTIZADO que los rodillos están parados
    if (targetSymbol === SKULL_SYMBOL) {
        const removedName = removeRandomName();
        resultDiv.innerHTML = `💀 ${removedName} ha sido eliminado! <img src="${SKULL_SYMBOL}" class="result-image" alt="Skull">`;
        resultDiv.style.color = '#ff4444';
    } else {
        // Solo queda 1 jugador, es el ganador
        const winner = removeRandomName();
        resultDiv.innerHTML = `🎉 ¡${winner} ES EL GANADOR! <img src="${WIN_SYMBOL}" class="result-image" alt="Winner">`;
        resultDiv.style.color = '#00ff00';
        
        // Limpiar el último jugador también
        playerNames = [];
        updateNamesList();
    }
    
    updateSpinButton();
    button.disabled = false;
}



// Event listeners
document.getElementById('spinButton').addEventListener('click', spin);
document.getElementById('addNameButton').addEventListener('click', addName);

// Permitir añadir nombre con Enter
document.getElementById('nameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addName();
    }
});

// Inicializar al cargar la página
initReels();
updateSpinButton();


