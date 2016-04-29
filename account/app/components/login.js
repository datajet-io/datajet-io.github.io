import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

import { Router, Link } from 'react-router';

class LoginView extends App {
    constructor(props) {
        super(props);

        this._bind('handleUsernameChange', 'handlePasswordChange', 'handleKeyPress', 'onSubmitForm', 'handleUsernameFocus', 'handlePasswordFocus');

        this.state = {
            username: '',
            password: '',
            success: false
        };
    }

    onSubmitForm() {
        var username = this.state.username;
        var password = this.state.password;

        this.setState({usernameWarning: null, passwordWarning: null});

        if (username.length < 6) {
            if (username.length > 0) {
                this.setState({usernameWarning: 'Username should be at least 6 chars'});
            }
            ReactDOM.findDOMNode(this.refs.username).focus();
        } else if (password.length < 6) {
            if (password.length > 0) {
                this.setState({passwordWarning: 'Password should be at least 6 chars'});
            }
            ReactDOM.findDOMNode(this.refs.password).focus();
        } else {
            this.setState({success: true});
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.onSubmitForm();
        }
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleUsernameFocus() {
        this.setState({passwordWarning: null});
    }

    handlePasswordFocus() {
        this.setState({usernameWarning: null});
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.username).focus();
    }

    render() {
        return (
            <div className="container">
                <h4>Login to your account</h4>

                {!this.state.success &&
                <div>
                    <div className="input-holder">
                        <input ref="username"
                               type="text"
                               placeholder="Enter your username"
                               onChange={this.handleUsernameChange}
                               onKeyPress={this.handleKeyPress}
                               onFocus={this.handleUsernameFocus}
                        />
                        {this.state.usernameWarning && <div className="warning">{this.state.usernameWarning}</div>}
                    </div>

                    <div className="input-holder">
                        <input ref="password"
                               type="password"
                               placeholder="Enter your password"
                               onChange={this.handlePasswordChange}
                               onKeyPress={this.handleKeyPress}
                               onFocus={this.handlePasswordFocus}
                        />
                        {this.state.passwordWarning && <div className="warning">{this.state.passwordWarning}</div>}
                    </div>

                    <div className="input-holder">
                        <input type="submit" value="Log in" className="submit" onClick={this.onSubmitForm}/>
                    </div>
                </div>
                }

                {this.state.success &&
                <div className="success">Welcome to datajet!</div>
                }

            </div>
        );
    }
}

export default LoginView;
