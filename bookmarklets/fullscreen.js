function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // If the document is not in fullscreen mode, request fullscreen for the whole page
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    // Otherwise, exit fullscreen mode
    document.exitFullscreen();
  }
}

toggleFullscreen()
