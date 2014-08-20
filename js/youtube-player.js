var youtubePlayerDocument = document._currentScript.ownerDocument;

function YoutubePlayer() {}

YoutubePlayer.prototype = {
  __proto__: HTMLElement.prototype,

  _shadowRoot: null,

  _videoId: null,

  set videoId(videoid) {
    this._videoId = videoid;
    var player = this._shadowRoot.querySelector('#player');
    player.src = player.src.replace('%videoid%', videoid);
  },

  get videoId() {
    return this._videoId;
  },

  createdCallback: function() {
    var template = youtubePlayerDocument.querySelector('#youtube-player').content;
    this._shadowRoot = this.createShadowRoot();
    this._shadowRoot.appendChild(document.importNode(template, true));

    this.videoId = this.hasAttribute('videoid') ?
      this.getAttribute('videoid') :
      'VoLUvE-ny1k';
  }
};

document.register('youtube-player', {
  prototype: YoutubePlayer.prototype
});
