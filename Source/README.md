## Root folder
This is a representation of a suitable folder structure for a *stemmer.js* based site.

The *index.html* file is boilerplate, which you only need change if you want to. The *song-setup.js* file (below) is the only file you'll need to edit, to set up your specific song.

```javascript
var songTitle = 'Dona Nobis Pacem';

var tracks = [
    { hue: 0, name: 'Piano', path: './stems/Piano.mp3' },
    { hue: 90, name: 'Soprano 1', path: './stems/Soprano1.mp3' },
    { hue: 120, name: 'Soprano 2', path: './stems/Soprano2.mp3' },
    { hue: 30, name: 'Alto', path: './stems/Alto.mp3' }
    ];

var skipTimes = [
    { name: 'Intro', timeSec: 0.0 },
    { name: 'm7', timeSec: 10.9 },
    { name: 'm16', timeSec: 35.6 },
    { name: 'm24', timeSec: 54.5 },
    { name: 'm33', timeSec: 74.5 },
    { name: 'm42', timeSec: 97.3 },
    { name: 'm51', timeSec: 118.3 }
    ];
```

The *hue* numbers in each track definition range from 0 to 360, and correspond to "hue" values in the [HSL Color naming system](https://www.w3schools.com/colors/colors_hsl.asp).
