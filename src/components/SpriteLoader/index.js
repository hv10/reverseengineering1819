import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';

import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Checkbox
} from '@material-ui/core';

import * as FileTypes from './../../constants/filetypes';

import Canvas from './../Canvas';

function RLEdecode(array) {
    var newArray = [],
        isRip,
        isRun,
        ripCount,
        runCount;
    for (var i = 0; i < array.length; i++) {
        isRip = array[i] < 0;
        isRun = array[i] > 0;
        if (isRip) {
            ripCount = Math.abs(array[i]);
            i += 1;

            newArray = newArray.concat(array.slice(i, i + ripCount));
            // console.log("rip",ripCount,array.slice(i,i+ripCount));
            i += ripCount - 1;
        }
        if (isRun) {
            runCount = array[i];
            i += 1;
            for (var j = 0; j < runCount; j++) {
                newArray.push(array[i]);
            }
        }
    }
    return newArray;
}

const toInt16 = ([int1, int2]) => (int1 << 8) | int2;
const toInt32 = ([int1, int2, int3, int4]) =>
    (int1 << 24) | (int2 << 16) | (int3 << 8) | int4;

class SpriteLoader extends Component {
    state = {
        width: 0,
        height: 0,
        image: null,
        frames: 1,
        decode: false,

        isSelectOpen: false,
        selectedPalette: -1
    };
    canvas = React.createRef();

    showImage = () => {
        const image = this.state.decode
            ? RLEdecode(this.state.image)
            : this.state.image;

        const { palette } = this.state.palettes.find(
            pal => pal.id === this.state.selectedPalette
        );

        for (let i = 0; i < image.length; i += 1) {
            const palette_key = palette[image[i]] || {};

            const rgb = [palette_key.r, palette_key.g, palette_key.b];
            const x = i % this.state.width;
            const y = Math.floor(i / this.state.width);

            this.canvas.current.putPixel(rgb, x, y);
        }
    };

    componentDidMount() {
        const image = this.props.blob;

        const frame_count = toInt16(image.subarray(0, 2));
        const width = image.subarray(2, 3)[0];
        const height = image.subarray(3, 4)[0];

        const frames = [];
        for (let i = 0; i < frame_count; i++) {
            const start = 4 + i * 4;
            const f = image.subarray(start, start + 4);

            frames.push({
                y: f[0],
                x: f[1],
                width: f[2],
                height: f[3]
            });
        }
        const start = 4 + frames.length * 4;
        const offset = toInt32(image.subarray(start, start + 4));

        const bytes = width * height;

        const data = image.subarray(start + 4, image.byteLength);

        this.setState(() => ({
            width,
            height,
            image: data,
            frames: frame_count
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
                        height={this.state.height * this.state.frames}
                    />
                </div>

                <p>
                    Width: {this.state.width} | Height: {this.state.height} |
                    Frames: {this.state.frames}
                </p>

                <Checkbox
                    onChange={(e, checked) => {
                        this.setState(() => ({
                            decode: checked
                        }));
                    }}
                    checked={this.state.decode}
                />
                <Button
                    variant="outlined"
                    disabled={this.state.selectedPalette < 0}
                    onClick={this.showImage}
                >
                    Render Sprite
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

export const SPRITE_LOADER = 'SPRITE_LOADER';
export default connect(mapStateToProps)(SpriteLoader);
