import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { Container, Tab, Row, Col, Nav } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import UserHeader from '../user-header';
import Profile from './profile';
import Payment from './payment';
import Plan from './plan';

class User extends Component {
    constructor(props) {
        super(props);

        let hashValue = props.location.hash ? props.location.hash.substr(1) : '';
        this.state = {
            activeTabKey: hashValue ? hashValue : 'profile'
        }
    }

    componentDidMount() {
        localStorage.setItem('location', window.location.pathname + window.location.hash);
        if(_.isEmpty(this.props.user)) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        let hashValue = nextProps.location.hash ? nextProps.location.hash.substr(1) : '';
        this.setState({
            activeTabKey: hashValue
        });
        localStorage.setItem('location', window.location.pathname + window.location.hash);
    }

    changeTab = (tabName) => {
        this.setState({
            activeTabKey: tabName
        });
        this.props.history.push('#' + tabName)
        localStorage.setItem('location', window.location.pathname + window.location.hash);
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
                                        <Nav.Link href='#profile' eventKey="profile" onClick={ () => this.setState({ activeTabKey: 'profile' }) } >
                                            <FormattedMessage id='User.Tabs.profile' />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href='#payment' eventKey="payment" onClick={ () => this.setState({ activeTabKey: 'payment' }) } >
                                            <FormattedMessage id='User.Tabs.payment' />
                                        </Nav.Link>
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
                                        <Payment changeTab={ this.changeTab } />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="plan">
                                        <Plan />
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