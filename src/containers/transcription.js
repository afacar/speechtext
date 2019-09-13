import React, { Component } from 'react';
import _ from 'lodash';
import ContentEditable from 'react-contenteditable';
import { Media } from 'react-media-player';

import UserLimits from './user-limits';
import SpeechTextPlayer from '../components/player';
import UploadOptions from '../components/upload-options';

class Transcription extends Component {
    render() {
        const { selectedFile } = this.props;
        return (
            <div className='transcription-container'>
                <div className='transcription-title'>
                    <div className='selected-file-name'>
                        { selectedFile.name }
                    </div>
                    <Media>
                        <SpeechTextPlayer src={ selectedFile.status === 'DONE' ? '' : '' } />
                    </Media>
                </div>
                <div className='transcription'>
                    {
                        !_.isEmpty(selectedFile) && selectedFile.status === 'DONE' &&
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
                    }
                    {
                        !_.isEmpty(selectedFile) && selectedFile.status !== 'DONE' &&
                        <UploadOptions
                            file={ selectedFile }
                            disabled={ selectedFile.status !== 'PROCESSING' }
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Transcription;