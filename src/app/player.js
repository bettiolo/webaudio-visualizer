var Player = (function () {

	function Player() {
		console.log('Player init');

		this._tracks = [
			'http://s3.amazonaws.com/kob_samples/01_so_what_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/02_freddie_freeloader_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/03_blue_in_green_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/04_all_blues_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/05_flamenco_sketches_sample.mp3'
		];
		this._currentTrack = 0;
		this.init();
	}

	Player.prototype.load = function () {
		var trackUrl = this._tracks[this._currentTrack];
		console.log('Loading ' + trackUrl);
		var _self = this;
		var request = new XMLHttpRequest();
		request.open('GET', trackUrl, true);
		request.responseType = 'arraybuffer';
		request.send();
		request.onload = function() {
			_self._context.decodeAudioData(request.response,
				function onSuccess(decodedBuffer) {
					console.log('Loaded ' + trackUrl);
					_self._audioBuffer = decodedBuffer;
					_self.play();
				},
				function onFailure() {
					alert("Decoding the audio buffer failed");
				}
			);
		};
	};

	Player.prototype.init = function () {
		console.log('Init');
		this._context = new webkitAudioContext();
		this._analyser = this._context.createAnalyser();
		this._destination = this._context.destination;
		this._analyser.connect(this._destination);
	}

	Player.prototype.play = function () {
		console.log('Play');
		this._source = this._context.createBufferSource();
		this._source.connect(this._analyser);
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
	currentPlayer.load();
}