import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Logo from '../assets/logo.png';
import '../styles/header.css';
import '../styles/user.css';

import UserBox from './dashboard/user-box';
import LogoContainer from './landing/logo-container';

class UserHeader extends Component {

    render() {
        return (
            <div>
                <Nav>
                    <Navbar variant="light" expand="lg" bg="light" fixed="top" className='text-dark fixed-top-style'>
                        <Link to='/'>
                            <Navbar.Brand>
                                <LogoContainer />
                            </Navbar.Brand>
                        </Link>
                        <Navbar.Toggle />
                        <Navbar.Collapse>
                            <Nav className="ml-auto">
                                <Nav.Item>
                                    <UserBox />
                                </Nav.Item>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Nav>
            </div>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps)(withRouter(UserHeader));