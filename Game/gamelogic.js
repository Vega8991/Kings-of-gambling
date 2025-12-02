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
                const isMobile = window.innerWidth <= 768;
                video.src = isMobile 
                    ? "https://res.cloudinary.com/dcgb3jhf3/video/upload/v1764243478/Secuencia_02_glbqkg.webm"
                    : "https://res.cloudinary.com/dcgb3jhf3/video/upload/v1763980171/video_final_billetes_Hecho_con_Clipchamp_tdrvpm.webm";
                videoContainer.style.display = "block";
                video.muted = false;
                
                video.onended = function() {
                    videoContainer.style.display = "none";
                    const returnBtn = document.getElementById('returnPageBtn');
                    if (returnBtn) returnBtn.style.display = 'none';
                    
                    const isMobile = window.innerWidth <= 768;
                    Swal.fire({
                        title: 'WINNER',
                        html: '<div style="font-size: ' + (isMobile ? '20px' : '28px') + '; font-weight: bold; color: #ff006e;">' + winner + '</div><div style="margin-top: 10px; font-size: ' + (isMobile ? '14px' : '18px') + ';">Has won the game!</div>',
                        imageUrl: 'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/7win_xttuzb.png',
                        imageWidth: isMobile ? 80 : 150,
                        imageHeight: isMobile ? 80 : 150,
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Play Again',
                        denyButtonText: 'Lobby',
                        cancelButtonText: 'Credits',
                        confirmButtonColor: '#ff006e',
                        denyButtonColor: '#444',
                        cancelButtonColor: '#666',
                        background: 'rgba(20, 20, 20, 0.95)',
                        color: '#fff',
                        backdrop: 'rgba(0,0,0,0.8)',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        width: isMobile ? '90%' : '32em',
                        padding: isMobile ? '1.5em' : '3em',
                        customClass: {
                            popup: isMobile ? 'swal2-mobile' : '',
                            title: isMobile ? 'swal2-title-mobile' : ''
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '../Players/players.html';
                        } else if (result.isDenied) {
                            window.location.href = '../Init/Init.html';
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire({
                                title: 'Developers',
                                html: `
                                    <div style="display: flex; flex-direction: column; gap: 15px; align-items: center; margin-top: 20px;">
                                        <p style="color: white; font-size: 18px; line-height: 1.6;">
                                            <strong style="color: #ff006e;">Scrum Master</strong><br>
                                            <span style="font-size: 14px; color: #ccc;">Manuel Vega Viñuelas</span>
                                        </p>
                                        <hr style="width: 80%; border: 1px solid #ff006e; opacity: 0.3;">
                                        <p style="color: white; font-size: 18px; line-height: 1.6;">
                                            <strong style="color: #ff006e;">Product Manager</strong><br>
                                            <span style="font-size: 14px; color: #ccc;">George Alexandru Nechita</span>
                                        </p>
                                        <hr style="width: 80%; border: 1px solid #ff006e; opacity: 0.3;">
                                        <p style="color: white; font-size: 18px; line-height: 1.6;">
                                            <strong style="color: #ff006e;">Desarrolladores</strong><br>
                                            <span style="font-size: 14px; color: #ccc;">David Beneito, Guillermo José Suárez, Antonio Ginés</span>
                                        </p>
                                    </div>
                                `,
                                showConfirmButton: false,
                                showCancelButton: false,
                                showCloseButton: true,
                                allowOutsideClick: true,
                                background: 'rgba(20, 20, 20, 0.95)',
                                customClass: {
                                    popup: 'swal2-popup',
                                    title: 'swal2-title',
                                    closeButton: 'swal2-close'
                                }
                            }).then(() => {
                                window.location.href = '../Init/Init.html';
                            });
                        }
                    });
                };
                
                video.play().catch(() => {
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
