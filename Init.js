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
        });
    }
}

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
        title: '📋 Instrucciones',
        html: `
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start; margin-top: 20px; text-align: left;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Objetivo del Juego:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">Ser el último jugador en pie. La máquina tragaperras eliminará jugadores uno por uno hasta que quede un ganador.</span>
                </p>
                <hr style="width: 100%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Añadir Jugadores:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">1. Haz clic en el botón "START"<br>
                    2. Introduce los nombres de los jugadores (mínimo 2, máximo 20)<br>
                    3. Pulsa "Comenzar Juego" cuando estés listo</span>
                </p>
                <hr style="width: 100%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Cómo Jugar:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">1. Haz clic en la palanca de la máquina tragaperras<br>
                    2. Los rodillos girarán y mostrarán símbolos<br>
                    3. Si aparecen calaveras, un jugador será eliminado<br>
                    4. Los jugadores eliminados aparecerán en el "Cementerio"<br>
                    5. Continúa hasta que quede un solo ganador</span>
                </p>
                <hr style="width: 100%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 16px; line-height: 1.8;">
                    <strong style="color: #ff006e;">Controles:</strong><br>
                    <span style="font-size: 14px; color: #ccc;">Usa el botón de volumen en la esquina inferior derecha para activar/desactivar la música de fondo.</span>
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
    window.location.href = 'players.html';
});
