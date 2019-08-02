import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { likeScream, unlikeScream } from '../redux/actions/dataActions';
import CustomeBtn from '../util/CustomeBtn';

export class LikeButton extends Component {
    likedScream = () => {
      debugger
        if ( this.props.user.likes
                && this.props.user.likes.find((
                    like => like.screamId === this.props.screamId
                ))
            ) { return true; } else {
                return false;
            }
    }

    likeScream = () => this.props.likeScream(this.props.screamId);
    unlikeScream = () => this.props.unlikeScream(this.props.screamId);

    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
          <Link to="/login">
            <CustomeBtn tip="Like">
              <FavoriteBorder color="primary" />
            </CustomeBtn>
          </Link>
        ) : this.likedScream() ? (
          <CustomeBtn tip="Undo like" onClick={this.unlikeScream}>
            <FavoriteIcon color="primary" />
          </CustomeBtn>
        ) : (
          <CustomeBtn tip="Like" onClick={this.likeScream}>
            <FavoriteBorder color="primary" />
          </CustomeBtn>
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likeScream,
    unlikeScream
};

export default connect(
    mapStateToProps,
    mapActionsToProps
)(LikeButton);