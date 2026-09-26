const processVisual = document.querySelector('.machine-visual');
const motionButton = processVisual?.querySelector('.motion-toggle');

if (processVisual && motionButton) {
  const processVideos = [
    ['/assets/videos/automated-laser-cutting-process.mp4', 'Real automated laser cutting process video'],
    ['/assets/videos/forming-process.mp4', 'Real industrial metal forming process video'],
    ['/assets/videos/fabrication-welding-process.mp4', 'Real metal fabrication and welding process video'],
    ['/assets/videos/cnc-machining-process.mp4', 'Real CNC machining process video'],
    ['/assets/videos/finishing-painting-process.mp4', 'Real industrial metal finishing and painting process video']
  ];
  const schematic = processVisual.querySelector('svg');
  const video = document.createElement('video');

  video.className = 'process-video';
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = processVideos[0][0];
  video.setAttribute('aria-label', processVideos[0][1]);

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
  motionButton.setAttribute('aria-label', 'Pause or play the CNC laser cutting process video');
  motionButton.addEventListener('click', () => queueMicrotask(syncVideoState));
  video.addEventListener('click', () => motionButton.click());
  document.querySelectorAll('[data-process]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.process);
      const selected = processVideos[index];
      if (!selected || video.dataset.processVideo === String(index)) return;
      const wasPaused = motionButton.textContent.trim().startsWith('Play');
      video.dataset.processVideo = String(index);
      video.src = selected[0];
      video.setAttribute('aria-label', selected[1]);
      motionButton.setAttribute('aria-label', `Pause or play the ${selected[1].toLowerCase()}`);
      video.load();
      if (!wasPaused) video.play().catch(() => { motionButton.textContent = 'Play video'; });
    });
  });
  processVisual.querySelector('.console-bottom span:first-child').textContent = 'REAL PROCESS FOOTAGE';
  video.dataset.processVideo = '0';
  syncVideoState();
}
