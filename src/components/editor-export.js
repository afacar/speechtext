import React, { Component } from 'react';
import { DropdownButton, Dropdown, Button, Spinner } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import "../styles/editor.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

class Export extends Component {

    renderSavingText() {
        const { savingState } = this.props;
        if (savingState === 0) {
            return (
                <p className="saving-state-text">
                </p>
            )
        } else if (savingState === 2) {
            return (
                <p className="saving-state-text saving">
                    <FormattedMessage id="Editor.SavingState.Saving" />
                </p>
            )
        } else if (savingState === 1) {
            return (
                <p className="saving-state-text saved">
                    <FormattedMessage id="Editor.SavingState.Saved" />
                </p>
            )
        } else if (savingState === -1) {
            return (
                <p className="saving-state-text unsaved">
                    <FormattedMessage id="Editor.SavingState.Unsaved" />
                </p>
            )
        } else if (savingState === -2) {
            return (
                <p className="saving-state-text error">
                    <FormattedMessage id="Editor.SavingState.Error" />
                </p>
            )
        }
    }

    render() {
        const { intl, savingState, showDownloadSpinner, fileType } = this.props;
        const { formatMessage } = intl;
        return (
            <div className={ 'export' + (fileType.startsWith('audio') ? ' export-audio' : '') }>

                <DropdownButton id="dropdown-item-button"
                    title={
                        <span>
                            {formatMessage({ id: 'Transcription.Download.text' }) + '  '}
                            <i className="fa fa-download"> </i>
                            {showDownloadSpinner && <Spinner size='sm' animation="grow" role="status" />}
                        </span>
                    }
                    drop='left'>
                    <Dropdown.Item as="button" onClick={this.props.downloadAsTxt}>
                        <FormattedMessage id='Transcription.Download.option1' />
                    </Dropdown.Item>
                    <Dropdown.Item as="button" onClick={this.props.downloadAsDocx}>
                        <FormattedMessage id='Transcription.Download.option2' />
                    </Dropdown.Item>
                    <Dropdown.Item as="button" onClick={this.props.downloadAsSrt}>
                        <FormattedMessage id='Transcription.Download.option3' />
                    </Dropdown.Item>
                </DropdownButton>
                <Button className="save-button" onClick={this.props.onSave} disabled={savingState !== -1 || savingState === 1}>
                    {formatMessage({ id: 'Transcription.Save.text' }) + '  '}
                    <FontAwesomeIcon icon={faSave} color="white" size="1x" />
                    {savingState === 2 && <Spinner size='sm' animation="grow" role="status" />}
                </Button>
            </div>
        )
    }
}

export default (injectIntl)(Export);