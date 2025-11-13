const {players, addNewPlayer, deletePlayer, savePlayersToLocalStorage, loadPlayersFromStorage, checkButtonStatus} = require('../players');

describe('Players module'), () => {
    beforeEach(() => {
        players.length = 0;
        localStorage.clear();
        document.body.innerHTML = `
            <input id="playerInput" />
            <div id=playersContainer"></div>
            <button id="startGameBtn"></button>
        `;
    });

    test('addNewPlayer adds a new player', ()=> {
        const input = document.getElementById('playerInput');
        input.value = 'Vega';

        addNewPlayer();
        
        expects(players).toContain('Vega');
    });
}