var template = document._currentScript.ownerDocument
  .querySelector('template').content;
var YoutubePlayer = Object.create(HTMLElement.prototype);

YoutubePlayer.createdCallback = function() {
  var shadowRoot = this.createShadowRoot();
  shadowRoot.appendChild(document.importNode(template, true));
};

document.register("youtube-player", {
  prototype: YoutubePlayer
});
