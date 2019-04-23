import { stringify } from 'qs';
import { WaveVisual } from './plugins/WaveVisual';
import { AudioWrapper } from './plugins/AudioWrapper';
export class AudioSurfer {
    // A timer for upate audio playing progress with API setInterval
    progressTimer = null;

    _defaultOptions = {
        color: '#1890ff',
        height: 90,
        showLog: false,
        onCanplay: () => { },
        onPlaying: () => { },
        onPause: () => { },
        onEnded: () => { },
        onError: () => { },
    }

    _state = {
        isplaying: false,
        canplay: false,
        duration: 0,
    };

    /**
     * 
     * @param { Element } container 
     * @param { { color?: String, onCanplay?: Function, onPlaying?: Function, onPause?: Function, onEnded?: Function, onError?: Function}} options 
     */
    constructor(container, options) {
        this.options = { ...this._defaultOptions, ...options };
        const { height } = this.options;
        this.showLog = this.options.showLog;
        const ownContainer = document.createElement('div');
        ownContainer.style.cssText = `position: relative; width: 100%; height: ${height}px;`;
        container.appendChild(ownContainer);
        this._init(ownContainer);
    }

    /**
     * Initial audio player and wave render(data Analyzer)
     * @private
     * @param { ElementNode } container
     */
    _init(container) {
        this.waveVisual = new WaveVisual(container, { ...this.options });
        this.audioWrapper = new AudioWrapper(container, { ...this.options, onWrapperProgress: ({ progress }) => { this._onWrapperProgress(progress) } });
        this.audioContainer = new Audio();

        this.audioContainer.addEventListener('canplay', this._onCanplay);
        this.audioContainer.addEventListener('playing', this._onPlaying);
        this.audioContainer.addEventListener('pause', this._onPause);
        this.audioContainer.addEventListener('ended', this._onEnded);
        this.audioContainer.addEventListener('error', this._onError);
    }

    /**
     * Update this state
     * @public
     * @param {{ isplaying?: Boolean, canplay?: Boolean, duration?: Number }} [newState] 
     */
    _setState(newState) {
        this._state = {
            ...this._state,
            ...newState,
        };
    }

    _showLog(method, params) {
        console.log(`method: ${method}`, `params: ${params}`);
    }

    /**
     * 
     * @private
     */
    _dealProgress = () => {
        const { duration } = this._state;
        const currentTime = this.getCurrentTime();
        const percent = `${((currentTime / duration) * 100).toFixed(4)}%`;

        this.audioWrapper.dealProgress({ percent });
        if (this.showLog) {
            this._showLog('_dealProgress', { percent });
        }
    }

    /**
     * On audioWrapper event for progress
     * @private
     * @param { Number } progress 
     */
    _onWrapperProgress(progress) {
        const { duration } = this._state;
        const time = +(duration * progress).toFixed(2);
        this.play2time(time);
        if (this.showLog) {
            this._showLog('_onWrapperProgress', { progress });
        }
    }

    /**
     *@private 
     */
    _onCanplay = () => {
        const { onCanplay } = this.options;
        this._setState({
            canplay: true
        });
        this.getDuration();
        onCanplay();
    }

    /**
     *@private 
     */
    _onPlaying = () => {
        clearInterval(this.progressTimer);
        this.progressTimer = setInterval(this._dealProgress, 500);
        const { onPlaying } = this.options;
        this._setState({
            isplaying: true
        });
        onPlaying();
    }

    /**
     *@private 
     */
    _onPause = () => {
        clearInterval(this.progressTimer);
        const { onPause } = this.options;
        this._setState({
            isplaying: false,
        });
        onPause();
    }

    /**
     *@private 
     */
    _onEnded = () => {
        const { onEnded } = this.options;
        this._setState({
            isplaying: false
        });
        onEnded();
    }

    /**
     *@private 
     */
    _onError = err => {
        const { onError } = this.options;
        this._setState({
            canplay: false,
            isplaying: false,
        });
        onError(err);
    }

    /**
     * @public
     */
    canPlay() {
        return this._state.canplay;
    }

    /**
     * @public
     */
    isPlaying() {
        return this._state.isplaying;
    }

    /**
     * @public
     */
    play() {
        this._setState({
            isplaying: true
        });
        this.audioContainer.play();
    }

    /**
     * @public
     */
    play2time(time) {
        const { onError } = this.options;
        const { duration } = this._state;

        if (time < 0 || time > duration) {
            onError(new Error('wrong time for play'));
            return;
        }
        this._setState({
            canplay: false,
            isplaying: false,
        });
        this.audioContainer.currentTime = time;
        this._dealProgress();
        if (this.showLog) {
            this._showLog('play2time', { time });
        }
    }

    /**
     * @public
     */
    pause() {
        this._setState({
            isplaying: false
        });
        this.audioContainer.pause();
    }
    
    /**
     * @public
     * @param { number } volume 
     */
    setVolume(volume) {
        this.audioContainer.volume = volume;
        
    }

    /**
     * @public
     */
    getVolume() {
        return this.audioContainer.volume;
    }

    /**
     * @public
     */
    getCurrentTime() {
        return this.audioContainer.currentTime;
    }

    /**
     * @public
     */
    getDuration() {
        const duration = this.audioContainer.duration;
        this._setState({
            duration
        });
        return duration;
    }

    /**
     * @public
     */    
    load(url, params) {
        if (this.showLog) {
            this._showLog('load', { url, params });
        }

        let audioUrl = url;
        if (params) {
            audioUrl += `?${stringify(params)}`;
        }
        this.audioContainer.src = audioUrl;
        this.audioContainer.load(audioUrl);


        this.waveVisual.load(url, { method: 'GET', ...params });
    }

    /**
     * Load audio data with a arrayBuffer
     * @param { ArrayBuffer } buffer 
     */
    loadBuffer(buffer) {
        if (this.showLog) {
            this._showLog('loadBuffer', { buffer });
        }

        if (!buffer || !buffer instanceof ArrayBuffer) return;

        const blob = new Blob([buffer]);
        const reader = new FileReader();
        reader.onload = () => {
            this.audioContainer.src = reader.result;
            this.audioContainer.load();
            this.waveVisual.load(buffer);
        };
        reader.readAsDataURL(blob);
    }

    /**
     * Destroy this and destroy wave render 
     */
    destroy() {
        this.waveVisual.abort();

        this.audioContainer.removeEventListener('canplay', this.onCanplay);
        this.audioContainer.removeEventListener('playing', this.onPlaying);
        this.audioContainer.removeEventListener('pause', this.onPause);
        this.audioContainer.removeEventListener('ended', this.onEnded);
        this.audioContainer.removeEventListener('error', this.onError);

        this.audioContainer = null;

        if (this.showLog) {
            this._showLog('destroy', { audioContainer: this.audioContainer });
        }
    }
}