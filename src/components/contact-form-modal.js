import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import '../styles/dashboard.css';
import { updateProfile } from '../actions';
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

export default connect(mapStateToProps, { updateProfile })(ContactFormModal);
