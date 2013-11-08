/**
 * @constructor
 * @class MP3ChunksPlayer
 */
var MP3ChunksPlayer = function() {

	EventTarget.call(this);

	/**
	 * @private
	 * @type {MP3ChunksPlayer}
	 */
	var _self = this;

	/**
	 * The ArrayBuffer that will have the new chunks appended
	 *
	 * @private
	 * @type {ArrayBuffer}
	 */
	var _activeBuffer;

	/**
	 * @private
	 * @type {AudioContext}
	 */
	var _context;

	/**
	 * @private
	 * @type {AudioBuffer}
	 */
	var _audioBuffer;

	/**
	 * The audio source is responsible for playing the music
	 *
	 * @private
	 * @type {AudioBufferSourceNode}
	 */
	var _audioSource;

	/**
	 * @private
	 * @type {AnalyserNode}
	 */
	var _analyser;

	/**
	 * @private
	 * @type {XMLHttpRequest}
	 */
	var _request = new XMLHttpRequest();

	/**
	 * Creates a new Uint8Array based on two different ArrayBuffers
	 *
	 * @private
	 * @param {ArrayBuffers} buffer1 The first buffer.
	 * @param {ArrayBuffers} buffer2 The second buffer.
	 * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
	 */
	var _appendBuffer = function(buffer1, buffer2) {
		var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
		tmp.set(new Uint8Array(buffer1), 0);
		tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
		return tmp.buffer;
	};

	/**
	 * @private
	 */
	var _initializeWebAudio = function() {
		_context = new webkitAudioContext();
		// _analyser = _context.createAnalyser();
		// _analyser.fftSize = 2048;
	};

	/**
	 * @private
	 */
	var _play = function() {
		var scheduledTime = 0.015;

		try {
			_audioSource.stop(scheduledTime);
		} catch (e) {}

		_audioSource = _context.createBufferSource();
		_audioSource.buffer = _audioBuffer;
		_audioSource.connect(_analyser);
		_audioSource.connect(_context.destination);
		var currentTime = _context.currentTime + 0.010 || 0;
		_audioSource.start(scheduledTime - 0.005, currentTime, _audioBuffer.duration - currentTime);
		_audioSource.playbackRate.value = 1;
		_self.trigger('message', ['AudioBuffer is replaced!']);
	};

	var _initialized = false;
	/**
	 * @private
	 */
	var _onChunkLoaded = function() {
		console.log('Chunk loaded!');
		_self.trigger('message', ['Chunk loaded!']);
		if (!_initialized) {
			_initializeWebAudio();
			_activeBuffer = _request.response;
		} else {
			_self.trigger('message', ['Chunk is appended!']);
			_activeBuffer = _appendBuffer(_activeBuffer, _request.response);
		}

		// Use decodeAudioData so that we don't block the main thread.
		_context.decodeAudioData(_activeBuffer, function(buf) {
			_self.trigger('message', ['AudioData decoded!']);
			_audioBuffer = buf;
			_play();
		});

		// If this is the first chunk then trigger play
		if (_initialized) {
			_self.trigger('play');
		}

		_initialized = true;
		_loadChunk('RoccoW_-_Pumped.mp3');
//		_totalChunksLoaded++;
//		if (_totalChunksLoaded < _files.length) {
//			setTimeout(function() {
//				_loadChunk(_totalChunksLoaded);
//			}, 3000);
//		}
	};

	var _loadChunk = function(url) {
		_self.trigger('message', ['Loading chunk', _files[index], '...']);
		_request.open('GET', url, true);
		_request.send();
	};

	/**
	 * @return {Uint8Array} The array that holds the visualisation data.
	 */
//	this.getVisualisationData = function() {
//		// get the average for the first channel
//		var array = new Uint8Array(_analyser.frequencyBinCount);
//		_analyser.getByteFrequencyData(array);
//
//		return array;
//
//	};

	/**
	 * Initializes the class by loading the first chunk
	 *
	 * @return {MP3ChunksPlayer} Returns a reference to this instance.
	 */
	this.init = function() {
		console.log('MP3ChunksPlayer initialized!');

		_request.responseType = 'arraybuffer';
		_request.onload = function() {
			_onChunkLoaded
		}
			context.decodeAudioData(
				request.response,
				function(b) {
					audioBuffer = b;
					finishLoad();  // add in the slider, etc. now that we've loaded the audio
				},

				function(buffer) {
					console.log("Error decoding human voice!");
				}
			);

		_loadChunk(_totalChunksLoaded);

		return this;
	};
};