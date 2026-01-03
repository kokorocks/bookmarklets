(() => {
  // Check if the preview is already running
  if (window.__microlinkHoverPreview) {
    // Stop it
    const { box, listeners } = window.__microlinkHoverPreview;
    listeners.forEach(({ event, handler }) => document.removeEventListener(event, handler));
    box.remove();
    delete window.__microlinkHoverPreview;
    return;
  }

  // Create preview box
  const box = document.createElement("div");
  box.style.cssText = `
    position: fixed;
    z-index: 999999;
    width: 280px;
    background: #111;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0,0,0,.5);
    font-family: system-ui, sans-serif;
    font-size: 13px;
    display: none;
    overflow: hidden;
    pointer-events: none;
  `;
  document.body.appendChild(box);

  let enabled = true;
  let controller;

  async function preview(url) {
    controller?.abort();
    controller = new AbortController();
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`, {
        signal: controller.signal
      });
      const { data } = await res.json();
      box.innerHTML = `
        ${data.image?.url ? `<img src="${data.image.url}" style="width:100%;display:block;height:120px;object-fit:cover;">` : ""}
        <div style="padding:8px">
          <div style="font-weight:600;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${data.title || url}</div>
          <div style="opacity:.8;height:36px;overflow:hidden;text-overflow:ellipsis;">${data.description || "No description available"}</div>
          <div style="margin-top:6px;opacity:.6;font-size:11px;">${new URL(url).hostname}</div>
        </div>
      `;
    } catch {
      box.innerHTML = "<div style='padding:8px'>Preview unavailable</div>";
    }
  }

  function positionBox(x, y) {
    const margin = 15;
    const boxRect = box.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    let left = x + margin;
    let top = y + margin;
    if (left + boxRect.width > winW) left = x - boxRect.width - margin;
    if (top + boxRect.height > winH) top = y - boxRect.height - margin;
    if (left < 0) left = margin;
    if (top < 0) top = margin;
    box.style.left = left + "px";
    box.style.top = top + "px";
  }

  function handleMouseOver(e) {
    if (!enabled) return;
    const a = e.target.closest("a[href]");
    if (!a || !a.href.startsWith("http")) return;
    box.style.display = "block";
    box.innerHTML = "<div style='padding:8px'>Loading preview…</div>";
    preview(a.href);
  }

  function handleMouseMove(e) {
    if (!enabled) return;
    if (box.style.display === "block") positionBox(e.clientX, e.clientY);
  }

  function handleMouseOut(e) {
    if (!enabled) return;
    if (e.target.closest("a")) {
      box.style.display = "none";
      controller?.abort();
    }
  }
  const listeners = [
    { event: "mouseover", handler: handleMouseOver },
    { event: "mousemove", handler: handleMouseMove },
    { event: "mouseout", handler: handleMouseOut },
  ];

  listeners.forEach(({ event, handler }) => document.addEventListener(event, handler));

  window.__microlinkHoverPreview = { box, listeners };
})();