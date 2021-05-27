(function() {
	function FlowWave(opt) {
		// default values
		this.init(opt);
	}
	FlowWave.prototype.init = function(opt) {
		var kDefaultFrequency = 1.5;
		var kDefaultAmplitude = 0.5;
		var kDefaultIdleAmplitude = 0.05;
		var kDefaultNumberOfWaves = 5.0;
		var kDefaultPhase = 0;
		var kDefaultPhaseShift = -0.15;
		var kDefaultDensity = 5;
		var kDefaultPrimaryLineWidth = 1;
		var kDefaultSecondaryLineWidth = 1;
		var kDefaultFPS = 60;
		var kDefaultColor = '87, 91, 102';

		opt = opt || {};

		this.phase = kDefaultPhase;
		this.run = false;

		// UI vars
		this.ratio = opt.ratio || window.devicePixelRatio || 1;
		this.width = opt.width || 500;
		this.height = opt.height || 300;
		this.halfHeight = this.height / 2;
		this.halfWidth = this.width / 2;
		this.maxAmplitude = this.halfHeight - 4.0;

		// Constructor opt
		this.amplitude = opt.amplitude || kDefaultAmplitude;
		this.fps = opt.fps || kDefaultFPS;
		this.frequency = opt.frequency || kDefaultFrequency;
		this.color = opt.color || kDefaultColor;
		this.idleAmplitude = opt.idleAmplitude || kDefaultIdleAmplitude;
		this.numberOfWaves = opt.numberOfWaves || kDefaultNumberOfWaves;
		this.phaseShift = opt.phaseShift || kDefaultPhaseShift;
		this.density = opt.density || kDefaultDensity;
		this.primaryWaveLineWidth = opt.primaryWaveLineWidth || kDefaultPrimaryLineWidth;
		this.secondaryWaveLineWidth = opt.secondaryWaveLineWidth || kDefaultSecondaryLineWidth;
		this.level = opt.level || 0.5;

		// animation vars
		this.now = Date.now();
		this.then = Date.now();
		this.interval = 1000 / this.fps;
		this.delta = this.now - this.then;

		// canvas vars
		this.canvas = opt.canvas || document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.container = opt.container || document.body;
		this.container.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');

		if (opt.autostart) {
			this.start();
		}

	}

	FlowWave.prototype.resize = function(opt) {
		this.container.removeChild(this.canvas);
		FlowWave.prototype._GATF_cache = {};
		this.init(opt);
	}
	FlowWave.prototype._GATF_cache = {}
	FlowWave.prototype._globAttFunc = function (x) {
		if (FlowWave.prototype._GATF_cache[x] == null) {
			FlowWave.prototype._GATF_cache[x] = -1 * Math.pow(1 / this.halfWidth * (x - this.halfWidth), 2) + 1;
		}
		return FlowWave.prototype._GATF_cache[x];
	}

	FlowWave.prototype._ypos = function(i, x) {
		var progress = 1 - i / this.numberOfWaves;
		var normedAmplitude = (1.5 * progress - 0.5) * this.amplitude;
		return this._globAttFunc(x) * this.maxAmplitude * normedAmplitude * Math.sin(2 * Math.PI * (x / this.width) * this.frequency + this.phase) + this.halfHeight;
	}

	FlowWave.prototype._updateLevel = function(level) {
		this.phase += this.phaseShift;
		this.amplitude = Math.max(level, this.idleAmplitude);
	}

	FlowWave.prototype._drawLine = function(i) {
		this.ctx.lineWidth = (i == 0 ? this.primaryWaveLineWidth : this.secondaryWaveLineWidth);
		this.ctx.strokeStyle = 'rgba(' + this.color + ', ' + (1 - i / this.numberOfWaves) + ')';

		for (var x = 0; x < (this.width + this.density); x += this.density) {
			var y = this._ypos(i, x);

			if (x == 0)
				this.ctx.moveTo(x, y);
			else
				this.ctx.lineTo(x, y);
		}
		this.ctx.stroke();
	}

	FlowWave.prototype._draw = function(supportAnimFrame) {
		if (this.run === false) return;

		if(supportAnimFrame) {
			requestAnimationFrame(this._draw.bind(this));

			this.now = Date.now();
			this.delta = this.now - this.then;

			if (this.delta > this.interval) {
				this.then = this.now - (this.delta % this.interval);
				this.ctx.clearRect(0, 0, this.width, this.height);
				this._updateLevel(this.level);

				this.ctx.beginPath();
				for (var i = 0; i < this.numberOfWaves; i++) {
					this._drawLine(i);
				}
				this.ctx.closePath();
			}
			return;
		}

		setTimeout(this._draw.bind(this), this.interval);
	};

	// API

	FlowWave.prototype.start = function() {
		this.phase = 0;
		this.run = true;
		this._draw(window.requestAnimationFrame);
	};

	FlowWave.prototype.stop = function() {
		this.phase = 0;
		this.run = false;
	}

	if (typeof define === 'function' && define.amd) {
		define(function(){ return FlowWave; });
		return;
	};
	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FlowWave;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports.FlowWave = FlowWave;
	} else {
		window.FlowWave = FlowWave;
	}
})();


/** WEBPACK FOOTER **
 ** ./src/javascripts/third-party/flowWave.js
 **/