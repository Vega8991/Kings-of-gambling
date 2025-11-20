let SKULL_SYMBOL = 'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948687/skull_cgo9ps.png';
let WIN_SYMBOL = 'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/7win_xttuzb.png';

let spinButton = document.getElementById('spinButton');
let leverButton = document.getElementById('leverButton');
let resultDiv = document.getElementById('result');

async function spin() {
    spinButton.disabled = true;
    leverButton.style.pointerEvents = 'none';
    leverButton.style.opacity = '0.5';
    
    resultDiv.innerHTML = ''; 
    
    initReels();
    
    let targetSymbol = SKULL_SYMBOL;
    
    if (playerNames.length === 2) {
        targetSymbol = WIN_SYMBOL;
    }

    let spinPromises = [];
    for (let i = 0; i < 3; i++) {
        let delay = i * 300; 
        let reelDuration = 3000 + (i * 400);
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
        }, 50);
    });
    
    if (targetSymbol === SKULL_SYMBOL) {
        let removedName = eliminateRandomPlayer();
        playLoseSound();

        resultDiv.innerHTML = removedName + ' ha sido eliminado! <img src="' + SKULL_SYMBOL + '" class="result-image">';
        resultDiv.style.color = '#ff4444';
        
        if (playerNames.length === 1) {
            spinButton.disabled = true;
            leverButton.style.pointerEvents = 'none';
            setTimeout(function() {
                playWinnerSound();
                setTimeout(playCoinsSound, 700);

                resultDiv.innerHTML = playerNames[0] + ' ES EL GANADOR! <img src="' + WIN_SYMBOL + '" class="result-image" alt="Winner">';
                resultDiv.style.color = '#00ff00';
                spinButton.style.display = 'none';
                leverButton.style.display = 'none';
            }, 2500);
        } else {
            spinButton.disabled = false;
            leverButton.style.pointerEvents = 'auto';
            leverButton.style.opacity = '1';
        }

    } else if (targetSymbol === WIN_SYMBOL) {
        let lastEliminated = eliminateRandomPlayer();         
        let winner = playerNames[0]; 

        playWinnerSound();

        setTimeout(() => {
            playCoinsSound();

            const videoContainer = document.getElementById("winnerVideoContainer");
            const video = document.getElementById("winnerVideo");

            if (video && videoContainer) {
                // Poner vídeo FULLSCREEN
                video.src = "https://res.cloudinary.com/dcgb3jhf3/video/upload/v1/billetes_1_bzfhlv.mp4";

                videoContainer.style.display = "block";
                video.muted = false;

                // Intentar autoplay
                video.play().catch(() => {
                    // En caso de bloqueo, reintentar
                    setTimeout(() => video.play(), 300);
                });
            }

        }, 1000);




        resultDiv.innerHTML = '🎉 ¡' + winner + ' ES EL GANADOR! <img src="' + WIN_SYMBOL + '" class="result-image" alt="Winner">';
        resultDiv.style.color = '#00ff00';
            
        playerNames = [];
        let playersText = JSON.stringify(playerNames);
        localStorage.setItem('playerNames', playersText);

        spinButton.style.display = 'none';
        leverButton.style.display = 'none';

        setTimeout(() => {
            document.getElementById("playAgainBtn").style.display = "block";
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (playerNames.length < 2) {
        alert('No hay suficientes jugadores. Añade al menos 2.');
        window.location.href = '../Players/players.html';
        return;
    }

    if (leverButton) {
        leverButton.addEventListener('click', function () {
            unlockGameSounds();
            playLeverSound();
            spin();
        });
    }

    if (spinButton) {
        spinButton.addEventListener('click', function () {
            unlockGameSounds();
            spin();
        });
    }

    initReels();
    showEliminatedPlayers();
});
