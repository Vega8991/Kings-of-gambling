const backgroundMusic = document.getElementById('backgroundMusic');
const volumeBtn = document.getElementById('volumeBtn');

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
            // Intentar reproducir en el primer click
            document.addEventListener('click', function playOnFirstClick() {
                backgroundMusic.play();
                document.removeEventListener('click', playOnFirstClick);
            }, { once: true });
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
document.querySelector('.instructions-button').addEventListener('click', function () {
    Swal.fire({
        title: 'Instructions',
        html: `
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start; margin-top: 20px; text-align: left;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Game objective:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">Be the last player standing. The slot machine will eliminate players one by one until there is only one winner left.</span>
                </p>
                <hr style="width: 100%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Adding players:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">1. Click on the START button<br>
                    2. Enter the names of the players (min 2, max 20)<br>
                    3. Press start when you are ready</span>
                </p>
                <hr style="width: 100%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">How to play:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">1. Click on the slot machine lever<br>
                    2. The reels will spin and show symbols<br>
                    3. If skulls appear, a player will be eliminated<br>
                    4. Eliminated players will appear in the cementery<br>
                    5. Continue playing until only one winner remains</span>
                </p>
                <hr style="width: 100%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Controls:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">Use the volume button in the bottom right corner to turn the background music on or off.</span>
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
    });
});

document.querySelector('.credits-button').addEventListener('click', function () {
    Swal.fire({
        title: 'Desarrolladores',
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
    });
});

document.querySelector('.start-button').addEventListener('click', function () {
    window.location.href = '../Players/players.html';
});
