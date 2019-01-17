import React, { Component } from 'react';
import md5 from 'blueimp-md5';
import { hot } from 'react-hot-loader/root';

import FileLoader from './components/FileLoader';
import Canvas from './components/Canvas';

const Encoder = new TextDecoder('utf-8');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,

            fast: true,

            palette: {},
            selectedPallete: null
        };

        this.canvas = React.createRef();
    }

    setRenderMode = e => {
        e.persist();

        this.setState(() => ({
            fast: e.target.checked
        }));
    };

    extractPalette = blob => {
        const raw = new Uint8Array(blob);
        const hash = md5(Encoder.decode(blob));

        if (this.state.palette.hasOwnProperty(hash)) {
            return;
        }

        const data = raw.subarray(8, raw.byteLength);
        const header = raw.subarray(0, 8);

        const palette = {};
        for (let i = 0; i < data.byteLength; i += 8) {
            const palette_key = (data[i] << 8) | data[i + 1];

            palette[palette_key] = {
                r: data[i + 2] || 0,
                g: data[i + 4] || 0,
                b: data[i + 6] || 0
            };
        }

        this.setState(state => ({
            palette: {
                ...state.palette,
                [hash]: palette
            }
        }));
    };

    usePallette = key => () => {
        this.setState(
            {
                selectedPallete: key
            },
            () => this.handleBlob(this.state.image)
        );
    };

    handleBlob = blob => {
        const image = new Uint8Array(blob);

        const header = image.subarray(0, 4);
        const data = image.subarray(4, image.byteLength);

        const width = (header[0] << 8) | header[1];
        const height = (header[2] << 8) | header[3];

        const step = this.state.fast ? 3 : 1;

        this.setState(
            {
                image,
                width,
                height
            },
            () => {
                for (let i = 0; i < data.byteLength; i += step) {
                    const palette_key = this.state.palette[
                        this.state.selectedPallete
                    ][data[i]];

                    const rgb = [palette_key.r, palette_key.g, palette_key.b];
                    const x = i % width;
                    const y = Math.floor(i / width);

                    this.canvas.current.putPixel(rgb, x, y);
                }
            }
        );
    };

    render() {
        const { width, height, palette, selectedPallete, fast } = this.state;

        return (
            <>
                <p>War Data extractor</p>

                <label>
                    Fast mode
                    <input
                        type="checkbox"
                        onChange={this.setRenderMode}
                        checked={fast}
                    />
                </label>

                {selectedPallete && (
                    <p>Palette selected {selectedPallete.substr(0, 5)}</p>
                )}

                {Object.keys(palette).map(key => (
                    <button key={key} onClick={this.usePallette(key)}>
                        Pallete {key.substr(0, 5)}
                    </button>
                ))}

                <FileLoader getBlob={this.extractPalette} />
                <FileLoader
                    getBlob={this.handleBlob}
                    disabled={!selectedPallete}
                />
                <Canvas ref={this.canvas} width={width} height={height} />
            </>
        );
    }
}

export default hot(App);
