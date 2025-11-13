let symbols = [
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/cherries_sz2jzc.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/7win_xttuzb.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948685/dices_oxbdb3.png',
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948685/lollipop_dxaqku.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948686/martini_a1n7zq.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948687/skull_cgo9ps.png'
];
let reelCount = 3;

// Calcular symbolHeight dinámicamente según el tamaño de pantalla
function getSymbolHeight() {
    let screenWidth = window.innerWidth;
    if (screenWidth <= 390) {
        return 91; // 55% del original para pantallas muy pequeñas
    } else if (screenWidth <= 480) {
        return 99; // 60% del original para móviles estándar
    } else {
        return 165; // 75% del original para desktop
    }
}

let symbolHeight = getSymbolHeight();
let spinDuration = 3000;
let SKULL_SYMBOL = 'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948687/skull_cgo9ps.png';
let WIN_SYMBOL = 'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/7win_xttuzb.png';

let returnPageBtn = document.getElementById('returnPageBtn');

returnPageBtn.addEventListener('click', function() {
    window.location.href = 'Init.html';
});


let gameMusic = document.getElementById('gameMusic');
let volumeBtn = document.getElementById('volumeBtn');
let musicEnabled = false;

let savedMusicState = localStorage.getItem('musicaActivada');
if (savedMusicState === null || savedMusicState === 'true') {
    musicEnabled = true;
} else {
    musicEnabled = false;
}

if (gameMusic) {
    // Configurar volumen inicial
    let savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
        gameMusic.volume = savedVolume / 100;
        let volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = savedVolume;
        }
    } else {
        gameMusic.volume = 0.5;
    }
    
    if (musicEnabled === true) {
        // Restaurar tiempo guardado
        let savedTime = localStorage.getItem('musicCurrentTime');
        if (savedTime) {
            gameMusic.currentTime = parseFloat(savedTime);
        }
        
        gameMusic.play().then(function() {
            console.log('Music playing');
        }).catch(function() {
            console.log('Autoplay blocked');
            musicEnabled = false;
            volumeBtn.classList.add('music-off');
        });
    } else {
        volumeBtn.classList.add('music-off');
    }
    
    // Guardar tiempo cada 1 segundo mientras se reproduce
    gameMusic.addEventListener('timeupdate', function() {
        if (!gameMusic.paused) {
            localStorage.setItem('musicCurrentTime', gameMusic.currentTime);
        }
    });
}

// Guardar estado antes de salir de la página
window.addEventListener('beforeunload', function() {
    if (gameMusic && !gameMusic.paused) {
        localStorage.setItem('musicCurrentTime', gameMusic.currentTime);
        localStorage.setItem('musicaActivada', 'true');
    }
});

if (volumeBtn) {
    volumeBtn.addEventListener('click', function() {
        if (musicEnabled === true) {
            musicEnabled = false;
            gameMusic.pause();
            localStorage.setItem('musicCurrentTime', gameMusic.currentTime);
            volumeBtn.classList.add('music-off');
            console.log('Game music disabled');
        } else {
            musicEnabled = true;
            // Restaurar el tiempo antes de reproducir
            let savedTime = localStorage.getItem('musicCurrentTime');
            if (savedTime) {
                gameMusic.currentTime = parseFloat(savedTime);
            }
            gameMusic.play();
            volumeBtn.classList.remove('music-off');
            console.log('Game music enabled');
        }
        
        localStorage.setItem('musicaActivada', musicEnabled);
    });
}

// Control de la barra de volumen
let volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider && gameMusic) {
    volumeSlider.addEventListener('input', function() {
        let volume = this.value;
        gameMusic.volume = volume / 100;
        localStorage.setItem('musicVolume', volume);
    });
}

let playerNames = [];
let savedPlayers = localStorage.getItem('playerNames');
if (savedPlayers) {
    playerNames = JSON.parse(savedPlayers);
}

let eliminatedNames = [];
let savedEliminated = localStorage.getItem('eliminatedNames');
if (savedEliminated) {
    eliminatedNames = JSON.parse(savedEliminated);
}

let spinButton = document.getElementById('spinButton');
let resetButton = document.getElementById('resetButton');
let leverButton = document.getElementById('leverButton');
let eliminatedList = document.getElementById('eliminatedList');
let resultDiv = document.getElementById('result');

function showEliminatedPlayers() {
    eliminatedList.innerHTML = '';
    
    for (let i = 0; i < eliminatedNames.length; i++) {
        let li = document.createElement('li');
        li.textContent = eliminatedNames[i];
        eliminatedList.appendChild(li);
    }
}

function restartGame() {
    localStorage.removeItem('playerNames');
    localStorage.removeItem('eliminatedNames');
    window.location.href = '../Init/Init.html';
}

function eliminateRandomPlayer() {
    if (playerNames.length === 0) {
        return null;
    }
    
    let randomIndex = Math.floor(Math.random() * playerNames.length);
    let removedName = playerNames.splice(randomIndex, 1)[0];
    eliminatedNames.push(removedName);
    
    let playersText = JSON.stringify(playerNames);
    localStorage.setItem('playerNames', playersText);
    
    let eliminatedText = JSON.stringify(eliminatedNames);
    localStorage.setItem('eliminatedNames', eliminatedText);
    
    showEliminatedPlayers();
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
    return new Promise(function(resolve) {
        const symbolsContainer = document.getElementById('symbols' + reelNumber);
        const allSymbols = symbolsContainer.querySelectorAll('.symbol');
        let targetIndex = -1;
        
        // Buscar el símbolo objetivo - buscar por el contenido de la URL
        for (let i = 0; i < allSymbols.length; i++) {
            const img = allSymbols[i].querySelector('img');
            if (img && img.src) {
                // Comparar usando la URL completa o parte de ella
                if (img.src === targetSymbol || img.src.includes(targetSymbol.split('/').pop())) {
                    targetIndex = i;
                    break;
                }
            }
        }
        
        // Si no encuentra, buscar en un rango específico (segunda vuelta)
        if (targetIndex === -1) {
            const secondLoopStart = symbols.length;
            const secondLoopEnd = symbols.length * 2;
            for (let i = secondLoopStart; i < secondLoopEnd && i < allSymbols.length; i++) {
                const img = allSymbols[i].querySelector('img');
                if (img) {
                    targetIndex = i;
                    img.src = targetSymbol;
                    break;
                }
            }
        }
        
        // Fallback: usar el primero disponible
        if (targetIndex === -1) {
            targetIndex = 0;
            if (allSymbols[targetIndex]) {
                const img = allSymbols[targetIndex].querySelector('img');
                if (img) {
                    img.src = targetSymbol;
                }
            }
        }
        
        const finalPosition = targetIndex * symbolHeight;
        const startTime = Date.now();
        const spinFastDuration = duration * 0.6;
        const slowDownDuration = duration * 0.4;
        const totalRotations = 8;
        const fastSpinDistance = symbolHeight * symbols.length * totalRotations;
        
        symbolsContainer.style.transition = 'none';
        symbolsContainer.style.transform = 'translateY(0)';
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const totalDuration = spinFastDuration + slowDownDuration;
            
            if (elapsed < spinFastDuration) {
                const progress = elapsed / spinFastDuration;
                const currentPosition = progress * fastSpinDistance;
                const wrappedPosition = currentPosition % (symbolHeight * symbols.length);
                symbolsContainer.style.transform = 'translateY(-' + wrappedPosition + 'px)';
                requestAnimationFrame(animate);
            } else if (elapsed < totalDuration) {
                const slowDownElapsed = elapsed - spinFastDuration;
                const slowDownProgress = slowDownElapsed / slowDownDuration;
                const easeOutCubic = 1 - Math.pow(1 - slowDownProgress, 3);
                const slowDownStart = fastSpinDistance % (symbolHeight * symbols.length);
                const additionalDistance = (symbolHeight * symbols.length * 2) + finalPosition;
                const currentPosition = slowDownStart + (easeOutCubic * additionalDistance);
                symbolsContainer.style.transform = 'translateY(-' + currentPosition + 'px)';
                requestAnimationFrame(animate);
            } else {
                // Posición final correcta
                const finalAbsolutePosition = (symbolHeight * symbols.length * 2) + finalPosition;
                symbolsContainer.style.transform = 'translateY(-' + finalAbsolutePosition + 'px)';
                
                // Asegurar que el contenedor sea visible
                symbolsContainer.style.visibility = 'visible';
                symbolsContainer.style.opacity = '1';
                
                resolve();
            }
        }
        animate();
    });
}

async function spin() {
    // Actualizar symbolHeight por si cambió el tamaño de pantalla
    symbolHeight = getSymbolHeight();
    
    spinButton.disabled = true;
    leverButton.style.pointerEvents = 'none';
    leverButton.style.opacity = '0.5';
    
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; 
    
    initReels();
    
    let targetSymbol = SKULL_SYMBOL;
    
    if (playerNames.length === 2) {
        targetSymbol = WIN_SYMBOL;
    }

    let spinPromises = [];
    for (let i = 0; i < reelCount; i++) {
        let delay = i * 300; 
        let reelDuration = spinDuration + (i * 400);
        let delayedSpin = new Promise(function(resolve) {
            setTimeout(async function() { 
                await spinReel(i + 1, reelDuration, targetSymbol); 
                resolve(); 
            }, delay);
        });
        spinPromises.push(delayedSpin);
    }
    
    await Promise.all(spinPromises);
    await new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, 800);
    });
    
    if (targetSymbol === SKULL_SYMBOL) {
        let removedName = eliminateRandomPlayer();
        resultDiv.innerHTML = '💀 ' + removedName + ' ha sido eliminado! <img src="' + SKULL_SYMBOL + '" class="result-image" alt="Skull">';
        resultDiv.style.color = '#ff4444';
        
        if (playerNames.length === 1) {
            spinButton.disabled = true;
            leverButton.style.pointerEvents = 'none';
            setTimeout(function() {
                resultDiv.innerHTML = '🎉 ¡' + playerNames[0] + ' ES EL GANADOR! <img src="' + WIN_SYMBOL + '" class="result-image" alt="Winner">';
                resultDiv.style.color = '#00ff00';
                spinButton.style.display = 'none';
                leverButton.style.display = 'none';
                resetButton.style.display = 'inline-block';
            }, 2500);
        } else {
            spinButton.disabled = false;
            leverButton.style.pointerEvents = 'auto';
            leverButton.style.opacity = '1';
        }

    } else if (targetSymbol === WIN_SYMBOL) {
        let lastEliminated = eliminateRandomPlayer(); 
        
        let winner = playerNames[0]; 
        
        resultDiv.innerHTML = '🎉 ¡' + winner + ' ES EL GANADOR! <img src="' + WIN_SYMBOL + '" class="result-image" alt="Winner">';
        resultDiv.style.color = '#00ff00';
        
        playerNames = [];
        let playersText = JSON.stringify(playerNames);
        localStorage.setItem('playerNames', playersText);

        spinButton.style.display = 'none';
        leverButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
    }
}


// --- Inicialización del Juego (lógica actualizada) ---
document.addEventListener('DOMContentLoaded', () => {
    if (playerNames.length < 2) {
        alert('No hay suficientes jugadores. Añade al menos 2.');
        window.location.href = '../Players/players.html';
        return;
    }

    // Eventos para la palanca y botones
    leverButton.addEventListener('click', spin); // La palanca activa el giro
    spinButton.addEventListener('click', spin);
    resetButton.addEventListener('click', restartGame);
    initReels();
    showEliminatedPlayers();
});

// Actualizar symbolHeight cuando se redimensiona la ventana
window.addEventListener('resize', function() {
    symbolHeight = getSymbolHeight();
});

// Limpiar el cementerio cuando se abandona la página
window.addEventListener('beforeunload', function() {
    localStorage.removeItem('eliminatedNames');
    console.log('Cementerio limpiado del localStorage');
});


