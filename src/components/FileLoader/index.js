import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class FileLoader extends Component {
    handleFile = e => {
        for (let file of e.target.files) {
            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.addEventListener('load', () => {
                this.props.onBlob(reader.result);
            });
        }
    };

    render() {
        const disabled = this.props.disabled ? 'disabled' : '';

        return (
            <>
                <Button variant="contained" component="label">
                    <input
                        multiple
                        type="file"
                        onChange={this.handleFile}
                        disabled={disabled}
                        style={{
                            display: 'none'
                        }}
                    />
                    Upload WarFile
                </Button>
            </>
        );
    }

    static propTypes = {
        onBlob: PropTypes.func.isRequired,

        disabled: PropTypes.bool
    };

    static defaultProps = {
        disabled: false
    };
}

export default FileLoader;
