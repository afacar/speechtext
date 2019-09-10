import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable';

import UserLimits from './user-limits';

class Transcription extends Component {
    render() {
        return (
            <div className='transcription-container'>
                <div className='transcription-title'>
                    File Name here!
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