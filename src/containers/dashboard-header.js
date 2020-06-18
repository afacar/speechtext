import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

import UserBox from './dashboard/user-box';
import LogoContainer from '../components/logo-container';

import '../styles/header.css';
import '../styles/user.css';

class DashboardHeader extends Component {

    render() {
        return (
            <Nav>
                <Navbar variant="light" expand="lg" bg="light" className='text-dark dashboard-header-container'>
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

export default withRouter(DashboardHeader);