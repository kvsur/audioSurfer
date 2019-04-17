/**
 * This wrapper build for show the progress of audio palyed
 */
export class AudioWrapper {
    /**
     * constructor
     * @param { ElementNode } container 
     * @param {{ pointerColor?: String, progressColor?: String }} options 
     */
    constructor(container, options) {
        const _defaultOptions = {
            pointerColor: '#ff6666',
            progressColor: 'rgba(160, 160, 160, .5)',
            onWrapperProgress: () => { },
        };

        this.options = {
            ..._defaultOptions,
            ...options,
        };
        this.wrapper = container.querySelector('#audioSurferWrapper');

        // Do not create wrapper node if it exist
        if (!this.wrapper) {
            this._createWrapper(container);
        } else {
            this.innerWrapper = this.wrapper.querySelector('#audioSurferInnerWrapper');
        }
    }

    /**
     * @private
     * @param {ElementNode} container 
     */
    _createWrapper(container) {
        const { progressColor, pointerColor } = this.options;

        const tempWrapper = document.createElement('div');
        tempWrapper.addEventListener('click', event => { this._dealInnerProgress(event) });
        tempWrapper.id = 'audioSurferWrapper';
        tempWrapper.style.cssText = `position: absolute;width: 100%;height: 100%;top: 0;background-color: transparent;cursor: pointer;`;

        const innerWrapper = document.createElement('div');
        innerWrapper.id = 'audioSurferInnerWrapper';
        innerWrapper.style.cssText = `height: 100%;width: 0%;background-color: ${progressColor};border-right: 1px solid ${pointerColor};transition: width .5s;`;

        tempWrapper.appendChild(innerWrapper);

        this.wrapper = tempWrapper;
        this.innerWrapper = innerWrapper;

        container.appendChild(this.wrapper);
    }

    /**
     * Change progress when audio playing 
     * @public
     * @param {{ percent: String}} progress
     */
    dealProgress({ percent }) {
        if (!this.innerWrapper) throw new Error('Wrapper do not created');
        this.innerWrapper.style.width = `${percent}`;
    }

    /**
     * Deal the event when mouse click, and change audio play grogress
     * @private
     * @param { NodeEvent } evnet 
     */
    _dealInnerProgress(event) {
        const left = this.wrapper.getBoundingClientRect().left;
        const wrapperWidth = +window.getComputedStyle(this.wrapper).width.split('px')[0];

        const progressLeft = event.pageX - left;

        const progress = progressLeft / wrapperWidth;

        const { onWrapperProgress } = this.options;

        onWrapperProgress && onWrapperProgress({ progress });
    }
}