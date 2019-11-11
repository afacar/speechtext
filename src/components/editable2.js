import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import ReactDOM from 'react-dom';
import _ from "lodash";

const exclusiveKeyCodes = [13, 16, 17, 18, 20, 27, 93, 225, 144, 37, 38, 39, 40];
const arrowKeyCodes = [37, 38, 39, 40]

class Editable2 extends React.Component {
    isEditorClean = true

    shouldComponentUpdate(nextProps, nextStates) {
        const { index } = this.props;
        const { playerActiveIndex } = nextProps.handleTimeChange
        if (index === playerActiveIndex) {
            this.isEditorClean = false
            return true
        } else if (!this.isEditorClean) {
            this.isEditorClean = true
            return true
        }
        return false
    }

    getCaretPos() {
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
    }

    onKeyDown = (e, data) => {
        const { index, wordIndex, changeIndexes, handleWordChange } = this.props;
        console.log(`editable onKeyDown index is ${data}`)
        //this.getCaretPos()
        if (e.keyCode === 13) {  // Return
            e.preventDefault();
            e.stopPropagation();
            this.getCaretPos()
            return console.log('Should handle return')
            //this.props.splitData(this.getCaretPos(), this.props.word.word.length);
        } else if (e.keyCode === 8) {    // Backspace
            return console.log('Should handle backspace')

            /* if (wordIndex === 0 && this.getCaretPos() === 0) {
                e.preventDefault();
                e.stopPropagation();
                //this.props.mergeData();
            } else if (wordIndex > 0 && this.getCaretPos() === 0) {
                e.preventDefault();
                e.stopPropagation();
                let newWordIndex = wordIndex - 1
                //changeIndexes(index, newWordIndex);
            } */
        }
    }

    onKeyUp = ({ keyCode }) => {
        console.log('onKeyUp!')

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
        this.getCaretPos()
        let sel = document.getSelection()
        //console.log('sel>', sel)
        //console.log('sel.baseNode>', sel.baseNode)
        //console.log('sel.baseNode.parentElement.parentElement>', sel.baseNode.parentElement.parentElement)
        let children = sel.baseNode.parentElement.parentElement.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i];
            var wordIndex = child.id;
            var newWord = child.innerHTML.trim()
            words[wordIndex].word = newWord

            /*             console.log('child is ', child)
                        console.log('child id is ', child.id)
                        console.log('child innerHTML is ', child.innerHTML) */
        }
        console.log(`transcript object final`, words)
        handleEditorChange(index, words)

    }

    onChange = (e) => {
        console.log('onChange e', e)
    }

    onClick = (e, data) => {
        console.log('onClick data is', data)
    }

    onFocus = (e, data, currentPos) => {
        console.log(`onFocus index is ${data} and caretPos is ${currentPos}`)
    }

    onBlur = (e) => {
        console.log('onBlur e is', e)
    }

    onInput = (e) => {
        console.log('onInput e is', e)
    }

    render = () => {
        const { index, transcript, handleTimeChange } = this.props;
        let { playerActiveIndex, playerActiveWordIndex } = handleTimeChange
        console.log(`Editor ${index} renders!`)
        let counter = 0;
        let words = transcript.words.map((word, wordIndex) => {
            let isActive = false
            if (index === playerActiveIndex && wordIndex === playerActiveWordIndex)
                isActive = true
            return (
                <WordEditor
                    index={index}
                    wordIndex={wordIndex}
                    word={word.word}
                    isActive={isActive}
                    //handleKeyPress={(e) => this.onKeyDown(e, wordIndex)}
                />
            )
        })
        //console.log('Editable2 Rendering words ready to render=>', words)
        return (
            <span
                className='editable-content-wrapper'
                id={'editable-content-' + index}
                contentEditable='true'
                onKeyUp={this.onKeyUp}
                suppressContentEditableWarning='true'
                onInput={this.onInput}
            >
                {words}
            </span>
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

class WordEditor extends React.Component {
    decideClassName = (word, isActive) => {
        let className = 'editable-content';
        if (isActive) className += ' active-word';
        if (word.confidence < 0.6) className += ' not-so-confident';

        return className;
    }

    getCaretPos() {
        var sel = document.getSelection && document.getSelection();
        //console.log('WordEditor selection is ', sel)
        if (sel && sel.rangeCount > 0) {
            //var range = sel.getRangeAt(0);
            let _range = sel.getRangeAt(0);
            let range = _range.cloneRange();
            range.selectNodeContents(this.editableRef);
            range.setEnd(range.endContainer, range.endOffset);
            console.log('WordEditor getCaretPos:', range.toString().length)
            return range.toString().length;
        }
        return null
    }

    onFocus = (e, data, currentPos) => {
        console.log(`WordEditor onFocus index is ${data} and caretPos is ${currentPos}`)
    }

    onClick = (e, data) => {
        console.log('WordEditor onClick data is', data)
    }


    onKeyDown = (e) => {
        console.log('WordEditor onDowndownkey')
    }

    onKeyUp = (e) => {
        console.log('WordEditor onDowndownUp')
    }

    onInput = (e) => {
        console.log('WordEditor onInput')
    }

    render() {
        const { wordIndex, word, isActive, handleKeyPress } = this.props;
        return (
            <span
                ref={(input) => { this.editableRef = input }}
                tabIndex={Math.random()}
                onFocus={(e) => this.onFocus(e, wordIndex, this.getCaretPos())}
                //onClick={(e) => this.onClick(e, wordIndex)}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                onInput={this.onInput}
                className={this.decideClassName(word, isActive)}
                key={wordIndex}
                id={wordIndex}>
                {word + ' '}
            </span>
        )
    }
}

const mapStateToProps = ({ handleTimeChange, playerStatus }) => {
    return { handleTimeChange, playerStatus };
}

export default connect(mapStateToProps)(Editable2);