var Player = (function () {

	function Player() {
		console.log('Player init');
		this._context = new webkitAudioContext();
		this._source = this._context.createBufferSource();
		this._analyser = this._context.createAnalyser();
		this._destination = this._context.destination;
		this._source.connect(this._analyser);
		this._analyser.connect(this._destination);
	}

	Player.prototype.load = function (url) {
		console.log('Loading ' + url);
		var _self = this;
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.send();
		request.onload = function() {
			_self._context.decodeAudioData(request.response,
				function onSuccess(decodedBuffer) {
					console.log('Loaded ' + url);
					_self._audioBuffer = decodedBuffer;
					_self.play();
				},
				function onFailure() {
					alert("Decoding the audio buffer failed");
				}
			);
		};
	};

	Player.prototype.play = function () {
		console.log('Play');
		this._source.buffer = this._audioBuffer;
		this._source.loop = true;
		this._source.start(0.0);
		this._source.playbackRate.value = 1;
	};

	Player.prototype.pause = function () {
		console.log('Pause');
		this._source.pause();
	};

	Player.prototype.stop = function () {
		console.log('Stop');
		this._source.stop(0);
	};

	Player.prototype.ended = function (event) {
		console.log('Ended');
	};

	return Player;

})();

window.onload = function () {
	console.log('Window load');
	window.currentPlayer = new Player();
	currentPlayer.load('media/RoccoW_-_Pumped.mp3');
}