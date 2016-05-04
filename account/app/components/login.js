import React from 'react';
import ReactDOM from 'react-dom';
import ReactCookie from 'react-cookie';
import App from 'App';

import { Router, Link } from 'react-router';

class LoginView extends App {
    constructor(props) {
        super(props);

        this._bind('handleEmailChange', 'handlePasswordChange', 'handleKeyPress', 'onSubmitForm', 'handleEmailFocus', 'handlePasswordFocus');

        this.state = {
            username: '',
            password: '',
            auth: ReactCookie.load('auth_token') ? true : false
        };
    }

    onSubmitForm() {
        var email = this.state.email;
        var password = this.state.password;

        this.setState({emailWarning: null, passwordWarning: null});

        if (!this.validateEmail(email)) {
            this.setState({emailWarning: 'Please enter a valid e-mail address'});
            ReactDOM.findDOMNode(this.refs.email).focus();
        } else if (password.length < 6) {
            this.setState({passwordWarning: 'Password should be at least 6 chars'});
            ReactDOM.findDOMNode(this.refs.password).focus();
        } else {
            fetch('https://auth.datajet.io/login', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then((data) => {
                return data.json();
            }).then((response) => {
                if (response.status === 'ok') {
                    this.setState({auth: true});
                    //document.cookie = "auth_token= MTQ2MjM3NDQ0NXxEdi1CQkFFQ180SUFBUkFCRUFBQVNQLUNBQUVHYzNSeWFXNW5EQWdBQm5WelpYSnBaQVp6ZEhKcGJtY01LZ0FvWWprMk9HVTNPR1ZpTkRJd1pHTmxOelZrTUdFME5USTRNVFpsWldGa09URTBZVFppWXpBMU5nPT186eRL; expires=Thu, 18 Dec 2017 12:00:00 UTC; path=/";
                }
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
        this.setState({usernameWarning: null});
    }

    componentDidMount() {
        if (this.state.auth === false)
            ReactDOM.findDOMNode(this.refs.email).focus();
    }

    render() {
        return (
            <div className="container">
                {!this.state.auth &&
                <div>
                    <h4>Login to your account for awesomeness</h4>

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
                               placeholder="Enter your password"
                               onChange={this.handlePasswordChange}
                               onKeyPress={this.handleKeyPress}
                               onFocus={this.handlePasswordFocus}
                        />
                        <span className="bar"></span>
                        {this.state.passwordWarning && <div className="warning">{this.state.passwordWarning}</div>}
                    </div>

                    <div className="input-holder">
                        <input type="submit" value="Log in" className="submit" onClick={this.onSubmitForm}/>
                    </div>


                    <div className="nav">
                        <Link to="/signup">Signup</Link>
                        <Link to="/forgotpassword">Forgot Password?</Link>
                    </div>
                </div>
                }

                {this.state.auth &&
                <div>
                    <h4>You are now logged in</h4>

                    <div className="nav">
                        <Link to="/logout">Logout</Link>
                        <Link to="/forgotpassword">Forgot Password?</Link>
                    </div>
                </div>
                }

            </div>
        );
    }
}

export default LoginView;
