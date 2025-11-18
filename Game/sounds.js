let gameMusic = document.getElementById('gameMusic');
let volumeBtn = document.getElementById('volumeBtn');
let musicEnabled = false;

let savedMusicState = localStorage.getItem('musicaActivada');
if (savedMusicState === null || savedMusicState === 'true') {
    musicEnabled = true;
} else {
    musicEnabled = false;
}

if (gameMusic) {
    let savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
        gameMusic.volume = savedVolume / 100;
        let volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = savedVolume;
        }
    } else {
        gameMusic.volume = 0.5;
    }
    
    if (musicEnabled === true) {
        let savedTime = localStorage.getItem('musicCurrentTime');
        if (savedTime) {
            gameMusic.currentTime = parseFloat(savedTime);
        }
        
        gameMusic.play().then(function() {
            console.log('Music playing');
        }).catch(function() {
            console.log('Autoplay blocked');
            musicEnabled = false;
            volumeBtn.classList.add('music-off');
        });
    } else {
        volumeBtn.classList.add('music-off');
    }
    
    gameMusic.addEventListener('timeupdate', function() {
        if (!gameMusic.paused) {
            localStorage.setItem('musicCurrentTime', gameMusic.currentTime);
        }
    });
}

window.addEventListener('beforeunload', function() {
    if (gameMusic && !gameMusic.paused) {
        localStorage.setItem('musicCurrentTime', gameMusic.currentTime);
        localStorage.setItem('musicaActivada', 'true');
    }
});

if (volumeBtn) {
    volumeBtn.addEventListener('click', function() {
        if (musicEnabled === true) {
            musicEnabled = false;
            gameMusic.pause();
            localStorage.setItem('musicCurrentTime', gameMusic.currentTime);
            volumeBtn.classList.add('music-off');
            console.log('Game music disabled');
        } else {
            musicEnabled = true;
            let savedTime = localStorage.getItem('musicCurrentTime');
            if (savedTime) {
                gameMusic.currentTime = parseFloat(savedTime);
            }
            gameMusic.play();
            volumeBtn.classList.remove('music-off');
            console.log('Game music enabled');
        }
        
        localStorage.setItem('musicaActivada', musicEnabled);
    });
}

let volumeSlider = document.getElementById('volumeSlider');
if (volumeSlider && gameMusic) {
    volumeSlider.addEventListener('input', function() {
        let volume = this.value;
        gameMusic.volume = volume / 100;
        localStorage.setItem('musicVolume', volume);
    });
}

let audioUnlocked = false;

function unlockGameSounds() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    const ids = ['winnerSound', 'coinsSound', 'loseSound'];
    ids.forEach(id => {
        const a = document.getElementById(id);
        if (!a) return;

        a.muted = true;
        a.volume = 1;
        a.currentTime = 0;
        a.play().then(() => {
            a.pause();
            a.muted = false;
            a.currentTime = 0;
            console.log('Desbloqueado audio:', id);
        }).catch(err => {
            console.log('No se pudo desbloquear audio', id, err);
        });
    });
}

function playLeverSound() {
    const sound = document.getElementById('leverSound');
    if (!sound) return;

    sound.currentTime = 0;
    sound.volume = 1;
    sound.play().catch(err => {
        console.log('Error al reproducir leverSound:', err);
    });
}

function playLoseSound() {
    const sound = document.getElementById('loseSound');
    if (!sound) return;

    sound.currentTime = 0;
    sound.volume = 1;
    sound.play().catch(err => {
        console.log('Error al reproducir loseSound:', err);
    });
}

function playWinnerSound() {
    const sound = document.getElementById('winnerSound');
    if (!sound) return;

    sound.muted = false;
    sound.currentTime = 0;
    sound.volume = 1;
    console.log('Reproduciendo winnerSound');
    sound.play().catch(err => {
        console.log('Error al reproducir winnerSound:', err);
    });
}

function playCoinsSound() {
    const sound = document.getElementById('coinsSound');
    if (!sound) return;

    sound.currentTime = 0;
    sound.volume = 1;
    console.log('Reproduciendo coinsSound');
    sound.play().catch(err => {
        console.log('Error al reproducir coinsSound:', err);
    });
}