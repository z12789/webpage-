document.addEventListener('DOMContentLoaded', function() {
    const audio1 = document.getElementById('audio1');
    const audio2 = document.getElementById('audio2');
    const audioControl = document.getElementById('audioControl');
    
    let isPlaying = false;
    let hoverStartTime = {};

    function playAudio() {
        audio1.play().catch(e => console.log("Audio 1 play failed:", e));
        audio2.play().catch(e => console.log("Audio 2 play failed:", e));
        isPlaying = true;
        updateAudioControlIcon();
    }

    function pauseAudio() {
        audio1.pause();
        audio2.pause();
        isPlaying = false;
        updateAudioControlIcon();
    }

    function updateAudioControlIcon() {
        if (isPlaying) {
            audioControl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';
            audioControl.setAttribute('aria-label', 'Pause background audio');
        } else {
            audioControl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            audioControl.setAttribute('aria-label', 'Play background audio');
        }
    }

    playAudio();

    document.addEventListener('click', function() {
        if (!isPlaying) {
            playAudio();
        }
    }, { once: true });


    audioControl.addEventListener('click', function() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    window.handleHover = function(audioId) {
        const audio = document.getElementById(audioId);
        hoverStartTime[audioId] = audio.currentTime;
        audio.muted = true;
    };

    window.handleHoverEnd = function(audioId) {
        const audio = document.getElementById(audioId);
        const hoverDuration = audio.currentTime - hoverStartTime[audioId];
        audio.currentTime += hoverDuration;
        audio.muted = false;
    };

    // Existing image scattering code
    scatterImages();
    window.addEventListener('resize', scatterImages);
});

function playAudio() {
    audio1.play().catch(e => console.log("Audio play failed:", e));
    audio2.play().catch(e => console.log("Audio play failed:", e));
    isPlaying = true;
    audioControl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    audioControl.setAttribute('aria-label', 'Pause background audio');
}

function scatterImages() {
    const container = document.getElementById('imageContainer');
    if (!container) {
        console.error('Container not found');
        return;
    }
    container.innerHTML = ''; 
    const containerRect = container.getBoundingClientRect();

    if (typeof imageUrls === 'undefined' || !Array.isArray(imageUrls)) {
        console.error('imageUrls is not defined or is not an array');
        return;
    }

    const imageSize = 200;

    imageUrls.forEach((imageUrl, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Draggable scattered image ${index + 1}`;
        img.className = 'scattered-image';

        const maxX = containerRect.width - imageSize;
        const maxY = containerRect.height - imageSize;

        const x = Math.max(0, Math.min(Math.random() * maxX, maxX));
        const y = Math.max(0, Math.min(Math.random() * maxY, maxY));

        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;

        wrapper.appendChild(img);
        wrapper.addEventListener('mousedown', startDragging);
        wrapper.addEventListener('touchstart', startDragging);

        container.appendChild(wrapper);
    });
}

function startDragging(e) {
    e.preventDefault();
    const wrapper = e.currentTarget;
    const container = document.getElementById('imageContainer');
    const containerRect = container.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const startX = e.clientX || e.touches[0].clientX;
    const startY = e.clientY || e.touches[0].clientY;
    const startLeft = wrapper.offsetLeft;
    const startTop = wrapper.offsetTop;

    function dragMove(e) {
        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;
        let newLeft = startLeft + (currentX - startX);
        let newTop = startTop + (currentY - startY);

        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - wrapperRect.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - wrapperRect.height));

        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
    }

    function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEnd);
    }

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('touchend', dragEnd);
}

