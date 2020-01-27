import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

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

export default ContactFormModal;
