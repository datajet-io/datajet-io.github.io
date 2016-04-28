import React from 'react';
import { Router, Link } from 'react-router';

var App = React.createClass({
    render() {
        return (
            <div>
                <div className="container">
                    {this.props && React.cloneElement(this.props.children)}
                </div>
            </div>
        );
    }
});

export default App;
