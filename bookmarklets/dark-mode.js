(function() {
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.js';
script.onload = () => DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
document.head.appendChild(script);
})();