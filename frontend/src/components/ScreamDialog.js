import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'moment';

import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';

import { getScream } from '../redux/actions/dataActions';
import CustomeBtn from '../util/CustomeBtn';

const styles = (theme) => ({
    invisibleSeparator: {
      border: 'none',
      margin: 4
    },
    profileImage: {
      maxWidth: 200,
      height: 200,
      borderRadius: '50%',
      objectFit: 'cover'
    },
    dialogContent: {
      padding: 20
    },
    closeButton: {
      position: 'absolute',
      left: '90%'
    }
});

class ScreamDialog extends Component {
  state = {
    open: false
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.props.getScream(this.props.screamId);
  }

  handleClose = () => this.setState({ open: false });

  render() {
    const {
      classes,
      scream: {
        // screamId,
        body,
        createdAt,
        // likeCount,
        // commentCount,
        userImage,
        userHandle
      },
      UI: { loading }
     } = this.props;

     const dialogMarkup = loading ? (
       <CircularProgress size={200} />
     ) : (
       <Grid container spacing={16}>
         <Grid item sm={5}>
          <img src={userImage} alt={userHandle ? `${userHandle} photo..` : 'Profile Photo'} className={classes.profileImage}/>
         </Grid>
         <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {Moment(createdAt).format('h:mm a, MMMM DD YYYY')}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body1">{body}</Typography>
         </Grid>
       </Grid>
     );
    return (
      <Fragment>
        <CustomeBtn
          onClick={this.handleOpen}
          tip="Expand scream"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </CustomeBtn>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <CustomeBtn
            onClick={this.handleClose}
            tip="Close"
            tipClassName={classes.closeButton}
          >
            <CloseIcon color="primary" />
          </CustomeBtn>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  scream: state.data.scream,
  UI: state.UI
});

const mapActionsToProps = { getScream };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ScreamDialog));