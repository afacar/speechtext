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
        const { index, activeWordIndex, editorFocus, activeIndex } = this.props;
        console.log(`Editable${index} shouldUpdate this.props `, this.props)
        console.log(`Editable${index} shouldUpdate nextProps `, nextProps)
        const { playerActiveIndex } = nextProps.handleTimeChange
        if (editorFocus.activeIndex === nextProps.editorFocus.activeIndex && editorFocus.activeWordIndex === nextProps.editorFocus.activeWordIndex && index !== playerActiveIndex) {
            console.log(`Editable${index} should NOT UPDATE`)
            return false
        }
        if (index === playerActiveIndex) {
            this.isEditorClean = false
            console.log(`Editable${index} should UPDATE due to playerActiveIndex`)
            return true
        } else if (editorFocus.activeWordIndex !== nextProps.editorFocus.activeWordIndex) {
            console.log(`Editable${index} should UPDATE due to activeWordIndex change`)
            return true
        } else if (!this.isEditorClean) {
            console.log(`Editable${index} should UPDATE due to isEditorClean`)
            this.isEditorClean = true
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
        console.log(`onKeyDown text is ${text} wordIndex ${wordIndex} and offset is ${offset} and #words is ${transcript.words.length} and textLen is ${text.length}`)
        console.log(`typeof(index): ${typeof (index)} `)
        console.log(`typeof(wordIndex): ${typeof (wordIndex)} `)
        console.log(`typeof(offset): ${typeof (offset)} `)
        switch (e.keyCode) {
            case KEYCODES.BACKSPACE:
                console.log('backspace pressed at index?', index)
                if (index > 0 && wordIndex === 0 && offset === 0) {
                    console.log('Merge with prev paragraphs!')
                    e.preventDefault()
                    e.stopPropagation()
                    this.isBackSpaceActive = false
                    mergeData(index)
                } else if (index === 0 && wordIndex === 0 && offset === 0) {
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
                if (wordIndex > 0 && wordIndex < transcript.words.length - 1) {
                    console.log('Split paragraphs!')
                    splitData(index, wordIndex, offset, text.length)
                }
                break;
            case KEYCODES.DEL:
                console.log('Delete pressed')
                if (!isLastEditable && wordIndex === transcript.words.length - 1 && offset === text.length) {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Merge with next pressed')
                    this.isDelActive = false
                    mergeData(index + 1)
                } else if (isLastEditable && wordIndex === transcript.words.length - 1 && offset === text.length) {
                    console.log('onKeyDown do nothig')
                    this.isDelActive = false
                    e.preventDefault()
                    e.stopPropagation()
                }
                break;
            case KEYCODES.LEFT:
            case KEYCODES.UP:
                if (index > 0 && wordIndex === 0 && offset === 0) {
                    console.log('LEFT OR UP pressed GO UP')
                    e.preventDefault()
                    e.stopPropagation()
                    changeActiveIndex(index - 1, -1, -1)
                }
                break;
            case KEYCODES.RIGHT:
            case KEYCODES.DOWN:
                if (!isLastEditable && wordIndex === transcript.words.length - 1 && offset === text.length) {
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
        const { index, transcript, handleTimeChange, editorFocus, activeIndex, activeWordIndex } = this.props;
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
        let node = el.childNodes[wordIndex]
        console.log('node.firstChild ', node.firstChild)
        range.setStart(node.firstChild, caretPos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    componentDidMount() {
        const { index, transcript, handleTimeChange, activeIndex, editorFocus, activeWordIndex, caretPosition } = this.props;
        console.log(`Editable ${index} didMount`)
        let { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
        console.log(`activeIndex: ${activeIndex} playerActiveIndex: ${playerActiveIndex}`)
        let isPlaying = index === playerActiveIndex
        let isEditing = index === editorFocus.activeIndex
        if (isEditing) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            this.setCaretPos(editorFocus.activeWordIndex, editorFocus.caretPosition);
        } else if (isPlaying) {
            ReactDOM.findDOMNode(this.editableRef).focus();
        }
    }

    componentDidUpdate() {
        const { index, transcript, handleTimeChange, editorFocus } = this.props;
        let { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
        console.log(`Editable ${index} DidUpdate`)
        console.log(`activeIndex: ${editorFocus.activeIndex} playerActiveIndex: ${playerActiveIndex}`)
        let isPlaying = index === playerActiveIndex
        let isEditing = index === editorFocus.activeIndex
        if (isEditing) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            this.setCaretPos(editorFocus.activeWordIndex, editorFocus.caretPosition);
        } else if (editorFocus.activeIndex < 0 && isPlaying) {
            ReactDOM.findDOMNode(this.editableRef).focus();
        }
    }

}

const mapStateToProps = ({ handleTimeChange, playerStatus, editorFocus }) => {
    return { handleTimeChange, playerStatus, editorFocus };
}

export default connect(mapStateToProps)(Editable2);