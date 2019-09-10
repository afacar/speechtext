import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import UserHeader from './user-header';

class Dashboard extends Component {
    render() {
        return (
            <div>
                <UserHeader />
                <Container className='dashboard-container'>
                    Dashboard
                </Container>
            </div>
        );
    }
}

export default Dashboard;