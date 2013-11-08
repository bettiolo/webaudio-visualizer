var Player = (function () {
	'use strict';

	function Player() {
		console.log('Player constructed');

		this._tracks = [
			'http://s3.amazonaws.com/kob_samples/01_so_what_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/02_freddie_freeloader_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/03_blue_in_green_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/04_all_blues_sample.mp3',
			'http://s3.amazonaws.com/kob_samples/05_flamenco_sketches_sample.mp3'
		];
		this._currentTrack = 0
		this._positionOffset = 0;
		this.init();
	}

	Player.prototype.init = function () {
		console.log('Init');
		this._context = new webkitAudioContext();
		this._analyser = this._context.createAnalyser();
		this._gain = this._context.createGainNode();
		this._analyser.connect(this._gain);
		this._destination = this._context.destination;
		this._gain.connect(this._destination);
	}

	Player.prototype.load = function () {
		var _self = this;
		var trackUrl = this._tracks[this._currentTrack];
		var request = new XMLHttpRequest();
		console.log('Loading ' + trackUrl);
		request.open('GET', trackUrl, true);
		request.responseType = 'arraybuffer';
		request.send();
		request.onload = function() {
			console.log('Loaded ' + trackUrl);
			_self.decodeResponse(request.response);
		};
	};

	Player.prototype.decodeResponse = function (response) {
		var _self = this;
		console.log('Decode response');
		this._context.decodeAudioData(response,
			function (buffer) {
				_self.audioDataDecoded(buffer);
			},
			function audioDataDecodingError() {
				console.log('Audio data deconding error');
				alert("Decoding the audio buffer failed");
			}
		);
	}

	Player.prototype.audioDataDecoded = function (buffer) {
		console.log('Audio data decoded');
		this.loadBuffer(buffer);
	}

	Player.prototype.loadBuffer = function (audioBuffer) {
		if (!this._buffer) {
			console.log('Load buffer');
			this._buffer = audioBuffer;
		}
		this.linkSourceWithBuffer();
	}

	Player.prototype.linkSourceWithBuffer = function () {
		if (this._source && this._buffer) {
			console.log('Link source with buffer');
			this._positionOffset = this._context.currentTime;
			this._source.buffer = this._buffer;
		}
	}

	Player.prototype.play = function () {
		this.stop();
		console.log('Play');
		this._source = this._context.createBufferSource();
		this._source.onended = this.ended;
		this._source.connect(this._analyser);
		// this._source.loop = true;
		this._source.start(0.0);
		this._source.playbackRate.value = 1;
		this.linkSourceWithBuffer();
	};

	Player.prototype.pause = function () {
		console.log('Pause');
		this._source.pause();
	};

	Player.prototype.stop = function () {
		if (this._source) {
			console.log('Stop');
			this._source.stop(0);
		}
	};

	Player.prototype.setGain = function (gainValue) {
		this._gain.gain.value = gainValue;
	}

	Player.prototype.ended = function (event) {
		console.log('Ended');
	};

	Player.prototype.getPosition = function () {
		if (!(this._context && this._source && this._source.playbackState == 2)) {
			return 0;
		}
		return this._context.currentTime - this._positionOffset;
	}

	Player.prototype.appendBuffer = function (buffer) {
		var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
		tmp.set(new Uint8Array(buffer1), 0);
		tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
		return tmp.buffer;
	}

	return Player;

})();