import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';

import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import WarExtractor from './components/WarExtractor';
import FileTable from './components/FileTable';
import EditModal from './components/EditBlob';

import styles from './index.scss';

const style = {
    topbar: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    text: {
        color: 'white'
    }
};

class App extends Component {
    render() {
        const { classes, version, endianess } = this.props;

        return (
            <>
                <AppBar position="static">
                    <Toolbar className={classes.topbar}>
                        <Typography className={classes.text} variant="h4">
                            WarExtractor
                        </Typography>
                        {version && (
                            <Typography variant="h6" className={classes.text}>
                                Version: {version} for {endianess} endianess
                            </Typography>
                        )}
                    </Toolbar>
                </AppBar>

                <main id={styles.main}>
                    <WarExtractor />
                    <FileTable />
                </main>

                {<EditModal />}
            </>
        );
    }
}

const mapStateToProps = state => ({
    version: state.wardata.version,
    endianess: state.wardata.endianess
});

export default hot(connect(mapStateToProps)(withStyles(style)(App)));

/**
 * 
 * <label>
                    Fast mode
                    <input
                        type="checkbox"
                        onChange={this.setRenderMode}
                        checked={fast}
                    />
                </label>

                {selectedPallete && (
                    <p>Palette selected {selectedPallete.substr(0, 5)}</p>
                )}

                {Object.keys(palette).map(key => (
                    <button key={key} onClick={this.usePallette(key)}>
                        Pallete {key.substr(0, 5)}
                    </button>
                ))}

                <FileLoader getBlob={this.extractPalette} />
                <FileLoader
                    getBlob={this.handleBlob}
                    disabled={!selectedPallete}
                />
                
 */
