import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import Editable from './editable';
import '../styles/editor.css';
import Editable2 from './editable2';

class SpeechTextEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: -1,
            activeWordIndex: -1,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let prevLength = this.props.editorData.length
        let nextLength = nextProps.editorData.length
        if (prevLength !== nextLength) return true
        return false
    }

    changePlayerTime = (index, wordIndex) => {
        const { editorData } = this.props;
        let word = editorData[index].alternatives[0].words[wordIndex];
        this.props.editorClicked(parseFloat(word.startTime.seconds + '.' + word.startTime.nanos));
    }

    getTranscriptionText = (words) => words.map((theword, i) => theword.word ? theword.word : '').join(' ')

    addZero = (value, length) => {
        if (value === 0) {
            return length === 3 ? '000' : '00';
        }
        if (value < 10) return length === 3 ? '00' : '0' + value.toString();
        return value;
    }

    formatTime = ({ seconds, nanos }) => {
        let formattedTime = '';
        if (seconds > 60) {
            let minutes = parseInt(seconds / 60);
            seconds = seconds % 60;
            if (minutes > 60) {
                let hours = parseInt(minutes / 60);
                minutes = minutes % 60;
                formattedTime = this.addZero(hours) + ':';
            } else {
                formattedTime = '00:';
            }
            formattedTime += this.addZero(minutes) + ':';
        } else {
            formattedTime += '00:00:';
        }
        formattedTime += this.addZero(seconds) + ',' + this.addZero(nanos, 3);

        return formattedTime;
    }

    /*     handleWordChange = (index, wordIndex, text) => {
            if(!text || _.isEmpty(text.trim())) {
                let activeWordIndex = wordIndex;
                activeWordIndex = wordIndex > 0 ? wordIndex - 1 : 0;
    
                if(activeWordIndex !== wordIndex) {
                    this.setState({
                        activeWordIndex
                    })
                }
            }
    
            this.props.handleWordChange(index, wordIndex, text);
        } */

    render() {
        const { editorData, handleEditorChange, splitData, mergeData, changeActiveIndex } = this.props;
        console.log('SpeechTextEditor Rendering')
        return (
            _.map(editorData, (data, index) => {
                let alternative = data.alternatives[0];
                if (alternative && alternative.startTime && alternative.endTime) {
                    let className = editorData.length === 1 ? 'first-conversionResult last-conversionResult' : index === 0 ? 'first-conversionResult' : index === editorData.length - 1 ? 'last-conversionResult': 'conversionResult'
                    return (
                        <div className={className} key={index} onClick={(e) => { }} >
                            <div
                                id={'conversionTime_' + index}
                                className='conversionTime'
                                disabled={true}
                            >
                                {'Speaker: ' + alternative.words[0].speakerTag} {this.formatTime(alternative.startTime) + ' - ' + this.formatTime(alternative.endTime)}
                            </div>
                            <div
                                id={'editable-content-' + index}
                                key={'editable-content-' + index}
                                disabled={false}
                                ref={'paragraph_' + index}
                            >
                                <Editable2
                                    index={index}
                                    key={index}
                                    transcript={alternative}
                                    splitData={splitData}
                                    mergeData={mergeData}
                                    isLastEditable={index === editorData.length - 1}
                                    handleEditorChange={handleEditorChange}
                                />
                            </div>
                        </div>
                    )

                }
            })
        )
    }
}

export default SpeechTextEditor;