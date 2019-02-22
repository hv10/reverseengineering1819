import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    DialogContentText,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Button,
    TextField
} from '@material-ui/core';

import * as FileTypes from './../../constants/filetypes';

import { setFileType, setFileName } from './../../actions/store';

class BlobInfo extends Component {
    state = {
        value: FileTypes.UNKNOWN,
        isSelectOpen: false,
        filename: ''
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

    updateFileName = e => {
        const value = e.target.value;

        this.setState(() => ({
            filename: value
        }));
    };

    save = () => {
        this.props.setFileType(this.state.value);

        if (this.state.filename) {
            this.props.setFileName(this.props.id, this.state.filename);
        }
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

                    <TextField
                        label="Filename"
                        onChange={this.updateFileName}
                        defaultValue={this.props.name || this.props.id}
                    />

                    <Button variant="outlined" onClick={this.save}>
                        Save choice
                    </Button>
                </FormControl>
            </>
        );
    }
}

const mapStateToProps = state => ({
    id: state.dialog.id,
    ...state.prediction[state.dialog.id],
    ...state.datastore[state.dialog.id]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setFileType: type => dispatch(setFileType(ownProps.id, type)),
    setFileName: (id, name) => dispatch(setFileName(id, name))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BlobInfo);
