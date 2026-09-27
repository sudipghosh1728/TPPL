const processVisual = document.querySelector('.machine-visual');
const processMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (processVisual) {
  const processVideos = [
    ['/assets/videos/automated-laser-cutting-process.mp4', 'Real automated laser cutting process video'],
    ['/assets/videos/forming-process.mp4', 'Real industrial metal forming process video'],
    ['/assets/videos/fabrication-welding-process.mp4', 'Real metal fabrication and welding process video'],
    ['/assets/videos/cnc-machining-process.mp4', 'Real CNC machining process video'],
    ['/assets/videos/finishing-painting-process.mp4', 'Real industrial metal finishing and painting process video']
  ];
  const processPosters = ['cutting', 'bending', 'fabrication', 'machining', 'finishing'];
  const schematic = processVisual.querySelector('svg');
  const video = document.createElement('video');

  video.className = 'process-video';
  video.autoplay = !processMotion.matches;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.poster = `/assets/${processPosters[0]}.webp`;
  video.src = processVideos[0][0];
  video.setAttribute('aria-label', processVideos[0][1]);

  schematic?.replaceWith(video);

  const syncVideoState = () => {
    if (processMotion.matches || document.hidden) video.pause();
    else video.play().catch(() => {});
  };
  processMotion.addEventListener('change', syncVideoState);
  document.addEventListener('visibilitychange', syncVideoState);
  document.querySelectorAll('[data-process]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.process);
      const selected = processVideos[index];
      if (!selected || video.dataset.processVideo === String(index)) return;
      video.dataset.processVideo = String(index);
      video.poster = `/assets/${processPosters[index]}.webp`;
      video.src = selected[0];
      video.setAttribute('aria-label', selected[1]);
      video.load();
      syncVideoState();
    });
  });
  processVisual.querySelector('.console-bottom span:first-child').textContent = 'REAL PROCESS FOOTAGE';
  video.dataset.processVideo = '0';
  syncVideoState();
}
