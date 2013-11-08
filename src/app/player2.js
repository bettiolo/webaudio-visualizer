o3djs.require('o3djs.shader');

function output(str) {
	console.log(str);
	}

// Events
// init() once the page has finished loading.

// Temporary patch until all browsers support unprefixed context.
if (window.hasOwnProperty('AudioContext') && !window.hasOwnProperty('webkitAudioContext'))
window.webkitAudioContext = AudioContext;

window.onload = init;

var context;
var source;
var analyser;
var buffer;
var audioBuffer;

var analyserView1;
var analyserView2;

function init() {
	analyserView1 = new AnalyserView("view1");
	// analyserView2 = new AnalyserView("view2");

	initAudio();
	analyserView1.initByteBuffer();
	// analyserView2.initByteBuffer();

	// analyserView2.setAnalysisType(ANALYSISTYPE_FREQUENCY);
	}

function loadAudioBuffer(url) {
	// Load asynchronously

	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
	context.decodeAudioData(request.response,
		function(b) {
			audioBuffer = b;
			finishLoad();  // add in the slider, etc. now that we've loaded the audio
		},

		function(buffer) {
			console.log("Error decoding human voice!");
		}
);
}

request.send();
}

function initAudio() {
	context = new webkitAudioContext();

	source = context.createBufferSource();
	analyser = context.createAnalyser();
	analyser.fftSize = 2048;

	// Connect audio processing graph
	source.connect(analyser);
	analyser.connect(context.destination);

	loadAudioBuffer("sounds/hyper-reality/human-voice.mp4");
	}

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

				window.setTimeout( callback, 1000 / 60 );

			};

} )();

}

function draw() {
	analyserView1.doFrequencyAnalysis();
	window.requestAnimationFrame(draw);
	}

function finishLoad() {
	source.buffer = audioBuffer;
	source.loop = true;

	source.start(0.0);

	window.requestAnimationFrame(draw);
	}
