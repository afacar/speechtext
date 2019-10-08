import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import Alert from 'react-s-alert';

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();

        this.state = {
            highlight: false
        }
    }

    openFileDialog = () => {
        const { intl } = this.props;
        if(!_.isEmpty(this.props.uploadingFiles)) {
            Alert.error(intl.formatMessage({
                id: 'Dropzone.multipleFileError'
            }));
            return;
        }
        this.fileInputRef.current.value = '';
        this.fileInputRef.current.click();
    }

    onFileAdded = (evt) => {
        const files = evt.target.files;
        if (this.props.onFileAdded && !_.isEmpty(files)) {
            this.props.onFileAdded(files[0]);
        }
    }

    onDragOver = (evt) => {
        evt.preventDefault();

        this.setState({ highlight: true });
    }

    onDragLeave = () => {
        this.setState({ highlight: false });
    }

    onDrop = (event) => {
        event.preventDefault();

        const files = event.dataTransfer.files;
        if (this.props.onFileAdded && !_.isEmpty(files)) {
            this.props.onFileAdded(files[0]);
        }
        this.setState({ highlight: false });
    }

    render() {
        return (
            <div
                className={ `drop-zone ${this.state.highlight ? 'highlight' : ''}` }
                onDragOver={ this.onDragOver }
                onDragLeave={ this.onDragLeave }
                onDrop={ this.onDrop }
                onClick={ this.openFileDialog }
            >
                <FormattedMessage id='Dropzone.text' />
                <input
                    ref={this.fileInputRef}
                    className='file-input'
                    type="file"
                    onChange={this.onFileAdded}
                />
            </div>
        )
    }
}

const mapStateToProps = ({ uploadingFiles }) => {
    return {
        uploadingFiles
    }
}

export default connect(mapStateToProps)(injectIntl(Dropzone));