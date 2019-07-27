import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

import { updateUserData } from '../redux/actions/userActions';
import CustomeBtn from '../util/CustomeBtn';

const styles = (theme) => ({
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        float: 'right'
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    }
});

class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    };

    mapUserDetailsToState = credentials => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
        this.mapUserDetailsToState(this.props.credentials);
    }

    handleClose = () => this.setState({ open: false });

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleSubmit = () => {
        debugger
        const bio = this.state.bio;
        const website = this.state.website;
        const location = this.state.location;

        if (bio.trim() === '' && website.trim() === '' && location.trim() === '') {
            // @TODO: CONFIG SNACKBAR.. ADD MORE VALIDATION..
            return;
        }

        const userDetails = {
            bio,
            website,
            location,
        }

        this.props.updateUserData(userDetails);
        this.handleClose();
    }

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <CustomeBtn
                  tip="Edit Informations"
                  onClick={this.handleOpen}
                  btnClassName={classes.button}
                >
                  <EditIcon color="primary" />
                </CustomeBtn>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Edit your informations</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="Who are you?"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="website"
                                tpye="text"
                                label="Website"
                                placeholder="Your personal/professinal website"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="location"
                                tpye="text"
                                label="Location"
                                placeholder="Where you live"
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary"> Cancel </Button>
                        <Button onClick={this.handleSubmit} color="primary"> Save </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

EditDetails.propTypes = {
    updateUserData: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({ credentials: state.user.credentials });

export default connect(mapStateToProps, { updateUserData })(withStyles(styles)(EditDetails))