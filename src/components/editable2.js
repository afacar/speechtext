import React from 'react';
import { connect } from "react-redux";
import _ from "lodash";

import { setEditorFocus } from "../actions";

const exclusiveKeyCodes = [9, 13, 16, 17, 18, 20, 27, 93, 225, 144, 35, 36, 37, 38, 39, 40];
const KEYCODES = { BACKSPACE: 8, ENTER: 13, DEL: 46, LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 }
console.log('Editable2 Import!')

class Editable2 extends React.Component {
    isEditorClean = true
    isBackSpaceActive = true
    isDelActive = true
    lastCaretPosition = null
    lastActiveWordIndex = null
    isEditing = false
    isPlaying = false
    isFocused = false
    isBlurred = false

    state = {
        copyPasteOp: false,
        keyUpCounter: 2,
    }

    shouldComponentUpdate(nextProps, nextStates) {
        const { index } = this.props;
        console.log(`Editable${index}ShouldUpdate props `, this.props, nextProps)
        //const { playerActiveIndex, playerActiveWordIndex } = nextProps.playerChange
        const nextEditor = nextProps.editorFocus
        const thisEditor = this.props.editorFocus

        this.isEditing = index === nextEditor.activeIndex
        this.isPlaying = index === nextProps.playerActiveIndex
        this.isPlayed = index < nextProps.playerActiveIndex

        const isEditingWordChanged = this.isEditing && !_.isEqual(thisEditor, nextEditor)
        //const isPlayingWordChanged = this.isPlaying && this.props.playerActiveWordIndex !== nextProps.playerActiveWordIndex
        let lastPlayingSpanIndex = this.getSpanIndexById(nextProps.playerActiveWordIndex);
        if (this.isPlayed) {
            this.editableRef.classList.add('isPlayed')
        } else if (this.isPlaying) {
            if (this.editableRef.classList.contains('isPlayed')) {
                this.editableRef.classList.remove('isPlayed')
            }
            for (let i = 0; i < this.editableRef.childNodes.length; i++) {
                let span = this.editableRef.childNodes[i]
                if (i <= lastPlayingSpanIndex && !span.classList.contains('isPlayed')) {
                    span.classList.add('isPlayed')
                }
                else if (i > lastPlayingSpanIndex && span.classList.contains('isPlayed')) {
                    span.classList.remove('isPlayed')
                }
            }
        } else {
            this.editableRef.classList.remove('isPlayed')
            for (let i = 0; i < this.editableRef.childNodes.length; i++) {
                let span = this.editableRef.childNodes[i]
                if (span.classList.contains('isPlayed'))
                    span.classList.remove('isPlayed')
            }
        }

        if (isEditingWordChanged) {
            return true;
        }

        return false
    }

    getSpanIndexById = (wordIndex) => {
        let id = wordIndex + ''
        var childNodes = this.editableRef.childNodes
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].id === id) return i
        }
        return -1
    }

    getLastSpanIndex = (wordIndex) => {
        var lastSpanId = parseInt(this.editableRef.lastElementChild.id)
        if (lastSpanId === wordIndex) return wordIndex

        for (let i = this.editableRef.childNodes.length - 1; i >= wordIndex; i--) {
            if (this.editableRef.childNodes[i].textContent.trim() !== '') return i
        }
        return -1
    }

    onKeyDown = (e) => {
        const { index, transcript, splitData, mergeData, isLastEditable, setEditorFocus, mergeSpans } = this.props;
        //console.log(`onKeyDown is`, e.keyCode)
        let sel = document.getSelection()
        console.log("Selection", sel);
        console.log("Transcript", transcript);
        //console.log('onKeyDown sel>', sel)
        let offset = sel.focusOffset
        let text = sel.focusNode.innerText || sel.focusNode.textContent
        let id = sel.focusNode.nodeName !== 'SPAN' ? sel.focusNode.parentNode.id : sel.focusNode.id
        if (!id) {
            id = sel.focusNode.parentNode ? sel.focusNode.parentNode.parentNode.id : '';
        }
        let wordIndex = parseInt(id) || parseInt(id.substring(id.lastIndexOf('-') + 1))
        let firstIndex = this.editableRef.firstElementChild ? parseInt(this.editableRef.firstElementChild.id) : wordIndex;
        let lastIndex = this.getLastSpanIndex(wordIndex)
        //console.log(`onKeyDown text is ${text} wordIndex ${wordIndex} and offset is ${offset} and #words is ${transcript.words.length} and textLen is ${text.length}`)
        this.lastCaretPosition = offset
        this.lastActiveWordIndex = wordIndex
        //this.setCaretPos(wordIndex, offset)
        //setEditorFocus(index, wordIndex, offset)

        if (![8, 13, 46, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) return;

        switch (e.keyCode) {
            case KEYCODES.BACKSPACE:
                console.log("Backspace clicked with offset, wordindex, firstindex and index", offset, " ", wordIndex, " ", firstIndex, " ", index)
                if (wordIndex === firstIndex && offset === 0) {
                    if (index > 0) {
                        console.log('Merge with prev paragraphs!')
                        e.preventDefault()
                        e.stopPropagation()
                        this.isBackSpaceActive = false
                        mergeData(index, (wordIndex, offset) => {
                            setEditorFocus(index - 1, wordIndex, offset)
                        })
                    } else if (index === 0) {
                        console.log(`onKeyDown do nothin!!!`)
                        this.isBackSpaceActive = false
                        e.preventDefault()
                        e.stopPropagation()
                    }
                    return
                }
                else if (wordIndex !== 0 && offset === 1) {
                    console.log(" Backspace two spans Should be merged")
                    let children = this.editableRef.childNodes;
                    let curNode = children[wordIndex];
                    let prevNode = children[wordIndex - 1];
                    let prevLen = prevNode.textContent.length;
                    prevNode.textContent = prevNode.textContent + curNode.textContent.substring(1);
                    this.editableRef.removeChild(curNode);
                    for (var j = 0; j < children.length; j++) {
                        children[j].id = j;
                    }
                    e.preventDefault()
                    e.stopPropagation()
                    mergeSpans(index, wordIndex, -1);
                    setEditorFocus(index, wordIndex - 1, prevLen);
                }
                break;
            case KEYCODES.ENTER:
                //console.log('Enter pressed')
                e.preventDefault()
                e.stopPropagation()
                if (wordIndex > firstIndex && wordIndex < lastIndex) {
                    console.log('Split paragraphs not from last word!')
                    splitData(index, wordIndex, offset, text.length)
                    setEditorFocus(index + 1, 0, 0)
                    return;
                } else if (wordIndex > firstIndex && wordIndex === lastIndex && offset <= text.length) {
                    console.log('Split paragraphs from last word!')
                    splitData(index, wordIndex, offset, text.length)
                    setEditorFocus(index + 1, 0, 0)
                    return;
                } else if (wordIndex === firstIndex && offset !== 0) {
                    console.log('Split paragraphs from first word!')
                    console.log('Split paragraphs from last word!')
                    splitData(index, wordIndex, offset + 1, text.length)
                    setEditorFocus(index + 1, 0, 0)
                    return;
                }
                break;
            case KEYCODES.DEL:
                console.log('Delete pressed')
                if (!isLastEditable && wordIndex === lastIndex && offset === text.length) {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Merge with next pressed')
                    this.isDelActive = false
                    mergeData(index + 1, () => {
                        setEditorFocus(index, wordIndex, offset);
                    })
                    // ??
                    return;
                } else if (isLastEditable && wordIndex === lastIndex && offset === text.length) {
                    console.log('onKeyDown do nothig')
                    this.isDelActive = false
                    e.preventDefault()
                    e.stopPropagation()
                    return
                } else if (wordIndex !== lastIndex && offset === text.length) {
                    console.log(" DELETE two spans Should be merged");
                    let children = this.editableRef.childNodes;
                    let curNode = children[wordIndex];
                    let nextNode = children[wordIndex + 1];
                    curNode.textContent = curNode.textContent + nextNode.textContent.substring(1);
                    this.editableRef.removeChild(nextNode);
                    for (var k = 0; k < children.length; k++) {
                        children[k].id = k;
                    }
                    e.preventDefault()
                    e.stopPropagation()
                    mergeSpans(index, wordIndex, 1);
                    setEditorFocus(index, wordIndex, offset);
                }
                break;
            case KEYCODES.LEFT:
            case KEYCODES.UP:
                if (index > 0 && wordIndex === firstIndex && offset === 0) {
                    console.log('LEFT OR UP pressed GO UP')
                    e.preventDefault()
                    e.stopPropagation()
                    setEditorFocus(index - 1, -1, -1)
                    //changeActiveIndex(index - 1, -1, -1)
                    return;
                }
                break;
            case KEYCODES.RIGHT:
            case KEYCODES.DOWN:
                if (!isLastEditable && wordIndex === lastIndex && offset === text.length) {
                    console.log('RIGHT OR DOWN pressed GO DOWN')
                    e.preventDefault()
                    e.stopPropagation()
                    this.props.setEditorFocus(index + 1, 0, 0)
                    //changeActiveIndex(index + 1, 0, 0)
                    return;
                }
                break;
            default:
                console.log('Unknown')
                break;
        } // End of Switch
        //this.props.setEditorFocus(index, wordIndex, offset)

    }

    onKeyUp = (e) => {
        if (!this.state.copyPasteOp && this.state.keyUpCounter === 1) {
            const { keyCode } = e;

            if (exclusiveKeyCodes.includes(keyCode)) return;

            //console.log('onKeyUp!', keyCode)

            const { index, transcript, handleEditorChange } = this.props;
            let words = _.cloneDeep(transcript.words)
            words = words.map((word, i) => {
                word.word = ''
                return word
            })
            //console.log('onKeyUp PrevWords!', words)

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
            //console.log('onKeyUp sel>', sel)
            let offset = sel.focusOffset
            let text = sel.focusNode.innerText || sel.focusNode.textContent || ' '
            let isNodeSpan = sel.focusNode.parentNode.nodeName === 'SPAN'
            let id = isNodeSpan ? sel.focusNode.parentNode.id : 0
            let activeWordIndex = parseInt(id)
            if (!isNodeSpan) {
                //console.log('OnKeyUp node is not inside a span so Create span with activeWordIndex and append to childNodes')
                let newSpan = document.createElement('span')
                newSpan.id = activeWordIndex
                newSpan.tabIndex = activeWordIndex
                newSpan.innerText = text
                let word = { confidence: 1 }
                newSpan.className = this.decideClassName(word, true, false)
                console.log('newSpan is ready onKeyUp', newSpan)
                if (sel.focusNode.nodeName !== 'DIV' && this.editableRef.contains(sel.focusNode)) {
                    console.log('sel: ' + sel);
                    console.log('this.editableRef' + this.editableRef);
                    this.editableRef.removeChild(sel.focusNode);
                }
                this.editableRef.appendChild(newSpan)
            }
            console.log(`onKeyUp text is ${text} activeWordIndex ${activeWordIndex} and offset is ${offset} and words.length is ${transcript.words.length} and textLen is ${text.length}`)
            if (words[activeWordIndex])
                words[activeWordIndex].confidence = 1;
            var span = this.editableRef.childNodes[this.getSpanIndexById(activeWordIndex)];
            if (span && !span.classList.contains('red')) {
                span.classList.add('darkgoldenrod');
                span.style["text-decoration"] = "none";
            }
            let children = this.editableRef.childNodes
            //console.log('onKeyUp children:', children)
            let len = children.length
            //console.log('children.length=', children.length)
            //console.log('words.length=', words.length)
            for (let i = 0; i < len; i++) {
                // TODO: Check for missing spans and create newSpans to append 
                let child = children[i];
                console.log("NODES on KEYUP ", i, " ", child.textContent);
                let wordIndex = parseInt(child.id);
                console.log("NODES wordindex on KEYUP ", wordIndex);
                let newWord = child.innerText.trim()
                if (child.nodeName === 'SPAN' && !isNaN(wordIndex) && words.length > wordIndex) {
                    words[wordIndex].word = newWord
                }
            }

            //console.log(`transcript object final`, words)
            //this.lastCaretPosition = offset
            //this.props.setEditorFocus(index, activeWordIndex, this.lastCaretPosition)
            handleEditorChange(index, words)
        }
        else {
            var keyUpCounter = this.state.keyUpCounter;
            keyUpCounter -= 1;
            if (keyUpCounter === 0)
                keyUpCounter = 2;
            this.setState({
                copyPasteOp: false,
                keyUpCounter
            })
        }
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
        //console.log(`Editable${this.props.index} onClick`)
        //let { focusNode, focusOffset } = document.getSelection()
        //let id = focusNode.parentNode.nodeName === 'SPAN' ? focusNode.parentNode.id : 0
        //let activeWordIndex = parseInt(id)
        //this.lastActiveWordIndex = activeWordIndex
        //this.lastCaretPositio = focusOffset
        //this.props.setEditorFocus(this.props.index, activeWordIndex, sel.focusOffset)
    }

    onFocus = (e) => {
        console.log(`Editable${this.props.index} onFocus`)
        this.isFocused = true
        this.isEditing = true
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
        if (word.confidence < 0.6) className += ' not-so-confident';
        if (word.confidence === 1) className += ' fixed-word';

        return className;
    }

    onDisableEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    render = () => {
        const { index, transcript, changePlayerTime } = this.props;
        let words = transcript.words.map((word, wordIndex) => {
            let preword = ' '
            if (wordIndex === 0) preword = ''
            return (
                <span
                    className={this.decideClassName(word)}
                    onDoubleClick={() => changePlayerTime(parseFloat(word.startTime.seconds) + parseFloat(word.startTime.nanos / 1000))}
                    onPaste={(event) => this.onDisableEvent(event)}
                    onCut={(event) => this.onDisableEvent(event)}
                    key={wordIndex}
                    tabIndex={index}
                    id={wordIndex}
                    contentEditable='true'
                    suppressContentEditableWarning='true'
                    title={this.formatTime(word.startTime) + '-' + this.formatTime(word.endTime)}
                >
                    {word.word ? preword + word.word : ''}
                </span>
            )
        })
        // console.log(`Editable${index} Rendering words>>>`, words)
        return (
            <div
                className='editable-content-wrapper'
                ref={(input) => { this.editableRef = input }}
                key={index}
                id={'editable-content-' + index}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
                onClick={this.onClick}
                onInput={this.onInput}
                onPaste={this.onDisableEvent}
                onCut={(event) => this.onDisableEvent(event)}
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
        if (wordIndex === -1) {
            wordIndex = childNodes.length - 1
            console.log('wordIndex ', wordIndex)
            console.log(' childNodes[wordIndex] ', childNodes[wordIndex])
            caretPos = caretPos === -1 ? childNodes[wordIndex].textContent.length : caretPos
            console.log('calculated caretPos is', caretPos)
        }
        let node = childNodes[wordIndex]
        if (!node) {
            // Create span with wordIndex and append to childNodes
            console.log('Create span with wordIndex and append to childNodes')
            node = document.createElement('span')
            node.id = wordIndex ? wordIndex : 0
            node.tabIndex = wordIndex ? wordIndex : 0
            let word = { confidence: 1 }
            node.className = this.decideClassName(word, true, false)
            console.log('newNode is', node)
            this.editableRef.appendChild(node)
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

    componentDidMount() {
        const { index, playerActiveIndex, editorFocus } = this.props;
        // console.log(`Editable${index}DidMount `)
        const { activeIndex, activeWordIndex, caretPosition } = editorFocus
        this.isEditing = index === activeIndex
        this.isPlaying = index === playerActiveIndex
        // console.log(`...this.isEditing ${this.isEditing} this.isFocused: ${this.isFocused} this.isPlaying: ${this.isPlaying} `)

        if (this.isEditing) {
            !this.isFocused && this.editableRef.focus();
            this.isEditorClean = false
            console.log(`Setting caret to ${activeWordIndex}-${caretPosition}`)
            this.setCaretPos(activeWordIndex, caretPosition);
        }
    }

    componentDidUpdate() {
        const { index, editorFocus } = this.props;
        const { activeWordIndex, caretPosition } = editorFocus
        console.log(`Editable${index}DidUpdate isEditing ${this.isEditing} isFocused ${this.isFocused} isPlaying ${this.isPlaying}`)
        console.log(`...activeWordIndex: ${activeWordIndex} caretPosition: ${caretPosition}`)
        console.log(`this.lastActiveWordIndex ${this.lastActiveWordIndex} this.lastCaretPosition ${this.lastCaretPosition}`)
        if (this.isEditing) {
            this.isEditorClean = false

        }
    }

}

const mapStateToProps = ({ handleTimeChange, playerStatus, editorFocus }) => {
    const { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
    return { playerActiveIndex, playerActiveWordIndex, playerStatus, editorFocus };
}

export default connect(mapStateToProps, { setEditorFocus })(Editable2);