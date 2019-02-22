import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';

import TextLoader, { TEXT_LOADER } from './../TextLoader';
import AudioLoader, { AUDIO_LOADER } from './../AudioLoader';
import ImageLoader, { IMAGE_LOADER } from './../ImageLoader';
import SpriteLoader, { SPRITE_LOADER } from './../SpriteLoader';

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
                <button onClick={this.testBlob(IMAGE_LOADER)}>
                    Check if image
                </button>
                <button onClick={this.testBlob(SPRITE_LOADER)}>
                    Check if sprite
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
                                case IMAGE_LOADER: {
                                    return (
                                        <ImageLoader
                                            blob={this.props.blob}
                                            id={this.props.id}
                                        />
                                    );
                                }
                                case SPRITE_LOADER: {
                                    return (
                                        <SpriteLoader
                                            blob={this.props.blob}
                                            id={this.props.id}
                                        />
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
        blob: PropTypes.object
    };
}

const mapStateToProps = state => ({
    id: state.dialog.id,
    blob: state.datastore[state.dialog.id]?.blob
});

export default connect(mapStateToProps)(FileTestTab);
