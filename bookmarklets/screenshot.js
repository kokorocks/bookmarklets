(function(){
    const apiUrl = 'https://api.microlink.io/?url=' + encodeURIComponent(window.location.href) + '&screenshot=true&meta=false&fullPage=true';
    console.log(apiUrl)
    fetch(apiUrl)
        .then(res => res.json())
        .then(json => {
            if(json.status !== 'success' || !json.data.screenshot) {
                console.error('Microlink screenshot failed', json);
                return;
            }

            const imgUrl = json.data.screenshot.url;

            // Create menu container
            const menu = document.createElement('div');
            menu.style.position = 'fixed';
            menu.style.top = '20px';
            menu.style.right = '20px';
            menu.style.background = 'rgba(0,0,0,0.8)';
            menu.style.color = '#fff';
            menu.style.padding = '10px';
            menu.style.borderRadius = '8px';
            menu.style.zIndex = '9999';
            menu.style.fontFamily = 'sans-serif';
            menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            menu.style.display = 'flex';
            menu.style.flexDirection = 'column';
            menu.style.gap = '8px';

            // Button: Show image
            const showBtn = document.createElement('button');
            showBtn.innerText = 'Show Image';
            showBtn.style.padding = '5px';
            showBtn.style.cursor = 'pointer';
            showBtn.onclick = () => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.style.position = 'fixed';
                img.style.top = '60px';
                img.style.right = '20px';
                img.style.width = '400px';
                img.style.zIndex = '9998';
                img.style.border = '3px solid red';
                document.body.appendChild(img);
            };

            // Button: Download
            const downloadBtn = document.createElement('button');
            downloadBtn.innerText = 'Download';
            downloadBtn.style.padding = '5px';
            downloadBtn.style.cursor = 'pointer';
downloadBtn.onclick = async () => {
    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'screenshot.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl); // clean up
    } catch (err) {
        console.error('Download failed', err);
    }
};


            // Button: Open in new tab
            const openBtn = document.createElement('button');
            openBtn.innerText = 'Open in New Tab';
            openBtn.style.padding = '5px';
            openBtn.style.cursor = 'pointer';
            openBtn.onclick = () => {
                window.open(imgUrl, '_blank');
            };

            // Button: Close menu
            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'Close Menu';
            closeBtn.style.padding = '5px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => menu.remove();

            // Append buttons
            menu.appendChild(showBtn);
            menu.appendChild(downloadBtn);
            menu.appendChild(openBtn);
            menu.appendChild(closeBtn);

            document.body.appendChild(menu);
        });
})();