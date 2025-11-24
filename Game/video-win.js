let winVideoContainer = document.getElementById("winVideoContainer");
let winVideo = document.getElementById("winVideo");

function showWinVideo() {
    if (!winVideoContainer || !winVideo) return;

    // Ocultar el vídeo antes de usarlo
    winVideo.pause();
    winVideo.classList.add("hidden");

    // MOSTRAR contenedor
    winVideoContainer.classList.remove("hidden");

    // Reiniciar vídeo
    winVideo.currentTime = 0;

    // Esperar un pequeño retardo para asegurarse de que el navegador lo pinta oculto antes de reproducir
    setTimeout(() => {
        winVideo.classList.remove("hidden");
        winVideo.play();
    }, 50);

    // Al terminar, ocultar todo
    winVideo.addEventListener("ended", () => {
        winVideo.pause();
        winVideoContainer.classList.add("hidden");
        winVideo.classList.add("hidden");
    });
}
