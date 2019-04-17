# audiosurfer
Progressive audio play and render in canvas

===========

Install with [npm](https://www.npmjs.com/):

npm:
```sh
npm install audiosurfer --save
```

### Usage
```js
import { AudioSurfer } from 'auidosurfer';

const container = document.querySelectory('#container');

const audioSurfer = new AudioSurfer(container, {
    color: '#1890ff',
    onCanplay: () => {},
    onPlaying: () => {},
    onPause: () => {},
    onEnded: () => {},
    onError: () => {},
});

audioSurfer.load('http://localhost:1024/demo.wav');

```

### API

```js
/**
 * 
*/
AudioSurfer.load()

/**
 * 
*/
AudioSurfer.loadBuffer()

/**
 * 
*/
AudioSurfer.destroy()

/**
 * 
*/
AudioSurfer.play()

/**
 * 
*/
AudioSurfer.pause()

/**
 * 
*/
AudioSurfer.play2time()

/**
 * 
*/
AudioSurfer.canPlay()

/**
 * 
*/
AudioSurfer.isPlaying()

/**
 * 
*/
AudioSurfer.canPlay()

/**
 * 
*/
AudioSurfer.getCurrentTime()

/**
 * 
*/
AudioSurfer.getDuration()
```
