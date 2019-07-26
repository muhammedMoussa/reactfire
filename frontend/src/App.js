import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';
import { Provider } from 'react-redux';

import './App.css';
import Nav from './components/Nav';
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import themeObject from './util/theme';
import AuthRoute from './util/AuthRoute';
import store from './redux/store';

const theme = createMuiTheme(themeObject);

let authenticated;
const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    authenticated = false;
    window.location.href = '/login';
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Nav />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} authenticated={authenticated} />
                <AuthRoute exact path="/signup" component={signup} authenticated={authenticated} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
