import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class ExternalWindow extends PureComponent {
    container = document.createElement('div');
    externalWindow = null;

    componentDidMount() {
        this.externalWindow = window.open(
            '',
            '',
            'width=600,height=400,left=200,top=200'
        );
        this.externalWindow.document.body.appendChild(this.container);
        this.externalWindow.addEventListener(
            'beforeunload',
            this.props.closeWindow
        );
    }

    componentWillUnmount() {
        this.externalWindow.close();
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.container);
    }

    static propTypes = {
        closeWindow: PropTypes.func.isRequired
    };
}

export default ExternalWindow;
