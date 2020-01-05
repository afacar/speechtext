import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Container, Button, Table } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as actions from '../../actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

class Transaction extends Component {

    componentDidMount() {
        this.props.getTransactions(this.props.user);
    }

    componentWillReceiveProps({ transactions }) {
        console.log("Transactions " + transactions)
        console.log("Transactions size " + transactions.length)
        var size = transactions.length || 0;
        var sizeTmp = transactions.length || 0;
        size = parseInt(size / 10);
        if (sizeTmp % 10 !== 0)
            size++;
        this.props.setArraySize(size);
    }

    // 1 , 2 ,3 pages, also add to list on profile click

    renderTransaction(transaction, index) {
        return (
            <tr key={index}>
                <td>{transaction.basketId}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount + " hour(s)"}</td>
                <td>{transaction.currency + " " + transaction.price}</td>
                <td>
                    {
                        transaction.status === 'success' ?
                            <FontAwesomeIcon icon={faCheckCircle} color={'green'} />
                            :
                            <FontAwesomeIcon icon={faTimesCircle} color={'red'} />
                    }
                </td>
            </tr>
        )
    }
    render() {
        var { transactions, activePage } = this.props;
        if (transactions) {
            transactions = transactions.slice((activePage - 1) * 10, activePage * 10)
        }
        return (
            <Container className={this.props.className}>
                <Table responsive striped bordered hover >
                    <thead>
                        <tr>
                            <th>
                                <FormattedMessage id={"User.Tab.Transaction.Header.id"} />
                            </th>
                            <th>
                                <FormattedMessage id={"User.Tab.Transaction.Header.date"} />
                            </th>
                            <th>
                                <FormattedMessage id={"User.Tab.Transaction.Header.amount"} />
                            </th>
                            <th>
                                <FormattedMessage id={"User.Tab.Transaction.Header.price"} />
                            </th>
                            <th>
                                <FormattedMessage id={"User.Tab.Transaction.Header.status"} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(this.renderTransaction)}
                    </tbody>
                </Table>
            </Container>
        )
    }
}
const mapStateToProps = ({ user, transactions }) => {
    return {
        user,
        transactions
    }
}

export default connect(mapStateToProps, actions)(injectIntl(Transaction));