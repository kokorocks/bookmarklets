(function() {
    if(window.location.hostname==='www.youtube.com' || window.location.hostname==='youtube.com' || window.location.hostname==='youtu.be'){
        url=window.location.href.replace('youtube', 'skipcut')
        location.replace(url)
    }else{
        alert('no')
    }
})()