let players = [];

function addNewPlayerLogic(playerName) {
    const name = playerName.trim();
    if(name === '') throw new Error('empty');
    if(players.includes(name)) throw new Error('exists')
    if(players.length >= 20) throw new Error('max');

    players.push(name);
    return players;
}

function checkStartButtonStatusLogic() {
    return players.length > 0;
}

function loadPlayersFromStorageLogic() {
    let savedPlayers = localStorage.getItem('kingOfGamblingPlayers');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
    }
}

function savePlayersToLocalStorageLogic() {
    let playersText = JSON.stringify(players);
    localStorage.setItem('kingOfGamblingPlayers', playersText);
}

function deletePlayer(indexToRemove) {
    players.splice(indexToRemove, 1);
    savePlayersToLocalStorage();
    showPlayersOnScreen();
    checkStartButtonStatus();
}
