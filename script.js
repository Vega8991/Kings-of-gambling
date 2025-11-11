// Control de volumen con un único botón
let musicaActivada = true;

const volumeBtn = document.getElementById('volumeBtn');

volumeBtn.addEventListener('click', function() {
    musicaActivada = !musicaActivada;
    
    if (musicaActivada) {
        volumeBtn.classList.remove('music-off');
        console.log('Música activada');
        // Aquí iría la lógica para activar la música
    } else {
        volumeBtn.classList.add('music-off');
        console.log('Música desactivada');
        // Aquí iría la lógica para desactivar la música
    }
});

// SweetAlert para créditos
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

// Redirige a la pagina esta de players
document.querySelector('.start-button').addEventListener('click', function() {
    window.location.href = 'players.html';
});
