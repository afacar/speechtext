import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Container, Tab, Row, Col, Nav, Pagination } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import DashboardHeader from '../dashboard-header';
import Profile from './profile';
import Payment from './payment';
import TransactionHistory from './transaction-history';

class User extends Component {
    constructor(props) {
        super(props);

        let { hashValue, fileId } = this.calculateHashValue(props);
        this.state = {
            activeTabKey: hashValue ? hashValue : 'profile',
            transactionHistory: [],
            activePage: 1,
            pageItems: [],
            fileId
        }
    }

    componentWillReceiveProps(nextProps) {
        let { hashValue } = this.calculateHashValue(nextProps);
        this.setState({
            activeTabKey: hashValue
        });
    }

    calculateHashValue = (props) => {
        let hashValue = props.location.hash ? props.location.hash.substr(1) : '';
        let hashSplit = hashValue.split('?');
        hashValue = hashSplit[0];
        let queryParam = hashSplit[1];
        let fileId = undefined;
        if (queryParam) {
            queryParam = queryParam.substr(1);
            fileId = queryParam.split('=')[1];
        }
        return {
            hashValue, fileId
        }
    }

    changeTab = (tabName) => {
        this.setState({
            activeTabKey: tabName
        });
        this.props.history.push('#' + tabName)
    }

    onSelectTab = (key) => {
        this.setState({
            activeTabKey: key
        })
    }

    changeTransactionPage = (e) => {
        this.setState({
            activePage: parseInt(e.target.text) || this.state.activePage
        })
    }

    setArraySize = (size) => {
        var items = [];
        for (let number = 1; number < size + 1; number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.activePage}>
                    {number}
                </Pagination.Item>,
            );
        }
        this.setState({
            arraySize: size,
            pageItems: items
        })
    }

    render() {
        return (
            <div>
                <DashboardHeader />
                <Container className='profile-container'>
                    <Tab.Container id="left-tabs-example" activeKey={this.state.activeTabKey} onSelect={this.onSelectTab}>
                        <Row>
                            <Col sm={3} className='user-tabs'>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link href='#profile' eventKey="profile">
                                            <FormattedMessage id='User.Tabs.profile' />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href='#payment' eventKey="payment">
                                            <FormattedMessage id='User.Tabs.payment' />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href='#transaction' eventKey="transaction" onClick={() => this.setState({ activeTabKey: 'transaction' })}>
                                            <FormattedMessage id="User.Tabs.transaction" />
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9} className='user-tab-content-container'>
                                <Tab.Content>
                                    <Tab.Pane eventKey="profile">
                                        <Profile />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="payment">
                                        <Payment changeTab={this.changeTab} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="transaction">
                                        <TransactionHistory className="user-tab-transaction-history"
                                            setArraySize={this.setArraySize} activePage={this.state.activePage} />
                                        {
                                            this.state.arraySize > 1 && (
                                                <Container className="user-tab-transaction-history-paging d-flex justify-content-end" >
                                                    <Pagination onClick={this.changeTransactionPage}>{this.state.pageItems}</Pagination>
                                                </Container>
                                            )
                                        }
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