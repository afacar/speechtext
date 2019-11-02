import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Editable from './editable';
import '../styles/editor.css';

const exclusiveKeyCodes = [16, 17, 18, 20, 27, 93, 225, 144];
const keyPressed = {};

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
            let activeIndex = -1, activeWordIndex = -1;
            _.each(editorData, (data, index) => {
                let alternative = data.alternatives[0];
                _.map(alternative.words, (word, wordIndex) => {
                    let { startTime, endTime } = word;
                    let currTime = parseFloat(seconds + '.' + nanoSeconds);
                    startTime = parseFloat(startTime.seconds + '.' + startTime.nanos);
                    endTime = parseFloat(endTime.seconds + '.' + endTime.nanos);

                    if(startTime <= currTime && endTime > currTime) {
                        activeIndex = index;
                        activeWordIndex = wordIndex;
                        return;
                    }
                })
                // 6_323-0_12
                // 7_61-0_11

                // 11: 5.0 - 6.200
                // 12: 6.200 - 7.300
                // 13: 7.300 - 8.600
                console.log('player: ' + playerTime.seconds + '_' + playerTime.nanoSeconds + '-' + activeIndex + '_' + activeWordIndex);
            });
            if(activeIndex > -1 && activeWordIndex > -1) {
                this.setState({
                    activeIndex,
                    activeWordIndex
                })
            }
        }
    }

    componentDidUpdate() {
        const { caretPosition, activeIndex, activeWordIndex } = this.state;
        if(activeIndex > -1 && activeWordIndex > -1 && caretPosition > -1) {
            if(this.refs['span_' + activeIndex + '_' + activeWordIndex]) {
                let el = this.refs['span_' + activeIndex + '_' + activeWordIndex];
                let value = el.innerText;
                if(value.length >= caretPosition) {
                    this.setCaretPos(el, caretPosition);
                }
            }
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

    placeCaretAtEnd = (el) => {
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    getCaretPos(el) {
        let _range = document.getSelection().getRangeAt(0);
        let range = _range.cloneRange()
        range.selectNodeContents(el)
        range.setEnd(_range.endContainer, _range.endOffset)
        return range.toString().length;
    }

    setCaretPos(el, pos) {
        // for contentedit field
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el.childNodes[0], pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
    }
    
    keyUp = (e) => {
        console.log('editor');
        let keyCode = e.keyCode;
        if(keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
        }
        // keyPressed[keyCode] = false;
        // if(exclusiveKeyCodes.includes(keyCode)) return;
        // const { activeIndex, activeWordIndex } = this.state;
        // if(keyCode === 9) { // TAB
        //     this.setState({
        //         activeIndex: keyPressed[16] ? activeIndex - 1 : activeIndex + 1,
        //         activeWordIndex: 0,
        //         caretPosition: 0
        //     })
        // }
        // if(keyCode === 13 || keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) { // 13 -> Enter, 37 -> ArrowLeft, 38 -> ArrawUp, 39 -> ArrowRight, 40 -> ArrowDown
        //     var selectedObj = window.getSelection();
        //     // var cursorPosition = selectedObj.getRangeAt(0) === 1 ? 'start' : 'end';
        //     var childNodes = selectedObj.anchorNode.parentNode.childNodes;

        //     let nodeId = childNodes[0].parentElement.id;
        //     if(nodeId.startsWith('editable-content-')) {
        //         let indexArr = nodeId.split('editable-content-')[1].split('_');
        //         let currIndex = parseInt(indexArr[0]);
        //         let currWordIndex = parseInt(indexArr[1]);
        //         if(activeIndex !== currIndex || activeWordIndex !== currWordIndex) {
        //             let currValue = this.refs['span_' + currIndex + '_' + currWordIndex].innerText;
        //             let caretPosition = currValue.startsWith(' ') ? 1 : 0;
        //             if(currWordIndex < activeWordIndex || keyCode === 40) {
        //                 caretPosition = currValue.length;
        //             }
        //             this.setState({
        //                 activeIndex: currIndex,
        //                 activeWordIndex: currWordIndex,
        //                 caretPosition
        //             });
        //         }
        //     }
        //     // 0_1
        //     console.log(childNodes[0].parentElement.id);
        // } else {
        //     if(this.refs['span_' + activeIndex + '_' + activeWordIndex]) {
        //         let el = this.refs['span_' + activeIndex + '_' + activeWordIndex];
        //         let value = el.innerText;
        //         this.setState({
        //             caretPosition: this.getCaretPos(el)
        //         });
        //         this.props.handleWordChange(activeIndex, activeWordIndex, value.trim());
        //     }
        // }
    }

    getTranscriptionText = (words) => {
        let transcriptionText = '';
        _.each(words, (word, index) => {
            transcriptionText += (index > 0 ? ' ' : '') + word.word;
        });
        return transcriptionText;
    }

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
        if(value < 10) return length === 3 ? '00' : '0' + value;
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
            formattedTime += '00:';
        }
        formattedTime += this.addZero(seconds) + '.' + this.addZero(nanos, 3);

        return formattedTime;
    }

    render() {
        const { activeIndex, activeWordIndex } = this.state;
        const { editorData, handleWordChange } = this.props;

        return (
            _.map(editorData, (data, index) => {
                let alternative = data.alternatives[0];
    
                let children = "";
                children = _.map(alternative.words, (word, wordIndex) => {
                    let isActive = activeIndex === index && activeWordIndex === wordIndex;
                    return (
                            <Editable
                                index={ index }
                                key={ index + '-' + wordIndex }
                                wordIndex={ wordIndex }
                                word={ word }
                                changeIndexes={ this.changeIndexes }
                                handleWordChange={ this.props.handleWordChange }
                                isActive={ isActive }
                                splitData={ this.splitData }
                                mergeData= { this.mergeData }
                            />
                    )
                });
                return (
                    <div className='conversionResult' key={ index } onClick={ (e) => {} } >
                        <div
                            id={ 'conversionTime_' + index }
                            className='conversionTime'
                            contentEditable='false'
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
                        >
                            { children }
                        </div>
                    </div>
                )
            })
        )
    }
}

export default SpeechTextEditor;