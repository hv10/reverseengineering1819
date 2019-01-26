import React from 'react';
import ReactDOM from 'react-dom';

import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';

import store from './reducer';

import App from './app';

ReactDOM.render(
    <>
        <Helmet>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
        </Helmet>
        <Provider store={store}>
            <App />
        </Provider>
    </>,
    document.getElementById('app')
);
