import React, { Component } from 'react'
import Link from 'react-router-dom/Link';

import AppBar from  '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from  '@material-ui/core/Button';

export class Nav extends Component {
    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar className="nav-container">
                        <Button color="inhirit" component={Link} to="/login">Login</Button>
                        <Button color="inhirit" component={Link} to="/">Home</Button>
                        <Button color="inhirit" component={Link} to="/signup">Signup</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default Nav
