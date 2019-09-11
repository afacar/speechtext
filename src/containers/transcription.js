import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable';
import { Media } from 'react-media-player';

import UserLimits from './user-limits';
import SpeechTextPlayer from '../components/player';

class Transcription extends Component {
    render() {
        return (
            <div className='transcription-container'>
                <div className='transcription-title'>
                    <div>
                        salix.mp3
                    </div>
                    <Media>
                        <SpeechTextPlayer src='https://youtu.be/VOyYwzkQB98' />
                    </Media>
                </div>
                <div className='transcription'>
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
                </div>
            </div>
        );
    }
}

export default Transcription;