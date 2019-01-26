import React, { Component } from 'react';

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const TextLoader = ({ blob }) => (
    <p
        style={{
            wordBreak: 'break-all'
        }}
    >
        {ab2str(blob).substr(0, 250)}
    </p>
);

export const TEXT_LOADER = 'TEXT_LOADER';
export default React.memo(TextLoader);
