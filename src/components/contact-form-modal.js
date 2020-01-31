import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { updateProfile } from '../actions';

import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Container, Row } from 'react-bootstrap';
import PaymentDetails from './payment-details';
import BillingDetails from './billing-details';
import CheckOutInfo from './check-out-info';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard.css';
import Contact from '../containers/landing/contact';


class ContactFormModal extends Component {

    render() {
        const { show, handleClose } = this.props
        return (
            <Modal
                show={show}
                onHide={() => handleClose()}
                size="lg"
            >
                <Modal.Body>
                    <Contact closeContactForm={this.props.closeContactForm}/>
                </Modal.Body>
            </Modal>
        )
    }
}

const mapStateToProps = ({ user }) => {
    return {
        user
    }
}

export default connect(mapStateToProps, { updateProfile })(injectIntl(ContactFormModal));
