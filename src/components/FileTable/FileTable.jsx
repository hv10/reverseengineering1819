import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Icon,
    Button
} from '@material-ui/core';
import { batchActions } from 'redux-batched-actions';
import { isEqual } from 'lodash/lang';

import { predictBlob } from '../../actions/prediction';
import { storeBlob } from '../../actions/store';
import { openModal } from '../../actions/dialog';

class FileTable extends Component {
    state = {
        page: 0,
        rowsPerPage: 10
    };

    changePage = (evt, page) => {
        this.setState(() => ({
            page
        }));
    };

    analyzeBlob = id => {
        let blob;
        const entry = this.props.file_table.find(([key]) => key === id)[1];

        if (entry.blob) {
            blob = entry.blob;
        } else {
            blob = this.props.wardata.subarray(
                entry.file_offset,
                entry.file_offset + entry.blobsize
            );
        }

        this.props.predictBlob(id, blob);
        this.props.openModal(id);
    };

    idlePredict() {
        const toBePredicted = this.props.file_table.find(
            ([_, { prediction }]) => !prediction
        );

        if (!Array.isArray(toBePredicted)) return;

        window.requestIdleCallback(() => {
            console.log(`Idle predicting ${toBePredicted[0]}`);

            if (!toBePredicted[1].prediction) {
                const blob = this.props.wardata.subarray(
                    toBePredicted[1].file_offset,
                    toBePredicted[1].file_offset + toBePredicted[1].blobsize
                );

                this.props.predictBlob(toBePredicted[0], blob);
            }
        });
    }

    componentDidUpdate() {
        this.idlePredict();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
        );
    }

    render() {
        const { page, rowsPerPage } = this.state;

        const start = page * rowsPerPage;

        return (
            <>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Offset</TableCell>
                            <TableCell>FileSize</TableCell>
                            <TableCell>Compressed</TableCell>
                            <TableCell>Prediction</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.file_table
                            .slice(start, start + rowsPerPage)
                            .map(
                                ([
                                    id,
                                    {
                                        compressed,
                                        file_offset,
                                        blobsize,
                                        prediction
                                    }
                                ]) => (
                                    <TableRow key={id}>
                                        <TableCell>{id}</TableCell>
                                        <TableCell>{file_offset}</TableCell>
                                        <TableCell>{blobsize}</TableCell>
                                        <TableCell>
                                            {compressed ? (
                                                <Icon>
                                                    check_circle_outline
                                                </Icon>
                                            ) : (
                                                <Icon>highlight_off</Icon>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {prediction ? (
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        this.props.openModal(id)
                                                    }
                                                >
                                                    Guess: {prediction.guess}
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        this.analyzeBlob(id)
                                                    }
                                                >
                                                    predict
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    page={this.state.page}
                    count={this.props.file_table.length}
                    rowsPerPage={this.state.rowsPerPage}
                    onChangePage={this.changePage}
                />
            </>
        );
    }

    static propTypes = {
        file_table: PropTypes.array
    };
}

const mapStateToProps = state => ({
    wardata: state.wardata?.data
});

const mapDispatchToProps = dispatch => ({
    predictBlob: (id, blob) =>
        dispatch(batchActions([predictBlob(id, blob), storeBlob(id, blob)])),
    openModal: id => dispatch(openModal(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FileTable);
