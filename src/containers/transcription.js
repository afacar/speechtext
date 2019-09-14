import React, { Component } from 'react';
import _ from 'lodash';
import ContentEditable from 'react-contenteditable';
import { Media } from 'react-media-player';

import UserLimits from './user-limits';
import SpeechTextPlayer from '../components/player';
import UploadOptions from '../components/upload-options';

class Transcription extends Component {
    renderResults = () => {
        const { selectedFile } = this.props;
        if(!_.isEmpty(selectedFile) && selectedFile.status === 'DONE') {
            return (
                <div className='conversionResult'>
                    <ContentEditable
                        className='conversionTime'
                        html={ '00:00 - 00:30' } // innerHTML of the editable div
                        disabled={ true } // use true to disable edition
                    />
                    <ContentEditable
                        html={ 'deneme deneme deneme' } // innerHTML of the editable div
                        disabled={ false } // use true to disable edition
                        onChange={ (e) => {  }} // handle innerHTML change
                    />
                    <br />
                </div>
            )
        }
    }

    renderOptions = () => {
        const { selectedFile } = this.props;
        if(!_.isEmpty(selectedFile) && selectedFile.status !== 'DONE') {
            return (
                <UploadOptions
                    file={ selectedFile }
                    disabled={ selectedFile.status !== 'PROCESSING' }
                />
            )
        }
    }

    render() {
        const { selectedFile } = this.props;
        return (
            <div className='transcription-container'>
                <div className='transcription-title'>
                    <div className='selected-file-name'>
                        { selectedFile.name }
                    </div>
                    <Media>
                        <SpeechTextPlayer src={ selectedFile.status === 'DONE' ? selectedFile.originalFile.url : 'https://www.youtube.com/watch?v=tgBvKd2q1Vo' } />
                    </Media>
                </div>
                <div className='transcription'>
                    { this.renderResults() }
                    { this.renderOptions() }
                </div>
            </div>
        );
    }
}

export default Transcription;