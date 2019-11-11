import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import _ from "lodash";

const exclusiveKeyCodes = [13, 16, 17, 18, 20, 27, 93, 225, 144, 37, 38, 39, 40];
const arrowKeyCodes = [35, 36, 37, 38, 39, 40]
const KEYCODES = { BACKSPACE: 8, ENTER: 13, DEL: 46 }
console.log('Editable2 Import!')

class Editable2 extends React.Component {
    isEditorClean = true

    shouldComponentUpdate(nextProps, nextStates) {
        const { index } = this.props;
        const { playerActiveIndex } = nextProps.handleTimeChange
        if (!_.isEqual(this.props.transcript, nextProps.transcript)) {
            console.log('Editable2 should render? this.props.transcript', this.props.transcript)
            console.log('Editable2 should render? nextProps.transcript', nextProps.transcript)
            return true
        } else if (index === playerActiveIndex) {
            this.isEditorClean = false
            return true
        } else if (!this.isEditorClean) {
            this.isEditorClean = true
            return true
        } 
        return false
    }

/*     getCaretPos() {
        var sel = document.getSelection && document.getSelection();
        console.log('selection is ', sel)
        if (sel && sel.rangeCount > 0) {
            //var range = sel.getRangeAt(0);
            let _range = sel.getRangeAt(0);
            let range = _range.cloneRange();
            range.selectNodeContents(this.editableRef);
            range.setEnd(range.endContainer, range.endOffset);
            console.log('getCaretPos:', range.toString().length)
            return range.toString().length;
        }
        return null
    } */

    onKeyDown = (e) => {
        const { index, transcript, splitData, mergeData } = this.props;
        if (![8, 13, 46].includes(e.keyCode)) return;
        console.log(`onKeyDown is`, e.keyCode)
        let sel = document.getSelection()
        //console.log('sel>', sel)
        let offset = sel.focusOffset
        let text = sel.focusNode.nodeValue
        let wordIndex = parseInt(sel.focusNode.parentNode.id)
        console.log(`onKeyDown text is ${text} wordIndex ${wordIndex} and offset is ${offset}`)
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
                    mergeData(index)
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
                if (wordIndex === transcript.words.length - 1 && offset === text.length) {
                    console.log('Merge with next pressed')
                    mergeData(index+1)
                }
                break;
            default:
                console.log('Unknown')
                break;
        }
    }

    onKeyUp = ({ keyCode }) => {
        console.log('onKeyUp!', keyCode)

        const { index, transcript, handleEditorChange } = this.props;
        let words = _.cloneDeep(transcript.words)
        words = words.map((word, i) => {
            word.word = ''
            return word
        })
        console.log(`onKeyUp is`, keyCode)

        //console.log(`Editable ${index} onKeyUp keyCode: ${keyCode}`)
        // call mapTextToState
        if (exclusiveKeyCodes.includes(keyCode)) return;
        //this.getCaretPos()
        let sel = document.getSelection()
        //console.log('sel>', sel)
        console.log('sel>', sel)
        console.log('sel.focusNode>', sel.focusNode)
        console.log('sel.focusOffset>', sel.focusOffset)
        console.log('sel.focusNode.parentNode.id>', sel.focusNode.parentNode.id)
        //console.log('sel.baseNode.parentElement.parentElement>', sel.baseNode.parentElement.parentElement)
        let children = sel.baseNode.parentElement.parentElement.children
        console.log('children:', children)
        var len = children.length
        console.log('children.length=', children.length)
        console.log('words.length=', words.length)
        for (var i = 0; i < len; i++) {
            var child = children[i];
            var wordIndex = child.id;
            var newWord = child.innerHTML.trim()
            words[wordIndex].word = newWord
        }
        console.log(`transcript object final`, words)
        handleEditorChange(index, words)
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

    decideClassName = (word, isActive) => {
        let className = 'editable-content';
        if (isActive) className += ' active-word';
        if (word.confidence < 0.6) className += ' not-so-confident';

        return className;
    }

    render = () => {
        const { index, transcript, handleTimeChange } = this.props;
        let { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
        console.log(`Editable ${index} renders!`)
        let words = transcript.words.map((word, wordIndex) => {
            let isActive = false
            if (index === playerActiveIndex && wordIndex === playerActiveWordIndex)
                isActive = true
            return (
                <span
                    className={this.decideClassName(word, isActive)}
                    key={wordIndex}
                    id={wordIndex}
                    contentEditable='true'
                    suppressContentEditableWarning='true'
                >
                    {word.word + ' '}
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
                onInput={this.onInput}
                onChange={this.onChange}
                contentEditable='true'
                suppressContentEditableWarning='true'
            >
                {words}
            </div>
        )
    } // render end

    componentDidUpdate() {
        const { index, transcript, handleTimeChange } = this.props;
        let { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
        let isFocus = index === playerActiveIndex
        if (isFocus) {
            ReactDOM.findDOMNode(this.editableRef).focus();
            /* if (lastKeyPressed === 8 || lastKeyPressed === 37) {
                this.setCaretPos(word.word.length + 1);
            } */
        }
    }

}

const mapStateToProps = ({ handleTimeChange, playerStatus }) => {
    return { handleTimeChange, playerStatus };
}

export default connect(mapStateToProps)(Editable2);