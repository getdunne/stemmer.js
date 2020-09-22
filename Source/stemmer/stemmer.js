// HTML table generation
var tracksDiv = document.getElementById('tracksDiv');
let titleDiv = document.createElement('div');
titleDiv.setAttribute('class', 'row');
let title = document.createElement('h5');
title.appendChild(document.createTextNode(songTitle));
titleDiv.appendChild(title);
tracksDiv.appendChild(titleDiv);

var sliders = [], muteButtons = [], soloButtons = [];
var trackLevels = [], trackMuted = [], trackSoloed = [];

let trackCount = tracks.length;
for (var i = 0; i < trackCount; i++)
{
    let hue = tracks[i].hue;
    let sat = tracks[i].sat;
    let level = tracks[i].level;
    
    let trackTitleDiv = document.createElement('div');
    trackTitleDiv.setAttribute('class', 'row');
    trackTitleDiv.setAttribute('style', `color:white; background-color:hsl(${hue},${sat}%,50%)`);
    trackTitleDiv.appendChild(document.createTextNode(tracks[i].name));
    tracksDiv.appendChild(trackTitleDiv);
    
    let controlsDiv = document.createElement('div');
    controlsDiv.setAttribute('class', 'row');
    let buttonsDiv = document.createElement('div');
    buttonsDiv.setAttribute('class', 'col-3');
    buttonsDiv.setAttribute('style', `background-color:hsl(${hue},${sat}%,80%)`);
    let muteButton = document.createElement('button');
    muteButton.appendChild(document.createTextNode('mute'));
    muteButton.disabled = true;
    muteButton.index = i;
    muteButton.onclick = function() { mute(this.index);}
    muteButtons.push(muteButton);
    buttonsDiv.appendChild(muteButton);
    
    let gap = document.createElement('span');
    gap.setAttribute('style', 'padding-left:3px; padding-right:3px');
    gap.appendChild(document.createTextNode(' '));
    buttonsDiv.appendChild(gap);
    let soloButton = document.createElement('button');
    soloButton.appendChild(document.createTextNode('solo'));
    soloButton.disabled = true;
    soloButton.index = i;
    soloButton.onclick = function() { solo(this.index); }
    soloButtons.push(soloButton);
    buttonsDiv.appendChild(soloButton);
    
    let sliderDiv = document.createElement('div');
    sliderDiv.setAttribute('class', 'col');
    sliderDiv.setAttribute('style', `background-color:hsl(${hue},${sat}%,80%); padding:15px`);
    let slider = document.createElement('input');
    slider.type = 'range';
    slider.setAttribute('style', 'width:100%; height:20px');
    slider.min = 1;
    slider.max = 100;
    slider.disabled = true;
    slider.value = level;
    slider.index = i;
    slider.oninput = function() { setVolume(this.index, 0.01 * this.value); };
    sliders.push(slider);
    trackLevels.push(0.01 * level);
    trackMuted.push(false);
    trackSoloed.push(false);
    sliderDiv.appendChild(slider);

    controlsDiv.appendChild(buttonsDiv);
    controlsDiv.appendChild(sliderDiv);
    tracksDiv.appendChild(controlsDiv);
    
    let spacerDiv = document.createElement('div');
    spacerDiv.setAttribute('class', 'row');
    spacerDiv.setAttribute('style', 'height:5px');
    tracksDiv.appendChild(spacerDiv);
}

var skipButtons = [], backButtons = [];
skipButtonsDiv = document.getElementById('skipButtonsDiv');

let spacerDiv = document.createElement('div');
spacerDiv.setAttribute('class', 'row');
spacerDiv.setAttribute('style', 'height:10px');
skipButtonsDiv.appendChild(spacerDiv);

let skipCount = skipTimes.length;
let startButtonsDiv = document.createElement('div');
startButtonsDiv.setAttribute('class', 'row');
for (var i = 0; i < skipCount; i++)
{
    let buttonRowDiv = document.createElement('div');
    buttonRowDiv.setAttribute('class', 'btn-row');
    
    let btn = document.createElement('button');
    btn.setAttribute('class', 'start-btn');
    btn.innerHTML = skipTimes[i]['name'];
    btn.disabled = true;
    btn.timeSec = skipTimes[i]['timeSec'];
    btn.onclick = function() { playFrom(this.timeSec); pauseButton.innerHTML = 'Pause'; };
    skipButtons.push(btn);
    buttonRowDiv.appendChild(btn);
    startButtonsDiv.appendChild(buttonRowDiv);
}
skipButtonsDiv.appendChild(startButtonsDiv);

let pauseButtonDiv = document.createElement('div');
pauseButtonDiv.setAttribute('class', 'row');
var buttonRowDiv = document.createElement('div');
buttonRowDiv.setAttribute('class', 'btn-row');

var pauseButton = document.createElement('button');
pauseButton.setAttribute('class', 'pause-btn');
pauseButton.innerHTML = 'Play';
pauseButton.disabled = true;
pauseButton.onclick = function() { pauseButton.innerHTML = pause() ? 'Play' : 'Pause'; };
buttonRowDiv.appendChild(pauseButton);
pauseButtonDiv.appendChild(buttonRowDiv);
skipButtonsDiv.appendChild(pauseButtonDiv);

let backButtonsDiv = document.createElement('div');
backButtonsDiv.setAttribute('class', 'row');

buttonRowDiv = document.createElement('div');
buttonRowDiv.setAttribute('class', 'btn-row');
btn = document.createElement('button');
btn.setAttribute('class', 'back-btn');
btn.innerHTML = 'Back 2s';
btn.disabled = true;
btn.onclick = function() { back(2.0); };
backButtons.push(btn);
buttonRowDiv.appendChild(btn);
backButtonsDiv.appendChild(buttonRowDiv);

buttonRowDiv = document.createElement('div');
buttonRowDiv.setAttribute('class', 'btn-row');
btn = document.createElement('button');
btn.setAttribute('class', 'back-btn');
btn.innerHTML = 'Back 10s';
btn.disabled = true;
btn.onclick = function() { back(10.0); };
backButtons.push(btn);
buttonRowDiv.appendChild(btn);
backButtonsDiv.appendChild(buttonRowDiv);

skipButtonsDiv.appendChild(backButtonsDiv);


// Sounds management
var sounds = [];

function loadSounds()
{
    loadBtn.innerHTML = "Loading - Please WAIT";
    sounds = [];
    var trackCount = tracks.length;
    for (var i = 0; i < trackCount; i++)
    {
        sounds.push(new Howl({ src: [tracks[i].path], preload: true, onload: onSoundLoad }));
    }
}

function onSoundLoad()
{
    if (sounds.length < tracks.length) return;
    
    var allLoaded = true;
    sounds.forEach(function(sound, index)
    {
        if (sound.state() == 'loaded')
            sound.volume(trackLevels[index]);
        else
            allLoaded = false;
    });
    
    if (allLoaded)
    {
        muteButtons.forEach(function(btn, index) { btn.disabled = false; })
        soloButtons.forEach(function(btn, index) { btn.disabled = false; })
        sliders.forEach(function(slider, index) { slider.disabled = false; });
        skipButtons.forEach(function(btn, index) { btn.disabled = false; });
        pauseButton.disabled = false;
        backButtons.forEach(function(btn, index) { btn.disabled = false; });
        
        loadBtn = document.getElementById('loadBtn')
        loadBtn.innerHTML = "Ready to Play";
        loadBtn.disabled = true;
    }
}

function skipTo(timeSec)
{
    sounds.forEach(function(sound, index)
    {
        sound.seek(timeSec);
    });
}

function back(timeSec)
{
    skipTo(sounds[0].seek() - timeSec);
}

function playFrom(timeSec)
{
    stop();
    skipTo(timeSec);
    play();
}

function pause()
{
    console.log('pause %d sounds', sounds.length);
    
    var wasPlaying = sounds[0].playing();
    if (wasPlaying)
        sounds.forEach(function(sound, index)
        {
            sound.pause();
        });
    else play();
    return wasPlaying;
}

function play()
{
    sounds.forEach(function(sound, index)
    {
        sound.play();
    });
}

function stop()
{
    sounds.forEach(function(sound, index)
    {
        sound.stop();
    });
}

function setVolume(index, fraction)
{
    trackLevels[index] = fraction;
    if (!trackMuted[index])
        sounds[index].volume(fraction);
}

function mute(index)
{
    var wasMuted = trackMuted[index];
    trackMuted[index] = !wasMuted;
    soloButtons[index].disabled = !wasMuted;
    sounds[index].volume(wasMuted ? trackLevels[index] : 0.0);
}

function solo(soloIndex)
{
    var wasSoloed = trackSoloed[soloIndex];
    trackSoloed[soloIndex] = !wasSoloed;
    sounds.forEach(function(sound, index) {
        var vol = trackLevels[index];
        if (!wasSoloed && index != soloIndex) vol = 0.0;
        sound.volume(vol);
        });
}
