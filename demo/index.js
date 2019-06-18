
const container = document.getElementById('container');
const playBtn = document.getElementById('playBtn');

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

playBtn.addEventListener('click', e => {
    const isPlaying = audioSurfer.isPlaying();
    if(isPlaying) audioSurfer.pause();
    else audioSurfer.play();
})

audioSurfer.load('/source/doble.wav', { name: 'hello', age: 1});