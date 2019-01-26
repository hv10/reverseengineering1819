import React, { Component } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { saveWardata } from './../../actions/wardata';

import WarLoader from './WarLoader';
import FileLoader from './../FileLoader';

class WarExtractor extends Component {
    state = {
        loaded: false
    };
    loader = null;

    handleBlob = blob => {
        this.loader = new WarLoader(blob);

        this.loader.getVersion();

        if (!this.loader.isValid()) {
            console.log('No wardata file recognized');
        }

        this.loader.buildFileTable();

        this.props.setWardata(this.loader);

        this.setState(() => ({
            loaded: true
        }));
    };

    render() {
        return (
            <div>
                <FileLoader onBlob={this.handleBlob} />
                {this.state.loaded && <p>WarFile loaded</p>}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setWardata: loader => dispatch(saveWardata(loader))
});

export default connect(
    null,
    mapDispatchToProps
)(WarExtractor);
