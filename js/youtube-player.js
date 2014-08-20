var youtubePlayerDocument = document._currentScript.ownerDocument;

function YoutubePlayer() {}

YoutubePlayer.prototype = {
  __proto__: HTMLElement.prototype,

  _player: null,

  _shadowRoot: null,

  _videoId: null,

  set videoId(videoid) {
    this._videoId = videoid;
  },

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

    this.videoId = this.hasAttribute('videoid') ?
      this.getAttribute('videoid') :
      'VoLUvE-ny1k';

    this._loadYoutubeApi();
    youtubePlayerDocument.addEventListener('youtubeiframeapiready',
      function() {
        this._createPlayer();
      }.bind(this));
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
        }.bind(this),
        onStateChange: function(event) {
          this.dispatchEvent(new CustomEvent('statechange', {
            detail: event
          }));
        }.bind(this)
      }
    });
  }
};

function onYouTubeIframeAPIReady() {
  youtubePlayerDocument.dispatchEvent(
    new CustomEvent('youtubeiframeapiready')
  );
}

document.register('youtube-player', {
  prototype: YoutubePlayer.prototype
});
