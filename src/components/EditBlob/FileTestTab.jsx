import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';

import TextLoader, { TEXT_LOADER } from './../TextLoader';
import AudioLoader, { AUDIO_LOADER } from './../AudioLoader';

class FileTestTab extends Component {
    state = {
        test: ''
    };

    closeWindow = () => {
        this.setState(() => ({
            test: ''
        }));
    };

    testBlob = type => () => {
        this.setState(() => ({
            test: type
        }));
    };

    render() {
        return (
            <>
                <Typography variant="h6">Choose Test</Typography>
                <button onClick={this.testBlob(TEXT_LOADER)}>
                    Check if text
                </button>
                <button onClick={this.testBlob(AUDIO_LOADER)}>
                    Check if audio
                </button>
                {this.state.test && (
                    <div>
                        {(() => {
                            switch (this.state.test) {
                                case TEXT_LOADER: {
                                    return (
                                        <TextLoader blob={this.props.blob} />
                                    );
                                }
                                case AUDIO_LOADER: {
                                    return (
                                        <AudioLoader blob={this.props.blob} />
                                    );
                                }
                                default: {
                                    return <p>Who toucha my spaget ?</p>;
                                }
                            }
                        })()}
                    </div>
                )}
            </>
        );
    }

    static propTypes = {
        blob: PropTypes.object.isRequired
    };
}

const mapStateToProps = state => ({
    blob: state.datastore[state.dialog.id].blob
});

export default connect(mapStateToProps)(FileTestTab);
