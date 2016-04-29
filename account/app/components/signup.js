import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

import { Router, Link } from 'react-router';

class SignupView extends App {
    constructor(props) {
        super(props);

        this._bind('handleUsernameChange', 'handleEmailChange', 'handlePasswordChange', 'handleKeyPress', 'onSubmitForm', 'handleUsernameFocus', 'handleEmailFocus', 'handlePasswordFocus');

        this.state = {
            username: '',
            email: '',
            password: '',
            success: false
        };
    }

    onSubmitForm() {
        var username = this.state.username;
        var email = this.state.email;
        var password = this.state.password;

        this.setState({usernameWarning: null, emailWarning: null, passwordWarning: null});

        if (username.length < 6) {
            if (username.length > 0) {
                this.setState({usernameWarning: 'Username should be at least 6 chars'});
            }
            ReactDOM.findDOMNode(this.refs.username).focus();
        } else if (!this.validateEmail(email)) {
            if (email.length > 0) {
                this.setState({emailWarning: 'Please enter a valid email address'});
            }
            ReactDOM.findDOMNode(this.refs.email).focus();
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

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleUsernameFocus() {
        this.setState({emailWarning: null, passwordWarning: null});
    }

    handleEmailFocus() {
        this.setState({usernameWarning: null, passwordWarning: null});
    }

    handlePasswordFocus() {
        this.setState({usernameWarning: null, emailWarning: null});
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.username).focus();
    }

    render() {
        return (
            <div className="container">
                <h4>Create your free datajet account to get started.</h4>

                    {!this.state.success &&
                    <div>
                        <div className="input-holder">
                            <input ref="username"
                                   type="text"
                                   placeholder="Choose a username"
                                   onChange={this.handleUsernameChange}
                                   onKeyPress={this.handleKeyPress}
                                   onFocus={this.handleUsernameFocus}
                            />
                            {this.state.usernameWarning && <div className="warning">{this.state.usernameWarning}</div>}
                        </div>

                        <div className="input-holder">
                            <input ref="email"
                                   type="text"
                                   placeholder="Enter your e-mail address"
                                   onChange={this.handleEmailChange}
                                   onKeyPress={this.handleKeyPress}
                                   onFocus={this.handleEmailFocus}
                            />
                            {this.state.emailWarning && <div className="warning">{this.state.emailWarning}</div>}
                        </div>

                        <div className="input-holder">
                            <input ref="password"
                                   type="password"
                                   placeholder="Choose a password"
                                   onChange={this.handlePasswordChange}
                                   onKeyPress={this.handleKeyPress}
                                   onFocus={this.handlePasswordFocus}
                            />
                            {this.state.passwordWarning && <div className="warning">{this.state.passwordWarning}</div>}
                        </div>

                        <div className="input-holder">
                            <input type="submit" value="Sign up" className="submit" onClick={this.onSubmitForm}/>
                        </div>
                    </div>
                    }

                    {this.state.success &&
                        <div className="success">Registration successful. Please check your email for instructions</div>
                    }

            </div>
        );
    }
}

export default SignupView;
