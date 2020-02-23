import React, { Component } from 'react';
import _ from 'lodash';

import TranscriptEditor, {
  withTime
} from '../transcription';

import '../../styles/transcript-editor.css';

class EditorView extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      decorator: 'withTime',
      decorators: {
        withTime: editorStateToBeDecorated =>
        withTime(editorStateToBeDecorated, props.currentTime)
      }
    };
  }

  componentWillReceiveProps({ currentTime }) {
    this.setState({
      decorators: {
        withTime: editorStateToBeDecorated =>
        withTime(editorStateToBeDecorated, currentTime)
      }
    })
  }

  componentDidMount() {
    if(!_.isEmpty(this.editor)) {
      this.editor.focus();
    }
  }

  handleChange = ({ editorState, speakers }) => {
    this.setState({
      editorState,
      speakers
    });
    this.props.onTextChange(editorState);
  }

  // saveTranscript() {
  //   const transcript = convertToTranscript(
  //     this.state.editorState.getCurrentContent(),
  //     this.state.speakers
  //   );

  //   const blob = new Blob([JSON.stringify(transcript.toJSON(), null, 2)], {
  //     type: 'application/json;charset=utf-8',
  //   });

  //   window.open(URL.createObjectURL(blob));
  // }

  render() {
    if(_.isEmpty(this.props.editorState)) return <div></div>;
    return (
      <div>
            <TranscriptEditor
              ref={(editor) => {
                this.editor = editor;
              }}
              editorState={this.props.editorState}
              speakers={this.props.speakers}
              onChange={this.handleChange}
              showSpeakers
              editorState={this.state.decorators[this.state.decorator](this.props.editorState)}
            />
      </div>
    );
  }
}

export default EditorView;
