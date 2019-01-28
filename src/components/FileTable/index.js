import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Toolbar,
    Paper,
    Typography,
    Tooltip,
    IconButton,
    Icon,
    FormControlLabel,
    FormGroup,
    Checkbox
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import FileTable from './FileTable';
import DropDown from './../DropDown';

import * as FileTypes from './../../constants/filetypes';

const SORT_FILTER = {
    empty: ([key, { blobsize }]) => blobsize > 0,
    pallette: ([key, { blobsize }]) => blobsize === 2056,
    audio: ([key, { filetype }]) => filetype === FileTypes.AUDIO,
    sprite: ([key, { filetype }]) => filetype === FileTypes.SPRITE,
    image: ([key, { filetype }]) => filetype === FileTypes.IMAGE,
    text: ([key, { filetype }]) => filetype === FileTypes.TEXT
};

const styles = {
    topbar: {
        display: 'flex',
        justifyContent: 'space-between'
    }
};

class TableWrapper extends Component {
    state = {
        filter: [],
        dropDownOpen: false
    };

    toggleDropDown = () => {
        this.setState(state => ({
            dropDownOpen: !state.dropDownOpen
        }));
    };

    toggleFilter = e => {
        e.persist();

        const isActive = this.state.filter.indexOf(e.target.value);

        this.setState(state => ({
            filter:
                isActive >= 0
                    ? state.filter.filter(t => t !== e.target.value)
                    : [...state.filter, e.target.value]
        }));
    };

    static getDerivedStateFromProps(props, state) {
        let table = [];
        for (let filter of state.filter) {
            table = [...table, ...props.file_table.filter(SORT_FILTER[filter])];
        }

        return {
            ...state,
            file_table:
                table.length === 0 && state.filter.length === 0
                    ? props.file_table
                    : table
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper>
                <Toolbar className={classes.topbar}>
                    <Typography variant="h5">
                        <span>File Table</span>
                        {this.state.file_table.length > 0 && (
                            <span>
                                {' '}
                                | {this.state.file_table.length} files found
                            </span>
                        )}
                    </Typography>
                    <Tooltip title="Filter" onClick={this.toggleDropDown}>
                        <IconButton>
                            <Icon>sort</Icon>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <DropDown open={this.state.dropDownOpen}>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Not empty"
                            value="empty"
                            onChange={this.toggleFilter}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Show pallette"
                            value="pallette"
                            onChange={this.toggleFilter}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Show audios"
                            value="audio"
                            onChange={this.toggleFilter}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Show sprites"
                            value="sprite"
                            onChange={this.toggleFilter}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Show images"
                            value="image"
                            onChange={this.toggleFilter}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Show Text"
                            value="text"
                            onChange={this.toggleFilter}
                        />
                    </FormGroup>
                </DropDown>
                <FileTable file_table={this.state.file_table} />
            </Paper>
        );
    }
}

const mapStateToProps = state => ({
    file_table: Object.entries(state.wardata?.file_table).map(([key, val]) => [
        state.datastore[key]?.name || key,
        {
            ...val,
            blob: state.datastore[key]?.blob,
            prediction: state.prediction[key],
            filetype: state.datastore[key]?.filetype
        }
    ])
});

export default withStyles(styles)(connect(mapStateToProps)(TableWrapper));
