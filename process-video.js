const processVisual = document.querySelector('.machine-visual');
const motionButton = processVisual?.querySelector('.motion-toggle');

if (processVisual && motionButton) {
  const schematic = processVisual.querySelector('svg');
  const video = document.createElement('video');

  video.className = 'process-video';
  video.src = '/assets/videos/tppl-machinery-showcase.mp4';
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', 'Original TPPL manufacturing machinery video');

  schematic?.replaceWith(video);

  const syncVideoState = () => {
    const shouldPause = motionButton.textContent.trim().startsWith('Play');
    if (shouldPause) {
      video.pause();
      motionButton.textContent = 'Play video';
    } else {
      video.play().catch(() => {
        motionButton.textContent = 'Play video';
      });
      motionButton.textContent = 'Pause video';
    }
  };

  motionButton.textContent = matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'Play video'
    : 'Pause video';
  motionButton.setAttribute('aria-label', 'Pause or play the TPPL manufacturing video');
  motionButton.addEventListener('click', () => queueMicrotask(syncVideoState));
  video.addEventListener('click', () => motionButton.click());
  syncVideoState();
}
