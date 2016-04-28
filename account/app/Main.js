require('../css/datajet.css');
require('bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import LoginView from 'components/login';
import SignupView from 'components/signup';
import ForgetPasswordView from 'components/forget-password';
import App from 'App';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

let routes = (
    <Route path="/" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="login" component={LoginView} />
        <Route path="signup" component={SignupView} />
        <Route path="forget-password" component={ForgetPasswordView} />
        <Route path="/*" component={NotFoundView} />
    </Route>
);

Pace.start({ document: true });

ReactDOM.render(<Router onUpdate={() => window.scrollTo(0, 0)} history={appHistory}>{routes}</Router>, document.getElementById('wrapper'));
