const backgroundMusic = document.getElementById('backgroundMusic');
const volumeBtn = document.getElementById('volumeBtn');
let musicaActivada = true;

window.addEventListener('load', function() {
    backgroundMusic.play().then(() => {
        console.log('Música iniciada automáticamente');
        musicaActivada = true;
        volumeBtn.classList.remove('music-off');
    }).catch((error) => {
        console.log('La reproducción automática fue bloqueada. Haz clic en el botón para iniciar la música.');
        musicaActivada = false;
        volumeBtn.classList.add('music-off');
    });
});

volumeBtn.addEventListener('click', function() {
    musicaActivada = !musicaActivada;
    
    if (musicaActivada) {
        backgroundMusic.play();
        volumeBtn.classList.remove('music-off');
        console.log('Música activada');
    } else {
        backgroundMusic.pause();
        volumeBtn.classList.add('music-off');
        console.log('Música desactivada');
    }
});

document.querySelector('.credits-button').addEventListener('click', function() {
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

document.querySelector('.start-button').addEventListener('click', function() {
    window.location.href = 'players.html';
});
