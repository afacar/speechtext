import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Modal, Button } from 'react-bootstrap';

const ApprovementPopup = (props) => {
    const {
        show, size,
        headerText, bodyText, bodySubText,
        successButtonVariant, successButton, handleSuccess,
        cancelButtonVariant, cancelButton, handleCancel, hideCancelButton } = props;
    return (
        <div>
            <Modal show={show} size={size ? size : 'md'}>
                <Modal.Header>
                    <b>
                        {headerText.id ? <FormattedHTMLMessage id={headerText.id} values={headerText.values || {}} /> : headerText}
                    </b>
                </Modal.Header>
                <Modal.Body>
                    {bodyText.id ? <FormattedHTMLMessage id={bodyText.id} values={bodyText.values || {}} /> : bodyText}
                    <br />
                    <p>
                        {bodySubText ? (bodySubText.id ? <FormattedHTMLMessage id={bodySubText.id} values={bodySubText.values || {}} /> : bodySubText) : ''}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={successButtonVariant || 'success'} onClick={handleSuccess}>
                        {successButton ? (successButton.id ? <FormattedHTMLMessage id={successButton.id} values={successButton.values || {}} /> : successButton) : 'Confirm'}
                    </Button>
                    {
                        !hideCancelButton &&
                        <Button variant={cancelButtonVariant || 'danger'} onClick={handleCancel}>
                            {cancelButton ? (cancelButton.id ? <FormattedHTMLMessage id={cancelButton.id} values={cancelButton.values || {}} /> : cancelButton) : 'Cancel'}
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ApprovementPopup;