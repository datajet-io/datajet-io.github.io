import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import LoginView from 'components/login';
import SignupView from 'components/signup';
import ForgotPasswordView from 'components/forgot-password';
import ConfirmationView from 'components/confirmation';
import LogoutView from 'components/logout';
import NotFoundView from 'components/not-found';

import App from 'App';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

let routes = (
    <Route path="/" component={App}>
        <IndexRoute component={LoginView} />
        <Route path="login" component={LoginView} />
        <Route path="signup" component={SignupView} />
        <Route path="forgotpassword" component={ForgotPasswordView} />
        <Route path="confirmation" component={ConfirmationView} />
        <Route path="logout" component={LogoutView} />
        <Route path="/*" component={NotFoundView} />
    </Route>
);

ReactDOM.render(<Router history={appHistory}>{routes}</Router>, document.getElementById('wrapper'));
