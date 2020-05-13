import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import '../styles/header.css';
import '../styles/user.css';

import UserBox from './dashboard/user-box';
import LogoContainer from '../components/logo-container';

class UserHeader extends Component {

    render() {
        return (
            <Nav className='user-header-container'>
                <Navbar variant="light" expand="lg" bg="light" className='text-dark'>
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
        )
    }
}
export default withRouter(UserHeader);