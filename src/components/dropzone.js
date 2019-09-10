import React, { Component } from 'react';
import _ from 'lodash';

class Dropzone extends Component {
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();

        this.state = {
            highlight: false
        }
    }

    openFileDialog = () => {
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
                Click Here or Drop Files to Upload
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

export default Dropzone;