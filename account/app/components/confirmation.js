import React from 'react';
import { Router, Link } from 'react-router';

var ConfirmationView = React.createClass({
    render() {
        return (
            <div className="container">
                <h4>Your email is now confirmed.</h4>

                <div className="nav">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                    <Link to="/forgotpassword">Forgot Password?</Link>
                    <Link to="/logout">Logout</Link>
                </div>
            </div>
        );
    }
});

export default ConfirmationView;
