import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    DialogContentText,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Button
} from '@material-ui/core';

import * as FileTypes from './../../constants/filetypes';

class BlobInfo extends Component {
    state = {
        value: FileTypes.UNKNOWN,
        isSelectOpen: false
    };

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

    setType = e => {
        this.setState(() => ({
            value: e.target.value
        }));
    };
    render() {
        return (
            <>
                <DialogContentText>
                    Entropy of blob: <b>{this.props.entropy}</b> - Guessed file
                    type is <b>{this.props.guess}</b>
                </DialogContentText>
                <FormControl>
                    <InputLabel>Choose file type</InputLabel>
                    <Select
                        open={this.state.isSelectOpen}
                        value={this.state.value}
                        onOpen={this.openSelect}
                        onClose={this.closeSelect}
                        onChange={this.setType}
                    >
                        {Object.keys(FileTypes).map(key => (
                            <MenuItem key={key} value={key}>
                                {key}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button>Save choice</Button>
                </FormControl>
            </>
        );
    }
}

const mapStateToProps = state => ({
    ...state.prediction[state.dialog.id],
    filetype: state.datastore[state.dialog.id]?.filetype //entropy and guess
});

export default connect(mapStateToProps)(BlobInfo);
