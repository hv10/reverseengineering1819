import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileLoader extends Component {
    handleFile = e => {
        for (let file of e.target.files) {
            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.addEventListener('load', () => {
                this.props.getBlob(reader.result);
            });
        }
    };

    render() {
        const disabled = this.props.disabled ? 'disabled' : '';

        return (
            <div>
                <input
                    multiple
                    type="file"
                    onChange={this.handleFile}
                    disabled={disabled}
                />
            </div>
        );
    }

    static propTypes = {
        getBlob: PropTypes.func.isRequired,

        disabled: PropTypes.bool
    };

    static defaultProps = {
        disabled: false
    };
}

export default FileLoader;
