import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

import { logout } from '../../actions';
import firebase from '../../utils/firebase';

class UserBox extends Component {
    logout = () => {
        firebase.auth().signOut();
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const { user } = this.props;
        if(!user) return;
        const duration = user.currentPlan ? user.currentPlan.remainingMinutes : 0;
        return (
            <div className='user-box'>
                <Link to='/user' className='profile-link'>
                    <p className='profile-name'>
                        { this.props.user.displayName }
                        <br />
                        <span className='profile-subtext'>
                            {`${duration} mins left`}
                        </span>
                    </p>
                </Link>
                <Button variant='outline-danger' size='sm' className='sign-out' alt='Sign out' onClick={ this.logout }>
                    <FontAwesomeIcon icon={ faSignOutAlt } />
                </Button>
            </div>
        );
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { logout })(withRouter(UserBox));