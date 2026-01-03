(function() {
    // Insert modal HTML into body
    document.body.insertAdjacentHTML('afterbegin', `
    <div id="modal-overlay">
        <dialog id="style" open>
            <style>
            #modal-overlay{
                position: fixed;
                top:0; left:0;
                width:100%; height:100%;
                backdrop-filter: blur(5px);
                background: rgba(0,0,0,0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            }
            #style{
                color-scheme: light dark;
                background: light-dark(white, black);
                border-radius: 15px;
                width: 300px;
                padding: 20px;
                text-align: center;
            }
            #x{
                cursor: pointer;
                position: relative;
            }
            #x:hover::after{
                content:"Click to copy";
                position:absolute;
                top:-25px;
                left:50%;
                transform:translateX(-50%);
                background:#000;
                color:#fff;
                padding:3px 6px;
                border-radius:4px;
                font-size:12px;
                white-space:nowrap;
            }
            </style>
            <form method="dialog" id="genForm">
                <label>from: <input id="s" type="number" value="1"></label><hr>
                <label>to: <input id="t" type="number" value="2"></label><br><br>
                <button type="submit">Generate</button><br><br>
                <output id="x" name="x" for="s t" onclick="navigator.clipboard.writeText(this.textContent)">1</output><br>
                <button id='cls'>close</button>
            </form>
        </dialog>
    </div>
    `);

    // Disable background scrolling
    document.body.style.overflow = 'hidden';

    const form = document.getElementById('genForm');
    const output = document.getElementById('x');
    const overlay = document.getElementById('modal-overlay');
    const dialog = document.getElementById('style');
    const cls = document.getElementById('cls');

    // Generate button functionality
    form.addEventListener('submit', e => {
        e.preventDefault();
        const f = Number(document.getElementById('s').value);
        const t = Number(document.getElementById('t').value);
        if(!isNaN(f) && !isNaN(t)){
            output.value = Math.floor(Math.random() * (t - f + 1)) + f;
        }
    });

    // make clicking outside from closing
    overlay.addEventListener('click', e =>overlay.outerHTML='');
    dialog.addEventListener('click', e => e.stopPropagation());
    cls.onclick=function(){overlay.outerHTML=''}
})();