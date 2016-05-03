import React from 'react';
import { Router, Link } from 'react-router';

var NotFoundView = React.createClass({
    render() {
        return (
            <div className="container">
                <h4>Page not found :(</h4>
            </div>
        );
    }
});

export default NotFoundView;
