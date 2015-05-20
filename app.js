navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// Canvas Context
var canvas = document.getElementById('canvas');
var gCtx = canvas.getContext('2d');
var barWidth, barHeight;
var WIDTH, HEIGHT;

// Resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    gCtx.strokeStyle = '#54aed6';
    barWidth = 10 * window.devicePixelRatio;
    gCtx.lineWidth = barWidth.toString();
    gCtx.lineCap = 'round';
}
resizeCanvas();

// Audio Context
var aCtx = new(window.AudioContext || window.webkitAudioContext)();
var aCtx = new AudioContext();
var source;

// Analyser Node
var analyser = aCtx.createAnalyser();
analyser.fftSize = 32;
analyser.smoothingTimeConstant = .9;
analyser.minDecibels = -90;
analyser.maxDecibels = -10;

var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength);
var dataArray = new Uint8Array(bufferLength);

// Get microphone
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

navigator.webkitGetUserMedia({
    audio: true
}, gotStream, lostStream);

function animate() {
    window.requestAnimationFrame(animate);
    gCtx.clearRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(dataArray);

    var x = (WIDTH / 2) - (16 * barWidth);
    console.log(dataArray);
    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        if (barHeight === 0)
            barHeight = 1;

        gCtx.beginPath();
        gCtx.moveTo(x, (HEIGHT / 2) + (barHeight));
        gCtx.lineTo(x, (HEIGHT / 2) - (barHeight));
        gCtx.stroke();

        x += barWidth * 2;
    }
}

function gotStream(stream) {
    source = aCtx.createMediaStreamSource(stream);
    source.connect(analyser);
}

function lostStream(e) {
    console.log(e);
}

animate();
