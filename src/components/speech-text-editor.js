import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

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
                    } else {
                        return;
                    }
                    // if(startTime.seconds <= seconds && (startTime.nanos < nanoSeconds || (endTime.seconds >= seconds && endTime.nanos >= nanoSeconds))) {
                    //     activeIndex = index;
                    //     activeWordIndex = wordIndex;
                    // } else if(startTime.seconds > seconds) {
                    //     return;
                    // }
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
        console.log('caret pos: ' + caretPosition + '-' + activeIndex + '-' + activeWordIndex);
        if(activeIndex > -1 && activeWordIndex > -1 && caretPosition > -1) {
            console.log('caret pos 2: ' + caretPosition);
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
        // el.focus();
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
        let keyCode = e.keyCode;
        keyPressed[keyCode] = false;
        if(exclusiveKeyCodes.includes(keyCode)) return;
        const { activeIndex, activeWordIndex } = this.state;
        if(keyCode === 9) { // TAB
            this.setState({
                activeIndex: keyPressed[16] ? activeIndex - 1 : activeIndex + 1,
                activeWordIndex: 0,
                caretPosition: 0
            })
        }
        if(keyCode === 13 || keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) { // 13 -> Enter, 37 -> ArrowLeft, 38 -> ArrawUp, 39 -> ArrowRight, 40 -> ArrowDown
            var selectedObj = window.getSelection();
            // var cursorPosition = selectedObj.getRangeAt(0) === 1 ? 'start' : 'end';
            var childNodes = selectedObj.anchorNode.parentNode.childNodes;

            let nodeId = childNodes[0].parentElement.id;
            if(nodeId.startsWith('editable-content-')) {
                let indexArr = nodeId.split('editable-content-')[1].split('_');
                let currIndex = parseInt(indexArr[0]);
                let currWordIndex = parseInt(indexArr[1]);
                if(activeIndex !== currIndex || activeWordIndex !== currWordIndex) {
                    let currValue = this.refs['span_' + currIndex + '_' + currWordIndex].innerText;
                    let caretPosition = currValue.startsWith(' ') ? 1 : 0;
                    if(currWordIndex < activeWordIndex || keyCode === 40) {
                        caretPosition = currValue.length;
                    }
                    this.setState({
                        activeIndex: currIndex,
                        activeWordIndex: currWordIndex,
                        caretPosition
                    });
                }
            }
            // 0_1
            console.log(childNodes[0].parentElement.id);
        } else {
            if(this.refs['span_' + activeIndex + '_' + activeWordIndex]) {
                let el = this.refs['span_' + activeIndex + '_' + activeWordIndex];
                let value = el.innerText;
                this.setState({
                    caretPosition: this.getCaretPos(el)
                });
                this.props.handleWordChange(activeIndex, activeWordIndex, value.trim());
            }
        }
    }

    render() {
        const { activeIndex, activeWordIndex } = this.state;
        const { editorData, handleWordChange } = this.props;

        return (
            _.map(editorData, (data, index) => {
                let alternative = data.alternatives[0];
    
                let children = "";
                children = _.map(alternative.words, (word, wordIndex) => {
                    return (
                        <span
                            id={ 'editable-content-' + index + "_" + wordIndex }
                            contentEditable='true'
                            spellCheck='false'
                            tabIndex={ index + wordIndex }
                            // onFocus={ e => this.changeIndexes(index, wordIndex) }
                            onClick={ e => this.changeIndexes(index, wordIndex) }
                            className={ activeIndex === index && activeWordIndex === wordIndex ? 'active-word' : ''}
                            ref={ 'span_' + index + '_' + wordIndex }
                        >
                            { (wordIndex > 0 ? ' ' : '') + word.word }
                        </span>
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
                            { alternative.startTime.seconds + ' - ' + alternative.endTime.seconds }
                        </div>
                        <div
                            id={ 'editable-content-' + index }
                            contentEditable='true'
                            disabled={ false }
                            onKeyUp={ this.keyUp }
                            onKeyDown={ e => keyPressed[e.keyCode] = true }
                            ref={ 'paragraph_' + index }
                        >
                            { children }
                        </div>
                        <br />
                    </div>
                )
            })
        )
    }
}

export default SpeechTextEditor;