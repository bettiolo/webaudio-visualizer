var PlayerUi = (function () {
	'use strict';

	function PlayerUi(player) {
		this.$info = document.getElementById('info');
		this.$log =  document.getElementById('log');
		this.$info.innerHTML = 'Getting ready...';
		this.player = player;
		this.playbackState = [
			'Unscheduled',
			'Scheduled',
			'Playing',
			'Stopped'
		];

		// window.setInterval(function() { _self.update(); }, 300);
		this.update();
	}

	PlayerUi.prototype.update = function () {
		if (!(this.player && this.player._context)) {
			return;
		}
		var context = this.player._context;
		var bufferDuration = 0;
		var bufferLength = 0;
		if (this.player._buffer) {
			bufferDuration = this.player._buffer.duration;
			bufferLength = this.player._buffer.length;
		}
		var position = this.player.getPosition();
		var playbackState = 'Unknown';
		if (this.player._source) {
			playbackState = this.playbackState[this.player._source.playbackState];
		}
		this.$info.innerHTML =
			'Context.currentTime: ' + this.getSeconds(context.currentTime) + '<br/>' +
			'Buffer.duration: ' + this.getSeconds(bufferDuration) + '<br/>' +
			'Buffer.length: ' + bufferLength + ' frames<br/>' +
			'Position: ' + this.getSeconds(position) + '<br/>' +
			'Source.playbackState: ' + playbackState + '<br/>' +
			'';

		var _self = this;
		window.requestAnimationFrame(function () { _self.update(); });
	};

	PlayerUi.prototype.getSeconds = function(value) {
		var rounded = Math.round(value * 100) / 100;
		return rounded + 's';
	}

	return PlayerUi;
})();