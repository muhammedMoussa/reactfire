import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from  '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from  '@material-ui/core/Button';

import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

import CustomeBtn from '../util/CustomeBtn';
import PostScream from './PostScream';

export class Nav extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <div>
                <AppBar>
                    <Toolbar className="nav-container">
                        { authenticated ? (
                            <Fragment>
                                <PostScream />
                                <Link to="/">
                                    <CustomeBtn tip="Home">
                                        <HomeIcon />
                                    </CustomeBtn>
                                </Link>
                                <CustomeBtn tip="Notifications">
                                    <Notifications />
                                </CustomeBtn>
                            </Fragment>
                ) : (
                        <Fragment>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/">
                                Home
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                Signup
                            </Button>
                        </Fragment>
                )}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

Nav.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Nav);
