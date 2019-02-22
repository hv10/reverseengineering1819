import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.ctx = null;
        this.pixel = null;
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.canvas.current.getContext('2d');

        this.pixel = this.ctx.createImageData(1, 1);
        this.pixel.data[3] = 255;
    }

    componentDidUpdate() {
        this.canvas.current.width = this.props.width;
        this.canvas.current.height = this.props.height;
    }

    putPixel([r, g, b], x, y) {
        this.pixel.data[0] = r;
        this.pixel.data[1] = g;
        this.pixel.data[2] = b;

        this.ctx.putImageData(this.pixel, x, y);
    }

    render() {
        return (
            <canvas
                ref={this.canvas}
                width={this.props.width}
                height={this.props.height}
            />
        );
    }

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number
    };

    static defaultProps = {
        width: 256,
        height: 512
    };
}

export default Canvas;
