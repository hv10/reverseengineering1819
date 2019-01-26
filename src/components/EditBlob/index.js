import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Tabs,
    Tab,
    Paper
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { closeModal } from './../../actions/dialog';

import BlobInfo from './BlobInfo';
import FileTest from './FileTestTab';

const styles = {
    root: {
        flexGrow: 1
    }
};

class EditModal extends Component {
    state = {
        currentTab: 0
    };

    switchTab = (e, currentTab) => {
        this.setState(() => ({
            currentTab
        }));
    };

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                open={this.props.isDialogOpen}
                onClose={this.props.closeDialog}
            >
                <DialogTitle>
                    Blob: <i>{this.props.data.name || this.props.data.id}</i>
                </DialogTitle>
                <DialogContent>
                    {this.state.currentTab === 0 ? <BlobInfo /> : <FileTest />}
                </DialogContent>
                <Paper>
                    <Tabs
                        color="primary"
                        indicatorColor="primary"
                        value={this.state.currentTab}
                        onChange={this.switchTab}
                    >
                        <Tab className={classes.root} label="Edit" />
                        <Tab className={classes.root} label="Test" />
                    </Tabs>
                </Paper>
            </Dialog>
        );
    }

    static propTypes = {
        isDialogOpen: PropTypes.bool.isRequired,
        data: PropTypes.object
    };
}

const mapStateToProps = state => ({
    isDialogOpen: state.dialog.open,

    closeDialog: PropTypes.func.isRequired,
    data: {
        id: state.dialog.id,
        name: state.datastore[state.dialog.id]?.name //name, blob, real filetype
    }
});

const mapDispatchToProps = dispatch => ({
    closeDialog: () => dispatch(closeModal())
});

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(EditModal)
);
