import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button, Nav, NavDropdown } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import { logout } from '../../actions';
import firebase from '../../utils/firebase';

class UserBox extends Component {
    logout = () => {
        firebase.auth().signOut()
            .then(() => {
                // Sign-out successful.
            }).catch((error) => {
                // TODO: SIGNOUT_ERROR
                console.log(error)
            });
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        const { formatMessage } = this.props.intl;
        return (
            <Nav>
                <NavDropdown title={ formatMessage({ id: 'UserBox.title' })} id='nav-dropdown' alignRight={ this.props.alignLeft ? false : true } className='userbox-dropdown'>
                    <Link to='/dashboard' className='dropdown-item'>
                        Dashboard
                    </Link>
                    <Link to='/user#profile' className='dropdown-item'>
                        <FormattedMessage id='UserBox.profile' />
                    </Link>
                    <Link to='/user#payment' className='dropdown-item'>
                        <FormattedMessage id='UserBox.payment' />
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item eventKey='0' onClick={ this.logout }>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { logout })(withRouter(injectIntl(UserBox)));