import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import _ from "lodash";

const exclusiveKeyCodes = [13, 16, 17, 18, 20, 27, 93, 225, 144, 35, 36, 37, 38, 39, 40];
const arrowKeyCodes = [35, 36, 37, 38, 39, 40]
const KEYCODES = { BACKSPACE: 8, ENTER: 13, DEL: 46, LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 }
console.log('Editable2 Import!')

class Editable2 extends React.Component {
    isEditorClean = true
    isBackSpaceActive = true
    isDelActive = true

    shouldComponentUpdate(nextProps, nextStates) {
        const { index, editorFocus, handleTimeChange } = this.props;
        console.log(`Editable${index}ShouldUpdate props `, this.props, nextProps)
        const { playerActiveIndex, playerActiveWordIndex } = nextProps.handleTimeChange
        const nextEditorFocus = nextProps.editorFocus
        const isActiveEditor = index === playerActiveIndex || index === nextEditorFocus.activeIndex
        const isActiveEditorChanged = editorFocus.activeIndex !== nextEditorFocus.activeIndex
        const isActiveWordChanged = isActiveEditorChanged || editorFocus.activeWordIndex !== nextEditorFocus.activeWordIndex
        const isEditing = editorFocus.caretPosition !== nextEditorFocus.caretPosition
        const isPlayingEditor = index === playerActiveIndex
        const isPlayingWordChanged = handleTimeChange.playerActiveWordIndex !== playerActiveWordIndex
        console.log('isEditorClean: ', this.isEditorClean)
        console.log('isActiveEditor: ', isActiveEditor)
        if (!this.isEditorClean && !isActiveEditor) {
            console.log(`Editable${index} UPDATES due to cleaning!`)
            this.isEditorClean = true
            return true
        }
        if (!isActiveEditor) {
            console.log(`Editor${index} SHOULD NOT UPDATE DUE TO INACTIVITY`)
            return false
        }
        if (!isActiveWordChanged && !isEditing) {
            console.log(`Editable${index} SHOULD NOT UPDATE DUE TO SAME activeIndex and activeWordIndex`)
            return false
        }
        if (isActiveWordChanged || isEditing) {
            this.isEditorClean = false
            console.log(`Editable${index} UPDATES DUE TO activeWordChange or editing`)
            return true
        }
        if (isPlayingEditor && isPlayingWordChanged) {
            this.isEditorClean = false
            console.log(`Editable${index} UPDATES DUE TO playerActiveWordIndex change`)
            return true
        }

        console.log(`Editable${index} should NOT UPDATE due to false`)
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
        let spanIndex = this.getSpanById(wordIndex).index
        let len = this.editableRef.childElementCount
        console.log(`onKeyDown text is ${text} wordIndex ${wordIndex} spanIndex ${spanIndex} and offset is ${offset} and #words is ${transcript.words.length} and textLen is ${text.length}`)

        switch (e.keyCode) {
            case KEYCODES.BACKSPACE:
                console.log('backspace pressed at index?', index)
                if (index > 0 && spanIndex === 0 && offset === 0) {
                    console.log('Merge with prev paragraphs!')
                    e.preventDefault()
                    e.stopPropagation()
                    this.isBackSpaceActive = false
                    mergeData(index)
                } else if (index === 0 && spanIndex === 0 && offset === 0) {
                    console.log(`onKeyDown do nothin!!!`)
                    this.isBackSpaceActive = false
                    e.preventDefault()
                    e.stopPropagation()
                }
                break;
            case KEYCODES.ENTER:
                console.log('Enter pressed')
                e.preventDefault()
                e.stopPropagation()
                if (spanIndex > 0 && spanIndex < len - 1) {
                    console.log('Split paragraphs!')
                    splitData(index, spanIndex, offset, text.length)
                }
                break;
            case KEYCODES.DEL:
                console.log('Delete pressed')
                if (!isLastEditable && spanIndex === len - 1 && offset === text.length) {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Merge with next pressed')
                    this.isDelActive = false
                    mergeData(index + 1)
                } else if (isLastEditable && spanIndex === len - 1 && offset === text.length) {
                    console.log('onKeyDown do nothig')
                    this.isDelActive = false
                    e.preventDefault()
                    e.stopPropagation()
                }
                break;
            case KEYCODES.LEFT:
            case KEYCODES.UP:
                if (index > 0 && spanIndex === 0 && offset === 0) {
                    console.log('LEFT OR UP pressed GO UP')
                    e.preventDefault()
                    e.stopPropagation()
                    changeActiveIndex(index - 1, -1, -1)
                }
                break;
            case KEYCODES.RIGHT:
            case KEYCODES.DOWN:
                if (!isLastEditable && spanIndex === len - 1 && offset === text.length) {
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

        let sel = document.getSelection()
        console.log('onKeyUp sel>', sel)
        let offset = sel.focusOffset
        let text = sel.focusNode.innerText || sel.focusNode.textContent
        let id = sel.focusNode.nodeName !== 'SPAN' ? sel.focusNode.parentNode.id : sel.focusNode.id
        let activeWordIndex = parseInt(id)
        console.log(`onKeyUp text is ${text} activeWordIndex ${activeWordIndex} and offset is ${offset} and #words is ${transcript.words.length} and textLen is ${text.length}`)

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
        let caretPosition = offset
        handleEditorChange(index, words, activeWordIndex, caretPosition)
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
        formattedTime += this.addZero(seconds) + '.' + this.addZero(nanos, 3);

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
        console.log('onChange e', e)
    }

    onClick = (e) => {
        console.log('onClick e is', e)
    }

    onFocus = (e) => {
        console.log(`onFocus e is `, e)
    }

    onBlur = (e) => {
        console.log('onBlur e is', e)
    }

    onInput = (e) => {
        console.log('onInput e is', e)
    }

    decideClassName = (word, isActive, isPlaying) => {
        let className = 'editable-content';
        if (isActive) className += ' active-word';
        if (isPlaying) className += ' playing-word';
        if (word.confidence < 0.6) className += ' not-so-confident';

        return className;
    }

    render = () => {
        const { index, transcript, handleTimeChange, editorFocus } = this.props;
        let { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
        console.log(`Editable ${index} renders!`)
        let words = transcript.words.map((word, wordIndex) => {
            let isActive = false
            let isPlaying = false
            if (index === playerActiveIndex && wordIndex === playerActiveWordIndex)
                isPlaying = true
            if (index === editorFocus.activeIndex && wordIndex === editorFocus.activeWordIndex)
                isActive = true
            return (
                <span
                    className={this.decideClassName(word, isActive, isPlaying)}
                    key={wordIndex}
                    id={wordIndex}
                    contentEditable='true'
                    suppressContentEditableWarning='true'
                    title={this.formatTime(word.startTime) + '-' + this.formatTime(word.endTime)}
                >
                    {word.word ? word.word + ' ' : ''}
                </span>
            )
        })
        //console.log('Editable2 Rendering words ready to render=>', words)
        return (
            <div
                className='editable-content-wrapper'
                ref={(input) => { this.editableRef = input }}
                tabIndex={index}
                //ref={input => this.editableRef = input}
                id={'editable-content-' + index}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
                contentEditable='true'
                suppressContentEditableWarning='true'
            >
                {words}
            </div>
        )
    } // render end

    setCaretPos = (wordIndex, caretPos) => {
        console.log('setCaretPos index', this.props.index)
        console.log('setCaretPos wordIndex', wordIndex)
        console.log('setCaretPos caretPos', caretPos)

        var el = this.editableRef
        var range = document.createRange();
        var sel = window.getSelection();
        // TODO: get node with ID not wordIndex
        let { node } = this.getSpanById(wordIndex)
        node = node ? node : this.editableRef.childNodes[wordIndex]
        console.log('node--', node)
        if (!node.firstChild) {
            console.log('firstChild empty so adding text to it')
            node.textContent = ' '
        }
        console.log('node1--', node)
        console.log('node.firstChild ', node.firstChild)
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
        const { index, handleTimeChange, editorFocus } = this.props;
        console.log(`Editable${index}DidMount with editorFocus ;`, editorFocus)
        let { playerActiveIndex } = handleTimeChange
        const { activeIndex, activeWordIndex, caretPosition } = editorFocus
        console.log(`...activeIndex: ${activeIndex} playerActiveIndex: ${playerActiveIndex}`)
        let isPlaying = index === playerActiveIndex
        let isEditing = index === activeIndex
        if (isEditing) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            this.isEditorClean = false
            this.setCaretPos(activeWordIndex, caretPosition);
        } else if (isPlaying) {
            this.isEditorClean = false
            ReactDOM.findDOMNode(this.editableRef).focus();
        }
    }

    componentDidUpdate() {
        const { index, handleTimeChange, editorFocus } = this.props;
        let { playerActiveIndex } = handleTimeChange
        const { activeIndex, activeWordIndex, caretPosition } = editorFocus
        console.log(`Editable${index}DidUpdate`)
        console.log(`...activeIndex: ${activeIndex} playerActiveIndex: ${playerActiveIndex}`)
        let isPlaying = index === playerActiveIndex
        let isEditing = index === activeIndex
        if (isEditing) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            this.isEditorClean = false
            this.setCaretPos(activeWordIndex, caretPosition);
        } else if (activeIndex < 0 && isPlaying) {
            this.isEditorClean = false
            ReactDOM.findDOMNode(this.editableRef).focus();
        }
    }

}

const mapStateToProps = ({ handleTimeChange, playerStatus, editorFocus }) => {
    return { handleTimeChange, playerStatus, editorFocus };
}

export default connect(mapStateToProps)(Editable2);