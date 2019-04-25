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
    color: '#1890ff', // color of wave 
    showLog: false, // you show log when this code in runtime
    pointerColor: '#ff6666', // color of potioner
    progressColor: 'rgba(160, 160, 160, .5)', // color of played part
    onCanplay: () => {},
    onPlaying: () => {},
    onPause: () => {},
    onEnded: () => {},
    onError: () => {},
});

// only support http 'GET' method, 
audioSurfer.load('http://localhost:1024/demo.wav', { name: 'hello', age: 1});

```

### API

```js
/**
 * @param { String } url
 * @param { { paramX: any, [paramN: any, ....] }} params
*/
AudioSurfer.load()

/**
 * Load audio data with a arrayBuffer
 * @param { ArrayBuffer } buffer 
 */
AudioSurfer.loadBuffer()

/**
 * romove event listener, clear src of audio 
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
 * @param { Number } time [0 <= time <= duration]
*/
AudioSurfer.play2time()

/**
 * 
*/
AudioSurfer.isPlaying()

/**
 * @param { Number } volume [0 <= volume <= 1]
*/
AudioSurfer.setVolume()

/**
 * 
*/
AudioSurfer.getVolume()

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
