import React, { Component } from 'react';
import _ from 'lodash';

import Editable from './editable';
import '../styles/editor.css';

class SpeechTextEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: -1,
            activeWordIndex: -1
        }
    }

    componentWillReceiveProps({ editorData, playerTime }) {
        if(!_.isEmpty(playerTime)) {
            const { seconds, nanoSeconds } = playerTime;
            let playerActiveIndex = -1, playerActiveWordIndex = -1;
            _.each(editorData, (data, index) => {
                let alternative = data.alternatives[0];
                _.map(alternative.words, (word, wordIndex) => {
                    let { startTime, endTime } = word;
                    let currTime = parseFloat(seconds + '.' + nanoSeconds);
                    startTime = parseFloat(startTime.seconds + '.' + startTime.nanos);
                    endTime = parseFloat(endTime.seconds + '.' + endTime.nanos);

                    if(startTime <= currTime && endTime > currTime) {
                        playerActiveIndex = index;
                        playerActiveWordIndex = wordIndex;
                        return;
                    }
                })
            });
            if(playerActiveIndex > -1 && playerActiveWordIndex > -1) {
                this.setState({
                    playerActiveIndex,
                    playerActiveWordIndex
                })
            }
        } else {
            this.setState({
                playerActiveIndex: 0,
                playerActiveWordIndex: 0
            })   
        }
    }

    changeIndexes = (index, wordIndex, changePlayerTime) => {
        this.setState({
            activeIndex: index,
            activeWordIndex: wordIndex
        }, () => {
            if(changePlayerTime) {
                this.changePlayerTime(index, wordIndex);
            }
        });
    }

    changePlayerTime = (index, wordIndex) => {
        const { editorData } = this.props;
        let word = editorData[index].alternatives[0].words[wordIndex];
        this.props.editorClicked(parseFloat(word.startTime.seconds + '.' + word.startTime.nanos));
    }

    getTranscriptionText = (words) => words.map((theword, i) => theword.word).join(' ')

    splitData = (caretPos, wordLength) => {
        let { editorData } = this.props;
        const { activeIndex, activeWordIndex } = this.state;
        
        let wordIndex = activeWordIndex;
        if(caretPos < wordLength / 2) {
            wordIndex -= 1;
        }

        let firstSplittedData = editorData[activeIndex];
        let secondSplittedData = _.cloneDeep(firstSplittedData);

        let endWord = firstSplittedData.alternatives[0].words[wordIndex];
        firstSplittedData.alternatives[0].endTime = endWord.endTime;
        firstSplittedData.alternatives[0].words.splice(wordIndex + 1);
        firstSplittedData.alternatives[0].transcript = this.getTranscriptionText(firstSplittedData.alternatives[0].words);

        let startWord = secondSplittedData.alternatives[0].words[wordIndex + 1];
        secondSplittedData.alternatives[0].startTime = startWord.startTime;
        secondSplittedData.alternatives[0].words.splice(0, wordIndex + 1);
        secondSplittedData.alternatives[0].transcript = this.getTranscriptionText(secondSplittedData.alternatives[0].words);

        editorData[activeIndex] = firstSplittedData;
        editorData.splice(activeIndex + 1, 0, secondSplittedData);

        this.setState({
            editorData,
            activeIndex: activeIndex + 1,
            activeWordIndex: 0,
            caretPosition: 0
        });
        this.props.handleSplitChange()
    }

    mergeData = () => {
        let { editorData } = this.props;
        const { activeIndex } = this.state;
        
        if(activeIndex === 0) return;

        let prevData = editorData[activeIndex - 1];
        let currentData = editorData[activeIndex];
        let prevWordLength = prevData.alternatives[0].words.length;

        prevData.alternatives[0].words = prevData.alternatives[0].words.concat(currentData.alternatives[0].words);
        let wordLength = prevData.alternatives[0].words.length;
        prevData.alternatives[0].endTime = prevData.alternatives[0].words[wordLength - 1].endTime;
        prevData.alternatives[0].transcript = this.getTranscriptionText(prevData.alternatives[0].words);

        editorData[activeIndex - 1] = prevData;
        editorData.splice(activeIndex, 1);

        this.setState({
            editorData,
            activeIndex: activeIndex - 1,
            activeWordIndex: prevWordLength,
            caretPosition: 0
        });
    }

    addZero = (value, length) => {
        if(value === 0) {
            return length === 3 ? '000' : '00';
        }
        if(value < 10) return length === 3 ? '00' : '0' + value.toString();
        return value;
    }

    formatTime = ({ seconds, nanos }) => {
        let formattedTime = '';
        if(seconds > 60) {
            let minutes = parseInt(seconds / 60);
            seconds = seconds % 60;
            if(minutes > 60) {
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
        formattedTime += this.addZero(seconds) + '.' + this.addZero(nanos, 3);

        return formattedTime;
    }

    render() {
        const { playerActiveIndex, playerActiveWordIndex } = this.state;
        const { editorData, handleWordChange, isPlaying, playerTime } = this.props;

        return (
            _.map(editorData, (data, index) => {
                let alternative = data.alternatives[0];
                if(alternative && alternative.transcript && alternative.startTime && alternative.endTime) {
                    let children = "";
                    children = _.map(alternative.words, (word, wordIndex) => {
                        let isActive = playerTime && playerActiveIndex === index && playerActiveWordIndex === wordIndex;
                        return (
                                <Editable
                                    index={ index }
                                    key={ index + '-' + wordIndex }
                                    wordIndex={ wordIndex }
                                    word={ word }
                                    changeIndexes={ this.changeIndexes }
                                    handleWordChange={ handleWordChange }
                                    isActive={ isActive }
                                    splitData={ this.splitData }
                                    mergeData= { this.mergeData }
                                    isPlaying={ isPlaying }
                                />
                        )
                    });
                    return (
                        <div className='conversionResult' key={ index } onClick={ (e) => {} } >
                            <div
                                id={ 'conversionTime_' + index }
                                className='conversionTime'
                                disabled={ true }
                            >
                                { this.formatTime(alternative.startTime) + ' - ' + this.formatTime(alternative.endTime) }
                            </div>
                            <div
                                id={ 'editable-content-' + index }
                                key={ 'editable-content-' + index }
                                contentEditable='true'
                                disabled={ false }
                                ref={ 'paragraph_' + index }
                                suppressContentEditableWarning='true'
                            >
                                { children }
                            </div>
                        </div>
                    )
                }
            })
        )
    }
}

export default SpeechTextEditor;