import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { postScream, clearErrors } from '../redux/actions/dataActions';
import CustomeBtn from '../util/CustomeBtn';

const styles = (theme) => ({
  submitButton: {
    position: 'relative',
    float: 'right',
    marginTop: 10
  },
  progressSpinner: {
    position: 'absolute'
  },
  closeButton: {
    position: 'absolute',
    left: '90%',
    top: '10%'
  },
  textField: {
      margin: '10px auto 10px auto'
  }
});

class PostScream extends Component {
  state = {
    open: false,
    body: '',
    errors: {}
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.UI.errors) {
        this.setState({ errors: nextProps.UI.errors });
    }

    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '', open: false, errors: {} });
    }
  }

    handleOpen = () => this.setState({ open: true });

    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false, errors: {} });
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    handleSubmit = e => {
        e.preventDefault();
        // @TODO: HANDLE FRONTEND VALIDATION..
        this.props.postScream({ body: this.state.body });
    }
  render() {
    const { errors, open } = this.state;
    const { classes, UI: { loading }} = this.props;

    return (
      <Fragment>
        <CustomeBtn tip="Post a Scream!" onClick={this.handleOpen}>
          <AddIcon />
        </CustomeBtn>
        <Dialog
          open={open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
            <CustomeBtn tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                <CloseIcon />
            </CustomeBtn>
            <DialogTitle>Post a new scream</DialogTitle>
            <DialogContent>
                <form onSubmit={this.handleSubmit}>
                <TextField
                    name="body"
                    type="text"
                    placeholder="Maybe scream on your mind?"
                    multiline
                    rows="3"
                    label="Scream"
                    error={errors.body ? true : false }
                    helperText={errors.body}
                    className={classes.textField}
                    onChange={this.handleChange}
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                    disabled={loading}
                >
                    Submit
                    {loading && (
                    <CircularProgress
                        size={30}
                        className={classes.progressSpinner}
                    />
                    )}
                </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostScream.propTypes = {
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { postScream, clearErrors }
)(withStyles(styles)(PostScream));