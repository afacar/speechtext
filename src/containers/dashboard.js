import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/dashboard.css';

import UserHeader from './user-header';
import FileList from './file-list';
import Transcription from './transcription';
import UserLimits from './user-limits';

class Dashboard extends Component {
    componentDidMount() {
        if(_.isEmpty(this.props.user)) {
            this.props.history.push('/');
        }
    }

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

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps)(withRouter(Dashboard));