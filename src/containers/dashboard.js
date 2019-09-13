import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';

import { getFileList } from '../actions';
import '../styles/dashboard.css';
import UserHeader from './user-header';
import FileList from './file-list';
import Transcription from './transcription';
import UserLimits from './user-limits';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: {}
        }
    }

    componentDidMount() {
        if(_.isEmpty(this.props.user)) {
            this.props.history.push('/');
        } else {
            this.props.getFileList();
        }
    }

    onFileSelected = (file) => {
        this.setState({
            selectedFile: file
        })
    }

    render() {
        return (
            <div>
                <UserHeader />
                <Container className='dashboard-container'>
                    <Row>
                        <Col lg="4" md="4">
                            <FileList onFileSelected={ this.onFileSelected } />
                        </Col>
                        <Col lg="8" md="8">
                            <Transcription selectedFile={ this.state.selectedFile } />
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

export default connect(mapStateToProps, { getFileList })(withRouter(Dashboard));