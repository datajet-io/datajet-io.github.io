import React from 'react';
import ReactDOM from 'react-dom';
import ReactCookie from 'react-cookie';
import App from 'App';

import { Router, Link } from 'react-router';

class LogoutView extends App {
    constructor(props) {
        super(props);

        this.state = {
            auth: false
        };

        fetch('https://auth.datajet.io/logout', {
            method: 'POST',
            credentials: 'include'
        }).then((data) => {
            return data.json();
        }).then((response) => {
            if (response.status === 'ok') {
                this.setState({auth: true});
                //ReactCookie.remove('auth_token');
            }
            else if(response.status === 'error')
                this.setState({auth: false});
        }).catch((e) => {
            console.log(e);
        });
    }

    render() {
        return (
            <div className="container">
                {this.state.auth &&
                    <div className="success">You are now safely logged out.</div>
                }

                <div className="nav">
                    <Link to="/login">Login</Link>
                    <Link to="/forgotpassword">Forgot Password?</Link>
                </div>
            </div>


        );
    }
}

export default LogoutView;
