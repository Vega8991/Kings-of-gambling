let returnPageBtn = document.getElementById('returnPageBtn');

if (returnPageBtn) {
    returnPageBtn.addEventListener('click', function() {
        window.location.href = '../Players/players.html';
    });
}

let playAgainBtn = document.getElementById('playAgainBtn');

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function () {
        localStorage.removeItem('playerNames');
        localStorage.removeItem('eliminatedNames');
        window.location.href = '../Init/Init.html';
    });
}