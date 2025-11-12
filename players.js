let players = [];

window.addEventListener('DOMContentLoaded', function() {
    loadPlayersFromStorage();
    renderPlayers();
    updateStartButtonState();
});

const playerInput = document.getElementById('playerInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersContainer = document.getElementById('playersContainer');
const startGameBtn = document.getElementById('startGameBtn');
const backBtn = document.getElementById('backBtn');

playerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

addPlayerBtn.addEventListener('click', addPlayer);

function addPlayer() {
    const playerName = playerInput.value.trim();
    
    if (playerName === '') {
        alert('Por favor, ingresa un nombre');
        return;
    }
    
    if (players.includes(playerName)) {
        alert('Este jugador ya ha sido agregado');
        return;
    }
    
    if (players.length >= 20) {
        alert('Máximo 20 jugadores permitidos');
        return;
    }
    
    players.push(playerName);
    
    savePlayersToStorage();
    
    playerInput.value = '';
    
    renderPlayers();
    updateStartButtonState();
    
    playerInput.focus();
}

function removePlayer(index) {
    players.splice(index, 1);
    savePlayersToStorage();
    renderPlayers();
    updateStartButtonState();
}

function renderPlayers() {
    playersContainer.innerHTML = '';
    
    if (players.length === 0) {
        playersContainer.innerHTML = '<div class="empty-message">No hay jugadores añadidos</div>';
        return;
    }
    
    players.forEach((player, index) => {
        const playerTag = document.createElement('div');
        playerTag.className = 'player-tag';
        
        const playerName = document.createElement('span');
        playerName.className = 'player-name';
        playerName.textContent = player;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-button';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => removePlayer(index);
        
        playerTag.appendChild(playerName);
        playerTag.appendChild(removeBtn);
        playersContainer.appendChild(playerTag);
    });
}

function savePlayersToStorage() {
    localStorage.setItem('kingOfGamblingPlayers', JSON.stringify(players));
}

function loadPlayersFromStorage() {
    const savedPlayers = localStorage.getItem('kingOfGamblingPlayers');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
    }
}

function updateStartButtonState() {
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
    
    // Guardar jugadores en localStorage y redirigir al juego
    savePlayersToStorage();
    localStorage.setItem('playerNames', JSON.stringify(players));
    console.log('Iniciando juego con los siguientes jugadores:', players);
    window.location.href = 'game.html';
});

backBtn.addEventListener('click', () => {
    window.location.href = 'Init.html';
})