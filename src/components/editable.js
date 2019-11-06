import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

const exclusiveKeyCodes = [16, 17, 18, 20, 27, 93, 225, 144];
const arrowKeyCodes = [37, 38, 39, 40]
const keyPressed = {};
var lastKeyPressed = undefined;

class Editable extends PureComponent {

    getCaretPos() {
        let _range = document.getSelection().getRangeAt(0);
        let range = _range.cloneRange();
        range.selectNodeContents(this.editableRef);
        range.setEnd(_range.endContainer, _range.endOffset);
        console.log('getCaretPos:',range.toString().length)
        return range.toString().length;
    }

    // setCaretPos(pos) {
    //     // for contentedit field
    //     var range = document.createRange();
    //     var sel = window.getSelection();
    //     range.setStart(this.editableRef.childNodes[0], pos);
    //     range.collapse(true);
    //     sel.removeAllRanges();
    //     sel.addRange(range);
    //     return;
    // }

    onKeyDown = (e) => {
        lastKeyPressed = e.keyCode;
        keyPressed[e.keyCode] = true;
        if(e.keyCode === 13) {  // Return
            e.preventDefault();
            e.stopPropagation();
            this.props.splitData(this.getCaretPos(), this.props.word.word.length);
        } else if(e.keyCode === 8) {    // Backspace
            if(this.props.wordIndex === 0 && this.getCaretPos() === 0) {
                e.preventDefault();
                e.stopPropagation();
                this.props.mergeData();
            }
        }
    }

    handleChange = ({ keyCode }) => {
        const { index, wordIndex, changeIndexes, handleWordChange } = this.props;
        console.log(`index: ${index} and wordIndex: ${wordIndex}`)
        keyPressed[keyCode] = false;
        if(exclusiveKeyCodes.includes(keyCode) || arrowKeyCodes.includes(keyCode)) return;
        if(keyCode === 9) { // TAB
            changeIndexes(keyPressed[16] ? index - 1 : index + 1, 0);
        } else {
            let value = document.getSelection().baseNode.data;
            value && handleWordChange(index, wordIndex, value.trim());
        }
    }

    onBlur = () => {
        console.log('onBlur')
        if(lastKeyPressed === 37 || lastKeyPressed === 39) {
            let { index, wordIndex, changeIndexes } = this.props;
            if(lastKeyPressed === 37) {
                if(wordIndex !== 0) {
                    wordIndex -= 1;
                }
            } else if(lastKeyPressed === 39) {
                wordIndex += 1;
            }
            changeIndexes(index, wordIndex);
        }
    }

    decideClassName = (word, isActive) => {
        let className = 'editable-content';
        if(isActive) className += ' active-word';
        if(word.confidence < 0.6 ) className += ' not-so-confident';

        return className;
    }

    render = () => {
        const { index, wordIndex, isActive, word, changeIndexes } = this.props;
        return (
            <span className='editable-content-wrapper' contentEditable='false' suppressContentEditableWarning='true'>
                <span
                    id={ 'editable-content-' + index + "_" + wordIndex }
                    contentEditable='true'
                    suppressContentEditableWarning='true'
                    spellCheck='false'
                    tabIndex={ index + wordIndex }
                    ref={(input) => { this.editableRef = input; }} 
                    onClick={ e => changeIndexes(index, wordIndex) }
                    onKeyUp={ this.handleChange }
                    onKeyDown={ this.onKeyDown }
                    onFocus={ e => changeIndexes(index, wordIndex) }
                    onBlur={ this.onBlur }
                    className={ this.decideClassName(word, isActive) }
                >
                    { word.word + ' ' }
                </span>
            </span>
        )
    }

    componentDidUpdate() {
        const { isFocus } = this.props
        console.log('EditabledidUpdate and is Focus is:', isFocus)
        if(isFocus)
          this.focusDiv();
    }
      
    focusDiv() {
        ReactDOM.findDOMNode(this.editableRef).focus();
    }
}

export default Editable;