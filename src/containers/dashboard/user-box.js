import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, NavDropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { read_cookie, delete_cookie } from 'sfcookies';

import { login, logout } from '../../actions';
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
        delete_cookie('speechtext-dev-login');
        this.props.history.push('/');
    }

    componentDidMount() {
        if(_.isEmpty(this.props.user)) {
            const loginInfo = read_cookie('speechtext-dev-login');
            if(!_.isEmpty(loginInfo)) {
                this.props.login(loginInfo);
            } else {
                this.props.history.push('/');
            }
        }
    }

    renderTitle = () => {
        const { user } = this.props;

        return (
            <span>
                { user.displayName }
                <br />
                <span className='user-box-remaining'>
                    <FormattedMessage id='UserBox.remainingMinutes' values={ { remainingMinutes: user.currentPlan ? user.currentPlan.remainingMinutes : 0 } } />
                </span>
            </span>
        )
    }

    render() {
        return (
            <Nav>
                <NavDropdown title={ this.renderTitle() } id='nav-dropdown' alignRight={ this.props.alignLeft ? false : true } className='userbox-dropdown'>
                    <Link to='/dashboard' className='dropdown-item'>
                        <FormattedMessage id='UserBox.dashboard' />
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

export default connect(mapStateToProps, { login, logout })(withRouter(UserBox));