import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

import { Router, Link } from 'react-router';

class ForgotPasswordView extends App {
    constructor(props) {
        super(props);

        this._bind('handleEmailChange', 'handleEmailFocus', 'handleKeyPress', 'onSubmitForm');

        this.state = {
            email: '',
            success: false
        };
    }

    onSubmitForm() {
        var email = this.state.email;

        this.setState({emailWarning: null});

        if (!this.validateEmail(email)) {
            if (email.length > 0) {
                this.setState({emailWarning: 'Please enter a valid email address'});
            }
            ReactDOM.findDOMNode(this.refs.email).focus();
        } else {
            this.setState({success: true});
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
        this.setState({usernameWarning: null, passwordWarning: null});
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.email).focus();
    }

    render() {
        return (
            <div className="container">
                <h4>Forgot your password?</h4>

                {!this.state.success &&
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
                        <input type="submit" value="Reset my password" className="submit" onClick={this.onSubmitForm}/>
                    </div>
                </div>
                }

                {this.state.success &&
                <div className="success">Please check your email for resetting your password</div>
                }

            </div>
        );
    }
}

export default ForgotPasswordView;
