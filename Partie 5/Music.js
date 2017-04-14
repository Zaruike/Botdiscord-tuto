const yt = require('ytdl-core');

function Music() {
    this.i = 0;
    this.tab = [];
    this.verif_play = true;
}

Music.prototype.setVoiceChannel = function (voiceChannel) {
    this.voiceChannel = voiceChannel;
};

Music.prototype.setI = function(i) {
    this.i = i;
};

Music.prototype.setTab = function(i, value) {
    this.tab[i] = value;
};

Music.prototype.setTabEnd = function(value) {
    this.tab[this.tab.length] = value;
};

Music.prototype.getVoiceChannel = function() {
    return this.voiceChannel;
};

Music.prototype.getTab = function (i) {
    return this.tab[i];
};

Music.prototype.getI = function() {
    return this.i;
};

Music.prototype.getLengthTab = function() {
    return this.tab.length;
};

Music.prototype.clearTab = function() {
    this.tab = [];
};

Music.prototype.voice = function() {
    if (this.verif_play == false) return;
    this.verif_play = false;
    this.voiceChannel.join().then(connection => {
        let stream = yt(this.getTab(this.getI()), {audioonly: true});
        streamoptions = { seek: 0, volume: 1 };
        this.dispatcher = connection.playStream(stream, streamoptions);
        this.dispatcher.on("end", () => {
            if (this.getI() < this.getLengthTab()) this.setI(this.i + 1);
            if (this.getI() >= this.getLengthTab()) this.setI(0);
            this.verif_play = true;
            return this.voice(this.getVoiceChannel(), this.getI());
        });
    });
};

Music.prototype.stop = function () {
    this.clearTab();
    this.dispatcher.end();
    this.voiceChannel.leave();
    this.verif_play = true;
};

Music.prototype.pause = function () {
    this.dispatcher.pause();
};

Music.prototype.resume = function () {
    this.dispatcher.resume();
};

Music.prototype.volume = function (value) {
    console.log(value);
    this.dispatcher.setVolume(value);
};

module.exports = Music;