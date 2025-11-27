let symbols = [
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/cherries_sz2jzc.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948684/7win_xttuzb.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948685/dices_oxbdb3.png',
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948685/lollipop_dxaqku.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948686/martini_a1n7zq.png', 
    'https://res.cloudinary.com/dsstkg5fn/image/upload/v1762948687/skull_cgo9ps.png'
];
let reelCount = 3;

function getSymbolHeight() {
    let screenWidth = window.innerWidth;
    if (screenWidth >= 375 && screenWidth <= 440) {
        return 82.5;
    } else if (screenWidth < 769) {
        return 82.5;
    } else {
        return 165;
    }
}

let symbolHeight = getSymbolHeight();
let spinDuration = 3000;

window.addEventListener('resize', function() {
    symbolHeight = getSymbolHeight();
    initReels();
});

function initReels() {
    for (let i = 1; i <= reelCount; i++) {
        const symbolsContainer = document.getElementById(`symbols${i}`);
        symbolsContainer.innerHTML = '';
        for (let repeat = 0; repeat < 4; repeat++) {
            symbols.forEach(imagePath => {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'symbol';
                const img = document.createElement('img');
                img.src = imagePath;
                img.className = 'symbol-image';
                symbolDiv.appendChild(img);
                symbolsContainer.appendChild(symbolDiv);
            });
        }
    }
}

function spinReel(reelNumber, duration, targetSymbol) {
    return new Promise(function(resolve) {
        const symbolsContainer = document.getElementById('symbols' + reelNumber);
        const allSymbols = symbolsContainer.querySelectorAll('.symbol');
        let targetIndex = -1;
        
        for (let i = 0; i < allSymbols.length; i++) {
            const img = allSymbols[i].querySelector('img');
            if (img && img.src) {
                if (img.src === targetSymbol || img.src.includes(targetSymbol.split('/').pop())) {
                    targetIndex = i;
                    break;
                }
            }
        }
        
        if (targetIndex === -1) {
            const secondLoopStart = symbols.length;
            const secondLoopEnd = symbols.length * 2;
            for (let i = secondLoopStart; i < secondLoopEnd && i < allSymbols.length; i++) {
                const img = allSymbols[i].querySelector('img');
                if (img) {
                    targetIndex = i;
                    img.src = targetSymbol;
                    break;
                }
            }
        }
        
        if (targetIndex === -1) {
            targetIndex = 0;
            if (allSymbols[targetIndex]) {
                const img = allSymbols[targetIndex].querySelector('img');
                if (img) {
                    img.src = targetSymbol;
                }
            }
        }
        
        const finalPosition = targetIndex * symbolHeight;
        const startTime = Date.now();
        const spinFastDuration = duration * 0.6;
        const slowDownDuration = duration * 0.4;
        const totalRotations = 8;
        const fastSpinDistance = symbolHeight * symbols.length * totalRotations;
        
        symbolsContainer.style.transition = 'none';
        symbolsContainer.style.transform = 'translateY(0)';
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const totalDuration = spinFastDuration + slowDownDuration;
            
            if (elapsed < spinFastDuration) {
                const progress = elapsed / spinFastDuration;
                const currentPosition = progress * fastSpinDistance;
                const wrappedPosition = currentPosition % (symbolHeight * symbols.length);
                symbolsContainer.style.transform = 'translateY(-' + wrappedPosition + 'px)';
                requestAnimationFrame(animate);
            } else if (elapsed < totalDuration) {
                const slowDownElapsed = elapsed - spinFastDuration;
                const slowDownProgress = slowDownElapsed / slowDownDuration;
                const easeOutCubic = 1 - Math.pow(1 - slowDownProgress, 3);
                const slowDownStart = fastSpinDistance % (symbolHeight * symbols.length);
                const additionalDistance = (symbolHeight * symbols.length * 2) + finalPosition;
                const currentPosition = slowDownStart + (easeOutCubic * additionalDistance);
                symbolsContainer.style.transform = 'translateY(-' + currentPosition + 'px)';
                requestAnimationFrame(animate);
            } else {
                const finalAbsolutePosition = (symbolHeight * symbols.length * 2) + finalPosition;
                symbolsContainer.style.transform = 'translateY(-' + finalAbsolutePosition + 'px)';
                
                symbolsContainer.style.visibility = 'visible';
                symbolsContainer.style.opacity = '1';
                
                resolve();
            }
        }
        animate();
    });
}