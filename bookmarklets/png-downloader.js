(() => {
    // If already running, disable
    if (window.__imgConvertToggle) {
        document.removeEventListener("mouseover", window.__imgConvertHover, true);
        document.removeEventListener("mouseout", window.__imgConvertOut, true);
        document.removeEventListener("click", window.__imgConvertSelect, true);
        if (window.__imgConvertButton) document.body.removeChild(window.__imgConvertButton);
        delete window.__imgConvertToggle;
        delete window.__imgConvertHover;
        delete window.__imgConvertOut;
        delete window.__imgConvertSelect;
        delete window.__imgConvertButton;
        alert("Image converter disabled");
        return;
    }

    window.__imgConvertToggle = true;

    let selectedEl = null;

    // Create download button
    const btn = document.createElement("button");
    btn.textContent = "Download";
    btn.style.position = "absolute";
    btn.style.zIndex = 999999;
    btn.style.display = "none";
    btn.style.padding = "5px 10px";
    btn.style.background = "#222";
    btn.style.color = "#fff";
    btn.style.border = "1px solid #000";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);
    window.__imgConvertButton = btn;

    // Hover: outline
    window.__imgConvertHover = function(e) {
        if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
            e.target.style.outline = "3px solid red";
        }
    };

    window.__imgConvertOut = function(e) {
        if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
            e.target.style.outline = "";
        }
    };

    // Click: select element
    window.__imgConvertSelect = function(e) {
        if (e.target.tagName !== "IMG" && e.target.tagName !== "CANVAS") return;

        selectedEl = e.target;
        const rect = selectedEl.getBoundingClientRect();

        btn.style.top = `${rect.bottom + window.scrollY + 5}px`;
        btn.style.left = `${rect.left + window.scrollX}px`;
        btn.style.display = "block";
    };

    document.addEventListener("mouseover", window.__imgConvertHover, true);
    document.addEventListener("mouseout", window.__imgConvertOut, true);
    document.addEventListener("click", window.__imgConvertSelect, true);

    // Download button click
    btn.addEventListener("click", () => {
        if (!selectedEl) return;

        let canvas;
        if (selectedEl.tagName === "IMG") {
            canvas = document.createElement("canvas");
            canvas.width = selectedEl.width;
            canvas.height = selectedEl.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(selectedEl, 0, 0, selectedEl.width, selectedEl.height);
        } else if (selectedEl.tagName === "CANVAS") {
            canvas = selectedEl;
        }

        canvas.toBlob(blob => {
            if (!blob) {
                alert("Conversion failed");
                return;
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "image.png";
            a.click();
            URL.revokeObjectURL(a.href);
        }, "image/png");

        btn.style.display = "none";
        selectedEl.style.outline = "";
        selectedEl = null;
    });

    alert("Image converter enabled\nHover over an image or canvas, click to select, then click 'Download'");
})();