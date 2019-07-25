import React, { Component } from 'react'
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Scream from '../components/Scream';
export class home extends Component {
    state = {
        screms: null
    };

    recentScreamsMarkup = null;
    componentDidMount() {
        axios
          .get('/screams')
          .then((res) => {
            // @TODO: Handle This Inside Render Function..
            this.recentScreamsMarkup = res.data.map((scream) => <Scream scream={scream} />)
            this.setState({
              screams: res.data
            });
          })
          .catch((err) => console.log(err));
      }
    render() {
        return (
            <Grid container spacing={15}>
                <Grid item sm={8} xs={12}>
                    { this.recentScreamsMarkup ? this.recentScreamsMarkup : <p> Loading... </p> }
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile...</p>
                </Grid>
            </Grid>
        )
    }
}

export default home;