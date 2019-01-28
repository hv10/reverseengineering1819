import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';

import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button
} from '@material-ui/core';

import * as FileTypes from './../../constants/filetypes';

import Canvas from './../Canvas';

const inBounds = (x, y) => x >= 0 && x <= 800 && (y >= 0 && y <= 800);
class ImageLoader extends Component {
    state = {
        width: 0,
        height: 0,
        image: null,

        isSelectOpen: false,
        selectedPalette: -1
    };
    canvas = React.createRef();

    showImage = () => {
        const { palette } = this.state.palettes.find(
            pal => pal.id === this.state.selectedPalette
        );

        for (let i = 0; i < this.state.image.byteLength; i += 1) {
            const palette_key = palette[this.state.image[i]];

            const rgb = [palette_key.r, palette_key.g, palette_key.b];
            const x = i % this.state.width;
            const y = Math.floor(i / this.state.width);

            this.canvas.current.putPixel(rgb, x, y);
        }
    };

    componentDidMount() {
        const image = this.props.blob;

        const header = image.subarray(0, 4);
        const data = image.subarray(4, image.byteLength);

        const width = (header[0] << 8) | header[1];
        const height = (header[2] << 8) | header[3];

        this.setState(() => ({
            width,
            height,
            image: data
        }));
    }

    openSelect = () => {
        this.setState(() => ({
            isSelectOpen: true
        }));
    };

    closeSelect = () => {
        this.setState(() => ({
            isSelectOpen: false
        }));
    };

    setPalette = e => {
        this.setState(() => ({
            selectedPalette: Number(e.target.value)
        }));
    };

    export = () => {
        this.canvas.current.canvas.current.toBlob(blob => {
            saveAs(blob, 'image.png');
        });
    };

    static getDerivedStateFromProps(props, state) {
        const palettes = [];
        for (let { blob, id } of props.palettes) {
            const data = blob.subarray(8, blob.byteLength);
            //const header = blob.subarray(0, 8);

            const palette = {};
            for (let i = 0; i < data.byteLength; i += 8) {
                const palette_key = (data[i] << 8) | data[i + 1];

                palette[palette_key] = {
                    r: data[i + 2] || 0,
                    g: data[i + 4] || 0,
                    b: data[i + 6] || 0
                };
            }

            palettes.push({
                id: Number(id),
                palette
            });
        }

        return {
            palettes,
            ...state
        };
    }

    render() {
        return (
            <>
                <FormControl>
                    <InputLabel>Choose palette</InputLabel>
                    <Select
                        open={this.state.isSelectOpen}
                        value={this.state.selectedPalette}
                        onOpen={this.openSelect}
                        onClose={this.closeSelect}
                        onChange={this.setPalette}
                    >
                        {this.state.palettes.map(pal => (
                            <MenuItem key={pal.id} value={pal.id}>
                                {pal.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div
                    style={{
                        height: '400px',
                        width: '640px',
                        overflowY: 'scroll'
                    }}
                >
                    <Canvas
                        ref={this.canvas}
                        width={this.state.width}
                        height={this.state.height}
                    />
                </div>

                <p>
                    Width: {this.state.width} | Height: {this.state.height}
                </p>

                <Button
                    variant="outlined"
                    disabled={this.state.selectedPalette < 0}
                    onClick={this.showImage}
                >
                    Render Image
                </Button>
                <Button variant="outlined" onClick={this.export}>
                    Export image
                </Button>
            </>
        );
    }
}

const mapStateToProps = state => ({
    palettes: Object.entries(state.datastore)
        .filter(([key, entry]) => entry.filetype === FileTypes.PALTETTE)
        .map(([id, val]) => ({
            id,
            ...val
        }))
});

export const IMAGE_LOADER = 'IMAGE_LOADER';
export default connect(mapStateToProps)(ImageLoader);
