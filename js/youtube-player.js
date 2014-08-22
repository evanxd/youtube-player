(function(window, document) {
  var youtubePlayerDocument = document._currentScript.ownerDocument;

  function YoutubePlayer() {}

  YoutubePlayer.prototype = {
    __proto__: HTMLElement.prototype,

    _player: null,

    _shadowRoot: null,

    _videoId: null,

    state: null,

    get videoId() {
      return this._videoId;
    },

    get currentTime() {
      return this._player.getCurrentTime();
    },

    createdCallback: function() {
      var template = youtubePlayerDocument.querySelector('#youtube-player').content;
      this._shadowRoot = this.createShadowRoot();
      this._shadowRoot.appendChild(document.importNode(template, true));

      this._videoId = this.hasAttribute('videoid') ?
        this.getAttribute('videoid') :
        'VoLUvE-ny1k';

      this._loadYoutubeApi();
      youtubePlayerDocument.addEventListener('youtubeiframeapiready',
        function() {
          this._createPlayer();
        }.bind(this));
    },

    load: function(videoId) {
      this._player.loadVideoById(videoId);
    },

    play: function() {
      this._player.playVideo();
    },

    pause: function() {
      this._player.pauseVideo();
    },

    seekTo: function(second) {
      this._player.seekTo(second);
    },

    _loadYoutubeApi: function() {
      var script = document.createElement('script');
      script.src = "https://www.youtube.com/iframe_api";
      this._shadowRoot.appendChild(script);
    },

    _createPlayer: function() {
      this._player = new YT.Player('player', {
        videoId: this.videoId,
        events: {
          onReady: function(event) {
            this.dispatchEvent(new CustomEvent('ready', {
              detail: event
            }));
            this.onready && this.onready(event);
          }.bind(this),
          onStateChange: function(event) {
            this.dispatchEvent(new CustomEvent('statechange', {
              detail: event
            }));
            this.onstatechange && this.onstatechange(event);
          }.bind(this)
        }
      });
      this.state = YT.PlayerState;
    }
  };

  window.onYouTubeIframeAPIReady = function() {
    youtubePlayerDocument.dispatchEvent(
      new CustomEvent('youtubeiframeapiready')
    );
  };

  document.register('youtube-player', {
    prototype: YoutubePlayer.prototype
  });
})(window, document);
