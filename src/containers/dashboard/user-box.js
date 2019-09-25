import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

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
        let currentPath = this.props.history.location.pathname;
        let goToUrlOnClick = currentPath.startsWith('/dashboard') ? '/user' : '/dashboard';
        return (
            <div className='user-box'>
                <Link to={ goToUrlOnClick } className='profile-link'>
                    <div className='profile-name'>
                        {
                            currentPath.startsWith('/dashboard') &&
                            <div>
                                <FormattedMessage id="Header.myAccount" />
                                <br />
                                <span className='profile-subtext'>
                                    <FormattedMessage id="Header.remainingMinutes" values={{ mins: duration}} />
                                </span>
                            </div>
                        }
                        {
                            currentPath.startsWith('/user') &&
                            <div>
                                <FormattedMessage id="Header.dashboard" />
                                <br />
                                <span className='profile-subtext'>
                                    <FormattedMessage id="Header.remainingMinutes" values={{ mins: duration}} />
                                </span>
                            </div>
                        }
                    </div>
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