import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { Container, Tab, Row, Col, Nav } from 'react-bootstrap';

import UserHeader from '../user-header';
import Profile from './profile';
import Payment from './payment';

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabKey: props.location.hash ? props.location.hash : 'profile'
        }
    }

    componentDidMount() {
        if(_.isEmpty(this.props.user)) {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                <UserHeader />
                <Container className='profile-container'>
                    <Tab.Container id="left-tabs-example" activeKey={ this.state.activeTabKey }>
                        <Row>
                            <Col sm={3} className='user-tabs'>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link href='#profile' eventKey="profile" onClick={ () => this.setState({ activeTabKey: 'profile' }) } >Profile</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href='#payment' eventKey="payment" onClick={ () => this.setState({ activeTabKey: 'payment' }) } >Payment</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href='#plan' eventKey="plan" onClick={ () => this.setState({ activeTabKey: 'plan' }) } >Plans</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9} className='user-tab-content-container'>
                                <Tab.Content>
                                    <Tab.Pane eventKey="profile">
                                        <Profile />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="payment">
                                        <Payment />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="plan">
                                        Plans
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
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

export default connect(mapStateToProps)(withRouter(User));