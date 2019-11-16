import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import _ from "lodash";

import { setEditorFocus } from "../actions";

const exclusiveKeyCodes = [13, 16, 17, 18, 20, 27, 93, 225, 144, 35, 36, 37, 38, 39, 40];
const arrowKeyCodes = [35, 36, 37, 38, 39, 40]
const KEYCODES = { BACKSPACE: 8, ENTER: 13, DEL: 46, LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 }
console.log('Editable2 Import!')

class Editable2 extends React.Component {
    isEditorClean = true
    isBackSpaceActive = true
    isDelActive = true
    lastCaretPosition = null
    isEditing = false
    isPlaying = false
    isFocused = false
    isBlurred = false
    firstEditableIndex = -1
    lastEditableIndex = -1

    shouldComponentUpdate(nextProps, nextStates) {
        const { index } = this.props;
        console.log(`Editable${index}ShouldUpdate props `, this.props, nextProps)
        //const { playerActiveIndex, playerActiveWordIndex } = nextProps.playerChange
        const nextEditor = nextProps.editorFocus
        const thisEditor = this.props.editorFocus
        const thisPlayer = this.props.playerChange
        const nextPlayer = nextProps.playerChange

        this.isEditing = index === nextEditor.activeIndex
        this.isPlaying = index === nextPlayer.playerActiveIndex

        const isEditingWordChanged = this.isEditing && thisEditor.activeWordIndex !== nextEditor.activeWordIndex
        const isPlayingWordChanged = this.isPlaying && thisPlayer.playerActiveWordIndex !== nextPlayer.playerActiveWordIndex
        console.log('this.isEditorClean: ', this.isEditorClean)
        console.log('this.isEditing: ', this.isEditing)
        console.log('this.isPlaying: ', this.isPlaying)

        if (!this.isEditorClean && !this.isEditing) {
            console.log(`Editable${index} UPDATES due to cleaning!`)
            this.isEditorClean = true
            return true
        }
        if (isPlayingWordChanged) {
            this.isEditorClean = false
            console.log(`Editable${index} UPDATES DUE TO PlayingWordChanged`)
            return true
        }
        if (isEditingWordChanged) {
            this.isEditorClean = false
            console.log(`Editable${index} UPDATES DUE TO EditingWordChanged`)
            return true
        }
        if(this.isEditing && !this.isFocused) {
            console.log(`Editable${index} UPDATES IN ORDER TO FOCUS`)
            return true
        }

        console.log(`Editable${index} SHOULD NOT UPDATE DUE TO NO REASON`)
        return false
    }

    onKeyDown = (e) => {
        const { index, transcript, splitData, mergeData, isLastEditable, changeActiveIndex } = this.props;
        console.log(`onKeyDown is`, e.keyCode)
        if (![8, 13, 46, 37, 38, 39, 40].includes(e.keyCode)) return;
        let sel = document.getSelection()
        console.log('onKeyDown sel>', sel)
        let offset = sel.focusOffset
        let text = sel.focusNode.innerText || sel.focusNode.textContent
        let id = sel.focusNode.nodeName !== 'SPAN' ? sel.focusNode.parentNode.id : sel.focusNode.id
        let wordIndex = parseInt(id)
        //let spanIndex = this.getSpanById(wordIndex).index
        let firstIndex = parseInt(this.editableRef.firstElementChild.id)
        let lastIndex = parseInt(this.editableRef.lastElementChild.id)
        console.log(`onKeyDown text is ${text} wordIndex ${wordIndex} and offset is ${offset} and #words is ${transcript.words.length} and textLen is ${text.length}`)
        console.log(`onKeyDown firstEditableIndex ${this.firstEditableIndex} and lastEditableIndex ${this.lastEditableIndex}`)
        switch (e.keyCode) {
            case KEYCODES.BACKSPACE:
                if (wordIndex === firstIndex && offset === 0) {
                    if (index > 0) {
                        console.log('Merge with prev paragraphs!')
                        e.preventDefault()
                        e.stopPropagation()
                        this.isBackSpaceActive = false
                        mergeData(index)
                    } else if (index === 0) {
                        console.log(`onKeyDown do nothin!!!`)
                        this.isBackSpaceActive = false
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }
                break;
            case KEYCODES.ENTER:
                console.log('Enter pressed')
                e.preventDefault()
                e.stopPropagation()
                if (wordIndex > firstIndex && wordIndex < lastIndex) {
                    console.log('Split paragraphs!')
                    splitData(index, wordIndex, offset, text.length)
                }
                break;
            case KEYCODES.DEL:
                console.log('Delete pressed')
                if (!isLastEditable && wordIndex === lastIndex && offset === text.length) {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Merge with next pressed')
                    this.isDelActive = false
                    mergeData(index + 1)
                } else if (isLastEditable && wordIndex === lastIndex && offset === text.length) {
                    console.log('onKeyDown do nothig')
                    this.isDelActive = false
                    e.preventDefault()
                    e.stopPropagation()
                }
                break;
            case KEYCODES.LEFT:
            case KEYCODES.UP:
                if (index > 0 && wordIndex === firstIndex && offset === 0) {
                    console.log('LEFT OR UP pressed GO UP')
                    e.preventDefault()
                    e.stopPropagation()
                    changeActiveIndex(index - 1, -1, -1)
                }
                break;
            case KEYCODES.RIGHT:
            case KEYCODES.DOWN:
                if (!isLastEditable && wordIndex === lastIndex && offset === text.length) {
                    console.log('RIGHT OR DOWN pressed GO DOWN')
                    e.preventDefault()
                    e.stopPropagation()
                    changeActiveIndex(index + 1, 0, 0)
                }
                break;
            default:
                console.log('Unknown')
                break;
        }
    }

    onKeyUp = (e) => {
        const { keyCode } = e;

        if (exclusiveKeyCodes.includes(keyCode)) return;

        console.log('onKeyUp!', keyCode)

        const { index, transcript, handleEditorChange } = this.props;
        let words = _.cloneDeep(transcript.words)
        words = words.map((word, i) => {
            word.word = ''
            return word
        })
        console.log('onKeyUp PrevWords!', words)

        switch (keyCode) {
            case KEYCODES.BACKSPACE:
                console.log('backspace pressed at index?', index)
                if (!this.isBackSpaceActive) {
                    console.log(`onKeyUp do nothin!!!`)
                    e.preventDefault()
                    e.stopPropagation()
                    this.isBackSpaceActive = true
                    return
                }
                break;
            case KEYCODES.DEL:
                console.log('Delete pressed')
                if (!this.isDelActive) {
                    console.log('onKeyUp do nothig')
                    this.isDelActive = true
                    e.preventDefault()
                    e.stopPropagation()
                    return
                }
                break;
            default:
                console.log('Unknown')
                break;
        }

        let sel = document.getSelection()
        console.log('onKeyUp sel>', sel)
        let offset = sel.focusOffset
        let text = sel.focusNode.innerText || sel.focusNode.textContent
        let id = sel.focusNode.nodeName !== 'SPAN' ? sel.focusNode.parentNode.id : sel.focusNode.id
        let activeWordIndex = parseInt(id)
        console.log(`onKeyUp text is ${text} activeWordIndex ${activeWordIndex} and offset is ${offset} and words.length is ${transcript.words.length} and textLen is ${text.length}`)

        let children = this.editableRef.childNodes
        console.log('onKeyUp children:', children)
        let len = children.length
        console.log('children.length=', children.length)
        console.log('words.length=', words.length)
        for (let i = 0; i < len; i++) {
            let child = children[i];
            let wordIndex = parseInt(child.id);
            let newWord = child.innerText.trim()
            if (child.nodeName === 'SPAN' && !isNaN(wordIndex))
                words[wordIndex].word = newWord
        }

        console.log(`transcript object final`, words)
        this.lastCaretPosition = offset
        this.props.setEditorFocus(index, activeWordIndex, this.lastCaretPosition)
        handleEditorChange(index, words)
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

    addZero = (value, length) => {
        if (value === 0) {
            return length === 3 ? '000' : '00';
        }
        if (value < 10) return length === 3 ? '00' : '0' + value.toString();
        return value;
    }

    onChange = (e) => {
        console.log(`Editable${this.props.index} onChange`)
    }

    onClick = (e) => {
        console.log(`Editable${this.props.index} onClick`)
    }

    onFocus = (e) => {
        console.log(`Editable${this.props.index} onFocus`)
        this.isFocused = true
    }

    onBlur = (e) => {
        console.log(`Editable${this.props.index} onBlur`)
        this.isFocused = false
    }

    onInput = (e) => {
        console.log(`Editable${this.props.index} onInput`)
    }

    decideClassName = (word, isActive, isPlaying) => {
        let className = 'editable-content';
        if (isActive) className += ' active-word';
        if (isPlaying) className += ' playing-word';
        if (word.confidence < 0.6) className += ' not-so-confident';

        return className;
    }

    render = () => {
        const { index, transcript, playerChange, editorFocus } = this.props;
        let { playerActiveIndex, playerActiveWordIndex } = playerChange
        let words = transcript.words.map((word, wordIndex) => {
            let isActive = false
            let isPlaying = false
            if (index === playerActiveIndex && wordIndex === playerActiveWordIndex)
                isPlaying = true
            if (index === editorFocus.activeIndex && wordIndex === editorFocus.activeWordIndex)
                isActive = true
            if (this.firstEditableIndex === -1 && word.word !== '') {
                this.firstEditableIndex = wordIndex
                this.lastEditableIndex = wordIndex
            } else if (word.word !== '') {
                this.lastEditableIndex = wordIndex
            }

            return (
                <span
                    className={this.decideClassName(word, isActive, isPlaying)}
                    key={wordIndex}
                    id={wordIndex}
                    contentEditable='true'
                    suppressContentEditableWarning='true'
                    title={this.formatTime(word.startTime) + '-' + this.formatTime(word.endTime)}
                >
                    {word.word ? ' ' + word.word : ''}
                </span>
            )
        })
        console.log(`Editable${index} Rendering words>>>`, words)
        return (
            <div
                className='editable-content-wrapper'
                ref={(input) => { this.editableRef = input }}
                tabIndex={index}
                key={index}
                id={'editable-content-' + index}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
                onClick={this.onClick}
                onInput={this.onInput}
                contentEditable='true'
                suppressContentEditableWarning='true'
            >
                {words}
            </div>
        )
    } // render end

    setCaretPos = (wordIndex, caretPos) => {
        const { index } = this.props
        console.log('setCaretPos index', index)
        console.log('setCaretPos wordIndex', wordIndex)
        console.log('setCaretPos caretPos', caretPos)
        if (wordIndex === null) return
        let childNodes = this.editableRef.childNodes

        let node = childNodes[wordIndex]
        if (!node) node = childNodes[this.lastEditableIndex]
        if (!node) {
            console.log('CANNOT find node so returning')
            return
        }
        console.log('node--', node)
        if (!node.firstChild) {
            console.log('firstChild empty so adding text to it')
            node.textContent = ' '
        }
        var range = document.createRange();
        var sel = window.getSelection();
        console.log('node1--', node)
        console.log('node.firstChild ', node.firstChild)
        let wordLen = node.firstChild.textContent.length
        if (caretPos > wordLen) caretPos = wordLen
        if (caretPos < 0) caretPos = 0
        console.log('node.firstChild caretPos ', caretPos)
        range.setStart(node.firstChild, caretPos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    getSpanById = (wordIndex) => {
        let spans = this.editableRef.childNodes
        for (let i = 0; i < spans.length; i++) {
            if (parseInt(spans[i].id) === wordIndex) return { node: spans[i], index: i }
        }
        return { node: null, index: null }
    }

    componentDidMount() {
        const { index, playerChange, editorFocus } = this.props;
        console.log(`Editable${index}DidMount `)
        let { playerActiveIndex } = playerChange
        const { activeIndex, activeWordIndex, caretPosition } = editorFocus
        this.isEditing = index === activeIndex
        this.isPlaying = index === playerActiveIndex
        console.log(`...this.isEditing: ${this.isEditing} this.isPlaying: ${this.isPlaying} `)
        console.log(`...this.firstEditableIndex: ${this.firstEditableIndex} this.lastEditableIndex: ${this.lastEditableIndex}`)

        if (this.isEditing) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            this.isEditorClean = false
            console.log(`Setting caret to ${activeWordIndex}-${caretPosition}`)
            this.setCaretPos(activeWordIndex, caretPosition);
        }
    }

    componentDidUpdate() {
        const { index, playerChange, editorFocus } = this.props;
        let { playerActiveIndex } = playerChange
        const { activeIndex, activeWordIndex, caretPosition } = editorFocus
        console.log(`Editable${index}DidUpdate`)
        console.log(`...this.isEditing: ${this.isEditing} this.isPlaying: ${this.isPlaying}`)
        console.log(`...this.firstEditableIndex: ${this.firstEditableIndex} this.lastEditableIndex: ${this.lastEditableIndex}`)
        console.log(`...activeWordIndex: ${activeWordIndex} caretPosition: ${caretPosition} this.lastCaretPosition ${this.lastCaretPosition}`)

        if (this.isEditing) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            this.isEditorClean = false
            console.log(`Setting caret to ${activeWordIndex}-${caretPosition}`)
            this.setCaretPos(activeWordIndex, caretPosition);
            this.lastCaretPosition = caretPosition
        }
    }

}

const mapStateToProps = ({ handleTimeChange, playerStatus, editorFocus }) => {
    return { playerChange: handleTimeChange, playerStatus, editorFocus };
}

export default connect(mapStateToProps, { setEditorFocus })(Editable2);