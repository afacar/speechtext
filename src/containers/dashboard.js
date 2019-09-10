import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/dashboard.css';

import UserHeader from './user-header';
import FileList from './file-list';
import Transcription from './transcription';
import UserLimits from './user-limits';

class Dashboard extends Component {
    render() {
        return (
            <div>
                <UserHeader />
                <UserLimits />
                <Container className='dashboard-container'>
                    <Row>
                        <Col lg="4" md="4">
                            <FileList />
                        </Col>
                        <Col lg="8" md="8">
                            <Transcription />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Dashboard;