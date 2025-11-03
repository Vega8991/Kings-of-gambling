let musicaActivada = false;

document.getElementById('volumeBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Configuración de Música',
        html: `
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: center;">
                <p style="color: white; font-size: 18px; margin-bottom: 10px;">
                    Selecciona una opción:
                </p>
                <button id="activarMusica" class="custom-music-button"></button>
                <button id="desactivarMusica" class="custom-music-button"></button>
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
        },
        didOpen: () => {
            document.getElementById('activarMusica').addEventListener('click', function() {
                musicaActivada = true;
                Swal.fire({
                    title: '¡Música Activada!',
                    text: 'La música de fondo está ahora activa',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: 'rgba(20, 20, 20, 0.95)',
                    customClass: {
                        popup: 'swal2-popup',
                        title: 'swal2-title'
                    }
                });
                // Aqui le metemos la logica pa agregar la musica
                console.log('Música activada');
            });

            document.getElementById('desactivarMusica').addEventListener('click', function() {
                musicaActivada = false;
                Swal.fire({
                    title: 'Música Desactivada',
                    text: 'La música de fondo ha sido desactivada',
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false,
                    background: 'rgba(20, 20, 20, 0.95)',
                    customClass: {
                        popup: 'swal2-popup',
                        title: 'swal2-title'
                    }
                });
                // Aqui pues desactiva la musica
                console.log('Música desactivada');
            });
        }
    });
});

// SweetAlert para créditos
document.querySelector('.credits-button').addEventListener('click', function() {
    Swal.fire({
        title: 'Desarrolladores',
        html: `
            <div style="display: flex; flex-direction: column; gap: 15px; align-items: center; margin-top: 20px;">
                <p style="color: white; font-size: 18px; line-height: 1.6;">
                    <strong style="color: #ff006e;">Scrum Master</strong><br>
                    <span style="font-size: 14px; color: #ccc;">Manuel Vega</span>
                </p>
                <hr style="width: 80%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 18px; line-height: 1.6;">
                    <strong style="color: #ff006e;">Product Manager</strong><br>
                    <span style="font-size: 14px; color: #ccc;">George Alexandru Nechita</span>
                </p>
                <hr style="width: 80%; border: 1px solid #ff006e; opacity: 0.3;">
                <p style="color: white; font-size: 18px; line-height: 1.6;">
                    <strong style="color: #ff006e;">Desarrolladores</strong><br>
                    <span style="font-size: 14px; color: #ccc;">David Beneito, Guillermo Díaz, Antonio Ginés</span>
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

// Redirigir a la página de selección de jugadores al hacer clic en Start
document.querySelector('.start-button').addEventListener('click', function() {
    window.location.href = 'players.html';
});
