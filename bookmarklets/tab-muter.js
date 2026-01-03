(() => {
  const STATE_KEY = "__TAB_MUTED__";

  const isMuted = window[STATE_KEY] === true;

  const apply = (el, mute) => {
    if (!el.__origVolume) {
      el.__origVolume = el.volume;
    }
    el.muted = mute;
    el.volume = mute ? 0 : el.__origVolume ?? 1;
  };

  // Toggle state
  window[STATE_KEY] = !isMuted;

  // Apply to existing media
  document.querySelectorAll("audio, video").forEach(el =>
    apply(el, window[STATE_KEY])
  );

  // Mutation observer (only active while muted)
  if (window[STATE_KEY]) {
    if (!window.__mediaObserver) {
      window.__mediaObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node instanceof HTMLMediaElement) {
              apply(node, true);
            }
            if (node.querySelectorAll) {
              node.querySelectorAll("audio, video").forEach(el =>
                apply(el, true)
              );
            }
          }
        }
      });

      window.__mediaObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  } else {
    // Unmuting → disconnect observer
    window.__mediaObserver?.disconnect();
    window.__mediaObserver = null;
  }

  console.log(window[STATE_KEY] ? "🔇 Tab muted" : "🔊 Tab unmuted");
})();