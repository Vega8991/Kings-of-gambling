let players = [];

let playerInput = document.getElementById('playerInput');
let addPlayerBtn = document.getElementById('addPlayerBtn');
let playersContainer = document.getElementById('playersContainer');
let startGameBtn = document.getElementById('startGameBtn');
let backBtn = document.getElementById('backBtn');
let returnPageBtn = document.getElementById('returnPageBtn');

let backgroundMusic = document.getElementById('backgroundMusic');
let volumeBtn = document.getElementById('volumeBtn');

let musicEnabled = false;

let savedState = localStorage.getItem('musicaActivada');

if (savedState === null) {
    musicEnabled = true;
} else {
    if (savedState === 'true') {
        musicEnabled = true;
    } else {
        musicEnabled = false;
    }
}

function updateVolumeButton() {
    if (volumeBtn) {
        if (musicEnabled === false) {
            volumeBtn.classList.add('music-off');
        } else {
            volumeBtn.classList.remove('music-off');
        }
    }
}

function tryPlayMusic() {
    if (musicEnabled === true && backgroundMusic) {
        // Restaurar tiempo guardado
        let savedTime = localStorage.getItem('musicCurrentTime');
        if (savedTime) {
            backgroundMusic.currentTime = parseFloat(savedTime);
        }
        
        backgroundMusic.play().then(function() {
            console.log('Music playing');
        }).catch(function(error) {
            console.log('Autoplay blocked, waiting for user interaction');
            
            function playOnClick() {
                backgroundMusic.play().catch(function() {
                });
                document.removeEventListener('click', playOnClick);
            }
            
            document.addEventListener('click', playOnClick);
        });
    }
}

// Guardar tiempo cada 1 segundo mientras se reproduce
if (backgroundMusic) {
    backgroundMusic.addEventListener('timeupdate', function() {
        if (!backgroundMusic.paused) {
            localStorage.setItem('musicCurrentTime', backgroundMusic.currentTime);
        }
    });
}

// Guardar estado antes de salir de la página
window.addEventListener('beforeunload', function() {
    if (backgroundMusic && !backgroundMusic.paused) {
        localStorage.setItem('musicCurrentTime', backgroundMusic.currentTime);
        localStorage.setItem('musicaActivada', 'true');
    }
});

window.addEventListener('load', function() {
    updateVolumeButton();
    tryPlayMusic();
    
    // Configurar volumen inicial
    let volumeSlider = document.getElementById('volumeSlider');
    let savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
        volumeSlider.value = savedVolume;
        if (backgroundMusic) {
            backgroundMusic.volume = savedVolume / 100;
        }
    } else {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.5;
        }
    }
});

if (volumeBtn) {
    volumeBtn.addEventListener('click', function() {
        if (musicEnabled === true) {
            musicEnabled = false;
            if (backgroundMusic) {
                backgroundMusic.pause();
                localStorage.setItem('musicCurrentTime', backgroundMusic.currentTime);
            }
        } else {
            musicEnabled = true;
            if (backgroundMusic) {
                // Restaurar el tiempo antes de reproducir
                let savedTime = localStorage.getItem('musicCurrentTime');
                if (savedTime) {
                    backgroundMusic.currentTime = parseFloat(savedTime);
                }
                backgroundMusic.play().catch(function() {
                });
            }
        }
        
        localStorage.setItem('musicaActivada', musicEnabled);
        
        updateVolumeButton();
    });
}

// Control de la barra de volumen
let volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider && backgroundMusic) {
    volumeSlider.addEventListener('input', function() {
        let volume = this.value;
        backgroundMusic.volume = volume / 100;
        localStorage.setItem('musicVolume', volume);
    });
}

window.addEventListener('DOMContentLoaded', function() {
    loadPlayersFromStorage();
    showPlayersOnScreen();
    checkStartButtonStatus();
});

playerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNewPlayer();
    }
});

addPlayerBtn.addEventListener('click', function() {
    addNewPlayer();
});

function addNewPlayer() {
    let playerName = playerInput.value.trim();
    
    if (playerName === '') {
        alert('Por favor, ingresa un nombre');
        return;
    }
    
    let playerExists = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i] === playerName) {
            playerExists = true;
            break;
        }
    }
    
    if (playerExists === true) {
        alert('Este jugador ya ha sido agregado');
        return;
    }
    
    if (players.length >= 20) {
        alert('Máximo 20 jugadores permitidos');
        return;
    }
    
    players.push(playerName);
    
    savePlayersToLocalStorage();
    
    playerInput.value = '';
    
    showPlayersOnScreen();
    checkStartButtonStatus();
    
    playerInput.focus();
}

function deletePlayer(indexToRemove) {
    players.splice(indexToRemove, 1);
    savePlayersToLocalStorage();
    showPlayersOnScreen();
    checkStartButtonStatus();
}

function showPlayersOnScreen() {
    playersContainer.innerHTML = '';
    
    if (players.length === 0) {
        playersContainer.innerHTML = '<div class="empty-message">No hay jugadores añadidos</div>';
        return;
    }
    
    for (let i = 0; i < players.length; i++) {
        let playerTag = document.createElement('div');
        playerTag.className = 'player-tag';
        
        let playerName = document.createElement('span');
        playerName.className = 'player-name';
        playerName.textContent = players[i];
        
        let removeBtn = document.createElement('button');
        removeBtn.className = 'remove-button';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('data-index', i);
        removeBtn.onclick = function() {
            let index = parseInt(this.getAttribute('data-index'));
            deletePlayer(index);
        };
        
        playerTag.appendChild(playerName);
        playerTag.appendChild(removeBtn);
        playersContainer.appendChild(playerTag);
    }
}

function savePlayersToLocalStorage() {
    let playersText = JSON.stringify(players);
    localStorage.setItem('kingOfGamblingPlayers', playersText);
}

function loadPlayersFromStorage() {
    let savedPlayers = localStorage.getItem('kingOfGamblingPlayers');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
    }
}

function checkStartButtonStatus() {
    if (players.length === 0) {
        startGameBtn.disabled = true;
    } else {
        startGameBtn.disabled = false;
    }
}

startGameBtn.addEventListener('click', function() {
    if (players.length === 0) {
        alert('Debes agregar al menos un jugador para comenzar');
        return;
    }
    
    savePlayersToLocalStorage();
    let playersText = JSON.stringify(players);
    localStorage.setItem('playerNames', playersText);
    console.log('Iniciando juego con los siguientes jugadores:', players);
    window.location.href = '../Game/game.html';
});

backBtn.addEventListener('click', function() {
    window.location.href = '../Init/Init.html';
});

returnPageBtn.addEventListener('click', function() {
    window.location.href = '../Init/Init.html';
});

window.tryPlayMusic = tryPlayMusic;