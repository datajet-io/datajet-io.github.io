import React from 'react';
import { Router, Link } from 'react-router';

class App extends React.Component {

    _bind(...methods) {
        methods.forEach( (method) => this[method] = this[method].bind(this) );
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    render() {
        return (
            <div>
                <img className="logo" src="logo.svg" alt="datajet" />

                <ul className="nav">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/forgotpassword">Forgot Password</Link></li>
                </ul>

                <div className="box">
                    <h3>Welcome to datajet!</h3>
                    {this.props && React.cloneElement(this.props.children)}
                </div>
            </div>
        );
    }
}

export default App;
