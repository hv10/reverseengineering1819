import React, { Component } from 'react';

class DropDown extends Component {
    render() {
        return (
            <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                {this.props.open && this.props.children}
            </div>
        );
    }
}

export default DropDown;
