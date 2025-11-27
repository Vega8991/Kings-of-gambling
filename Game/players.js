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

let eliminatedList = document.getElementById('eliminatedList');

function showEliminatedPlayers() {
    eliminatedList.innerHTML = '';
    
    for (let i = 0; i < eliminatedNames.length; i++) {
        let li = document.createElement('li');
        li.textContent = eliminatedNames[i];
        eliminatedList.appendChild(li);
    }
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

window.addEventListener('beforeunload', function() {
    localStorage.removeItem('eliminatedNames');
    console.log('Cementerio limpiado del localStorage');
});
