// Array para almacenar los jugadores
let players = [];

// Cargar jugadores del localStorage al iniciar
window.addEventListener('DOMContentLoaded', function() {
    loadPlayersFromStorage();
    renderPlayers();
    updateStartButtonState();
});

// Elementos del DOM
const playerInput = document.getElementById('playerInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersContainer = document.getElementById('playersContainer');
const startGameBtn = document.getElementById('startGameBtn');

// Agregar jugador al presionar Enter
playerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addPlayer();
    }
});

// Agregar jugador al hacer clic en el botón
addPlayerBtn.addEventListener('click', addPlayer);

// Función para agregar un jugador
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
    
    if (players.length >= 10) {
        alert('Máximo 10 jugadores permitidos');
        return;
    }
    
    // Agregar jugador al array
    players.push(playerName);
    
    // Guardar en localStorage
    savePlayersToStorage();
    
    // Limpiar input
    playerInput.value = '';
    
    // Actualizar la vista
    renderPlayers();
    updateStartButtonState();
    
    // Hacer focus en el input
    playerInput.focus();
}

// Función para eliminar un jugador
function removePlayer(index) {
    players.splice(index, 1);
    savePlayersToStorage();
    renderPlayers();
    updateStartButtonState();
}

// Función para renderizar los jugadores en pantalla
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

// Función para guardar jugadores en localStorage
function savePlayersToStorage() {
    localStorage.setItem('kingOfGamblingPlayers', JSON.stringify(players));
}

// Función para cargar jugadores desde localStorage
function loadPlayersFromStorage() {
    const savedPlayers = localStorage.getItem('kingOfGamblingPlayers');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
    }
}

// Función para actualizar el estado del botón Start
function updateStartButtonState() {
    if (players.length === 0) {
        startGameBtn.disabled = true;
    } else {
        startGameBtn.disabled = false;
    }
}

// Evento para el botón Start Game
startGameBtn.addEventListener('click', function() {
    if (players.length === 0) {
        alert('Debes agregar al menos un jugador para comenzar');
        return;
    }
    
    // Aquí puedes redirigir a la página del juego
    console.log('Iniciando juego con los siguientes jugadores:', players);
    // window.location.href = 'game.html'; // Descomentar cuando tengas la página del juego
});
