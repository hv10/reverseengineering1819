import React, { Component } from 'react';
import Proptypes from 'prop-types';

import buildHeader from './buildHeader';

const _appendBuffer = (buffer1, buffer2) => {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
};

class AudioLoader extends Component {
    state = {
        audio: null
    };

    audioContext = null;

    componentDidMount() {
        this.audioContext = new AudioContext();
        const riff = _appendBuffer(
            buildHeader({ size: this.props.blob.byteLength }),
            this.props.blob
        );

        this.audioContext.decodeAudioData(riff, buffer => {
            /*const source = this.context.createBufferSource();

            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start();
            */

            this.setState(() => ({
                audio: buffer
            }));
        });
    }

    play = () => {
        const source = this.audioContext.createBufferSource();

        source.buffer = this.state.audio;
        source.connect(this.audioContext.destination);
        source.start(0);
    };

    render() {
        return (
            <>
                <p>Audio player</p>

                <button onClick={this.play}>Play</button>
            </>
        );
    }

    static propTypes = {
        blob: Proptypes.object.isRequired
    };
}

export const AUDIO_LOADER = 'AUDIO_LOADER';
export default AudioLoader;
