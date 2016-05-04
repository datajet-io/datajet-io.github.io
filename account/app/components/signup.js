import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

import { Router, Link } from 'react-router';

class SignupView extends App {
    constructor(props) {
        super(props);

        this._bind('handleEmailChange', 'handlePasswordChange', 'handleKeyPress', 'onSubmitForm', 'handleEmailFocus', 'handlePasswordFocus');

        this.state = {
            email: '',
            password: '',
            auth: false
        };
    }

    onSubmitForm() {
        var email = this.state.email;
        var password = this.state.password;

        this.setState({emailWarning: null, passwordWarning: null});

        if (!this.validateEmail(email)) {
            this.setState({emailWarning: 'Please enter a valid email address'});
            ReactDOM.findDOMNode(this.refs.email).focus();
        } else if (password.length < 6) {
            this.setState({passwordWarning: 'Password should be at least 6 chars'});
            ReactDOM.findDOMNode(this.refs.password).focus();
        } else {
            fetch('https://auth.datajet.io/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then((data) => {
                return data.json();
            }).then((response) => {
                if (response.status === 'ok')
                    this.setState({auth: true});
                else if(response.status === 'error')
                    this.setState({passwordWarning: response.message});
            }).catch((e) => {
                console.log(e);
            });
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.onSubmitForm();
        }
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handleEmailFocus() {
        this.setState({passwordWarning: null});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handlePasswordFocus() {
        this.setState({emailWarning: null});
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.email).focus();
    }

    render() {
        return (
            <div className="container">
                <h4>Create your free datajet account to get started.</h4>

                {!this.state.auth &&
                <div>
                    <div className="input-holder">
                        <input className="input"
                               ref="email"
                               type="text"
                               placeholder="Enter your e-mail address"
                               onChange={this.handleEmailChange}
                               onKeyPress={this.handleKeyPress}
                               onFocus={this.handleEmailFocus}
                        />
                        <span className="bar"></span>
                        {this.state.emailWarning && <div className="warning">{this.state.emailWarning}</div>}
                    </div>

                    <div className="input-holder">
                        <input className="input"
                               ref="password"
                               type="password"
                               placeholder="Choose a password"
                               onChange={this.handlePasswordChange}
                               onKeyPress={this.handleKeyPress}
                               onFocus={this.handlePasswordFocus}
                        />
                        <span className="bar"></span>
                        {this.state.passwordWarning && <div className="warning">{this.state.passwordWarning}</div>}
                    </div>

                    <div className="input-holder">
                        <input type="submit" value="Sign up" className="submit" onClick={this.onSubmitForm}/>
                    </div>
                </div>
                }

                {this.state.auth &&
                    <div className="success">Registration successful. Please check your email for instructions</div>
                }

                <div className="nav">
                    <Link to="/login">Login</Link>
                    <Link to="/forgotpassword">Forgot Password?</Link>
                </div>

            </div>
        );
    }
}

export default SignupView;
