const symbols = [
    'images/cherries.png', 'images/7win.png', 'images/dices.png',
    'images/lollipop.png', 'images/martini.png', 'images/skull.png'
];
const reelCount = 3;
const symbolHeight = 220; // Ajustado para coincidir con la altura del rodillo
const spinDuration = 3000;
const SKULL_SYMBOL = 'images/skull.png';
const WIN_SYMBOL = 'images/7win.png';

// Recuperar nombres de localStorage
let playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
let eliminatedNames = JSON.parse(localStorage.getItem('eliminatedNames')) || [];

// --- NUEVOS Y ANTIGUOS SELECTORES ---
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const leverButton = document.getElementById('leverButton'); // Selector de la palanca
const eliminatedList = document.getElementById('eliminatedList'); // Ahora es la lista de la derecha
const resultDiv = document.getElementById('result'); // Ahora es la pantalla central

// Funciones de la Interfaz
function updateEliminatedList() {
    eliminatedList.innerHTML = '';
    eliminatedNames.forEach(name => {
        const li = document.createElement('li');
        li.textContent = name;
        eliminatedList.appendChild(li);
    });
}

function resetGame() {
    localStorage.removeItem('playerNames');
    localStorage.removeItem('eliminatedNames');
    window.location.href = 'index.html';
}

function removeRandomName() {
    if (playerNames.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * playerNames.length);
    const removedName = playerNames.splice(randomIndex, 1)[0];
    eliminatedNames.push(removedName);
    
    localStorage.setItem('playerNames', JSON.stringify(playerNames));
    localStorage.setItem('eliminatedNames', JSON.stringify(eliminatedNames));
    
    updateEliminatedList();
    return removedName;
}

// --- Lógica de la Tragaperras (sin cambios en las funciones de animación) ---
function initReels() {
    for (let i = 1; i <= reelCount; i++) {
        const symbolsContainer = document.getElementById(`symbols${i}`);
        symbolsContainer.innerHTML = '';
        for (let repeat = 0; repeat < 4; repeat++) {
            symbols.forEach(imagePath => {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'symbol';
                const img = document.createElement('img');
                img.src = imagePath;
                img.className = 'symbol-image';
                symbolDiv.appendChild(img);
                symbolsContainer.appendChild(symbolDiv);
            });
        }
    }
}

function spinReel(reelNumber, duration, targetSymbol) {
    return new Promise((resolve) => {
        const symbolsContainer = document.getElementById(`symbols${reelNumber}`);
        const allSymbols = symbolsContainer.querySelectorAll('.symbol');
        let targetIndex = -1; const startSearch = symbols.length; const endSearch = symbols.length * 2;
        for (let i = startSearch; i < endSearch; i++) {
            if (allSymbols[i]) {
                const img = allSymbols[i].querySelector('img');
                if (img && img.src.includes(targetSymbol)) { targetIndex = i; break; }
            }
        }
        if (targetIndex === -1) { targetIndex = startSearch; const img = allSymbols[targetIndex].querySelector('img'); if (img) img.src = targetSymbol; }
        const finalPosition = targetIndex * symbolHeight; const startTime = Date.now();
        const spinFastDuration = duration * 0.6; const slowDownDuration = duration * 0.4;
        const totalRotations = 8; const fastSpinDistance = symbolHeight * symbols.length * totalRotations;
        symbolsContainer.style.transition = 'none'; symbolsContainer.style.transform = 'translateY(0)';
        function animate() {
            const elapsed = Date.now() - startTime; const totalDuration = spinFastDuration + slowDownDuration;
            if (elapsed < spinFastDuration) {
                const progress = elapsed / spinFastDuration; const currentPosition = progress * fastSpinDistance;
                symbolsContainer.style.transform = `translateY(-${currentPosition % (symbolHeight * symbols.length)}px)`; requestAnimationFrame(animate);
            } else if (elapsed < totalDuration) {
                const slowDownElapsed = elapsed - spinFastDuration; const slowDownProgress = slowDownElapsed / slowDownDuration;
                const easeOutCubic = 1 - Math.pow(1 - slowDownProgress, 3);
                const slowDownStart = fastSpinDistance % (symbolHeight * symbols.length);
                const additionalDistance = (symbolHeight * symbols.length * 2) + finalPosition;
                const currentPosition = slowDownStart + (easeOutCubic * additionalDistance);
                symbolsContainer.style.transform = `translateY(-${currentPosition}px)`; requestAnimationFrame(animate);
            } else {
                const finalAbsolutePosition = (symbolHeight * symbols.length * 2) + finalPosition;
                symbolsContainer.style.transform = `translateY(-${finalAbsolutePosition}px)`; resolve();
            }
        }
        animate();
    });
}

async function spin() {
    // Deshabilitar el botón de girar y la palanca
    spinButton.disabled = true;
    leverButton.style.pointerEvents = 'none';
    leverButton.style.opacity = '0.5';
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; 
    
    initReels();
    
    let targetSymbol = SKULL_SYMBOL;
    
    // Si quedan 2 jugadores, el próximo turno es para decidir el ganador
    if (playerNames.length === 2) {
        targetSymbol = WIN_SYMBOL;
    }

    const spinPromises = [];
    for (let i = 0; i < reelCount; i++) {
        const delay = i * 300; 
        const reelDuration = spinDuration + (i * 400);
        const delayedSpin = new Promise((resolve) => {
            setTimeout(async () => { 
                await spinReel(i + 1, reelDuration, targetSymbol); 
                resolve(); 
            }, delay);
        });
        spinPromises.push(delayedSpin);
    }
    
    await Promise.all(spinPromises);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (targetSymbol === SKULL_SYMBOL) {
        const removedName = removeRandomName();
        resultDiv.innerHTML = `💀 ${removedName} ha sido eliminado! <img src="${SKULL_SYMBOL}" class="result-image" alt="Skull">`;
        resultDiv.style.color = '#ff4444';
        
        // Comprobar si después de eliminar solo queda 1
        if (playerNames.length === 1) {
            // Si solo queda 1, el juego ha terminado. Deshabilitar el botón de girar y la palanca.
            spinButton.disabled = true;
            leverButton.style.pointerEvents = 'none';
            setTimeout(() => {
                resultDiv.innerHTML = `🎉 ¡${playerNames[0]} ES EL GANADOR! <img src="${WIN_SYMBOL}" class="result-image" alt="Winner">`;
                resultDiv.style.color = '#00ff00';
                spinButton.style.display = 'none';
                leverButton.style.display = 'none';
                resetButton.style.display = 'inline-block';
            }, 2500); // Esperar un momento antes de anunciar al ganador
        } else {
            // Rehabilitar la palanca para el siguiente giro
            spinButton.disabled = false;
            leverButton.style.pointerEvents = 'auto';
            leverButton.style.opacity = '1';
        }

    } else if (targetSymbol === WIN_SYMBOL) {
        // 1. Eliminar al último perdedor y añadirlo a la lista de eliminados
        const lastEliminated = removeRandomName(); 
        
        // 2. El que queda en el array es el ganador
        const winner = playerNames[0]; 
        
        // 3. Mostrar el mensaje del ganador
        resultDiv.innerHTML = `🎉 ¡${winner} ES EL GANADOR! <img src="${WIN_SYMBOL}" class="result-image" alt="Winner">`;
        resultDiv.style.color = '#00ff00';
        
        // Vaciar la lista de jugadores para terminar el juego
        playerNames = [];
        localStorage.setItem('playerNames', JSON.stringify(playerNames));

        // Cambiar botones
        spinButton.style.display = 'none';
        leverButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
    }
}


// --- Inicialización del Juego (lógica actualizada) ---
document.addEventListener('DOMContentLoaded', () => {
    if (playerNames.length < 2) {
        alert('No hay suficientes jugadores. Añade al menos 2.');
        window.location.href = 'index.html';
        return;
    }

    // Eventos para la palanca y botones
    leverButton.addEventListener('click', spin); // La palanca activa el giro
    spinButton.addEventListener('click', spin);
    resetButton.addEventListener('click', resetGame);
    initReels();
    updateEliminatedList();
});


