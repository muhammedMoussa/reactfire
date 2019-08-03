import { SET_SCREAMS,
         LOADING_DATA,
         LIKE_SCREAM,
         UNLIKE_SCREAM,
         DELETE_SCREAM,
         POST_SCREAM,
         LOADING_UI,
         CLEAR_ERRORS,
         SET_ERRORS,
         SET_SCREAM,
         STOP_LOADING_UI,
         SUBMIT_COMMENT } from '../types';
import axios from 'axios';

export const getScreams = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/screams').then((res) => {
        dispatch({
            type: SET_SCREAMS,
            payload: res.data
        });
        })
        .catch((err) => {
            // @TODO: PATCH ERROR
            dispatch({
                type: SET_SCREAMS,
                payload: []
            });
        });
}

export const likeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_SCREAM,
                payload: res.data
            });
      })
      .catch((err) => console.log(err));
}

export const unlikeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_SCREAM,
                payload: res.data
            });
      })
      .catch((err) => console.log(err));
}

export const deleteScream = screamId => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.delete(`/scream/${screamId}`).then(() => {
        dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .then(() => {
        dispatch(getScreams());
    })
    .catch((err) => console.log(err));
}

export const postScream = scream => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.post(`/screams`, scream).then((res) => {
        dispatch({ type: POST_SCREAM, payload: res.data });
        dispatch({ type: CLEAR_ERRORS });
    })
    .then(() => {
        dispatch(getScreams());
    })
    .catch((err) => {
        dispatch(clearErrors());
        console.log(err)
    });
}

export const getScream = (screamId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/screams/${screamId}`).then((res) => {
        dispatch({
          type: SET_SCREAM,
          payload: res.data
        });
        dispatch({ type: STOP_LOADING_UI });
      })
      .catch((err) => console.log(err));
};

export const submitComment = (screamId, commentData) => (dispatch) =>{
    axios.post(`/scream/${screamId}/comment`, commentData).then(res => {
        dispatch({
            type: SUBMIT_COMMENT,
            payload: res.data
        });
        dispatch(clearErrors());
    })
    .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data
        });
    });
}

export const getUserData = userHandle => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
      .get(`/user/${userHandle}`)
      .then((res) => {
        dispatch({
          type: SET_SCREAMS,
          payload: res.data.screams
        });
      })
      .catch(() => {
        dispatch({
          type: SET_SCREAMS,
          payload: null
        });
      });
};
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};