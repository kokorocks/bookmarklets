(() => {
    // Get all elements inside the body
    const allElements = document.body.querySelectorAll('*');

    // Initialize original states if not already
    if (!window.__editableState) {
        window.__editableState = new Map(); // store original contentEditable values
    }

    allElements.forEach(element => {
        const textContent = element.textContent.trim();

        // Skip naturally editable elements
        const tag = element.tagName.toLowerCase();
        const isNaturallyEditable = (
            tag === 'input' ||
            tag === 'textarea' ||
            element.isContentEditable
        );

        if (textContent.length > 0 && element.children.length === 0 && !isNaturallyEditable) {
            // Store original contentEditable if not stored
            if (!window.__editableState.has(element)) {
                window.__editableState.set(element, element.contentEditable || "false");
            }

            // Mark element as processed
            if (!element.hasAttribute("editable")) element.setAttribute("editable", true);

            // Toggle editable
            element.contentEditable = !element.contentEditable || element.contentEditable === "false";
        }
    });
})();