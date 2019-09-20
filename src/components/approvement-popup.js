import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ApprovementPopup = (props) => {
    return (
        <div>
            <Modal show={props.show}>
                <Modal.Header><b>{ props.headerText }</b></Modal.Header>
                <Modal.Body>
                    { props.bodyText }
                    <br />
                    <p>{ props.bodySubText || '' }</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={ props.successButtonVariant || 'success' } onClick={ props.handleSuccess }>{ props.successButtonText || 'Confirm'}</Button>
                    <Button variant={ props.cancelButtonVariant || 'danger' }  onClick={ props.handleCancel }>{ props.cancelButtonText || 'Cancel'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ApprovementPopup;