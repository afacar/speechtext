import React, { Component } from 'react';
import { TextField } from '@material-ui/core'
import '../../styles/editor.css'

import { Transcript } from 'transcript-model';

import TranscriptEditor, {
    convertFromTranscript,
    convertToTranscript,
    convertToJSON,
    withTime,
    withWords,
} from '../transcription';
import VideoPlayer from './video-player';


import '../../styles/transcript-editor.css';
import { EditorState } from 'draft-js';

class ManualEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            speakers: undefined,
            media: '',
            mediaPath: "",
            mediaType: 'youtube',
            currentTime: 0,
            showSpeakers: true,
            player: undefined,
            decorator: 'withTime',
            decorators: {
                withTime: editorStateToBeDecorated =>
                    withTime(editorStateToBeDecorated, props.currentTime)
            },
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDecoratorChange = this.handleDecoratorChange.bind(this);
        this.handleShowSpeakersChange = this.handleShowSpeakersChange.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleLoadTranscript = this.handleLoadTranscript.bind(this);
        this.loadTranscript = this.loadTranscript.bind(this);
        this.saveTranscript = this.saveTranscript.bind(this);
        this.onMediaInput = this.onMediaInput.bind(this);
        this.onMediaSubmit = this.onMediaSubmit.bind(this);
        this.setPlayer = this.setPlayer.bind(this);
    }

    handleChange({ editorState, speakers }) {
        this.setState({
            editorState,
            speakers,
        });
    }

    handleDecoratorChange({ target: { value } }) {
        this.setState({ decorator: value });
    }

    handleShowSpeakersChange({ target: { checked } }) {
        this.setState({ showSpeakers: checked });
    }

    handleTimeUpdate(time) {
        this.setState({ currentTime: time });
    }

    handleLoadTranscript() {
        const file = this.fileInput.files[0];
        this.fileInput.value = '';

        const fileReader = new FileReader();

        fileReader.onload = (event) => {
            const transcriptJSONString = event.target.result;
            const transcriptJSON = JSON.parse(transcriptJSONString);
            const transcript = Transcript.fromJSON(transcriptJSON);
            const { editorState, speakers } = convertFromTranscript(transcript);

            this.setState({
                editorState,
                speakers,
            });
        };

        fileReader.readAsText(file);
    }

    loadTranscript() {
        this.fileInput.click();
    }

    saveTranscript() {
        const transcript = convertToTranscript(
            this.state.editorState.getCurrentContent(),
            this.state.speakers,
        );

        const blob = new Blob([JSON.stringify(transcript.toJSON(), null, 2)], {
            type: 'application/json;charset=utf-8',
        });

        window.open(URL.createObjectURL(blob));
    }

    onMediaInput(event) {
        console.log("Mediapath\n ", event.target.value)
        this.setState({
            mediaPath: event.target.value
        })
    }

    onMediaSubmit() {
        const { mediaPath } = this.state;
        console.log("Submit event", mediaPath)
        let type = 'youtube'
        if (!mediaPath.includes('youtu'))
            type = 'source'
        this.setState({
            media: mediaPath,
            mediaType: type
        })
    }

    setPlayer(player) {
        this.setState({
            player
        })
    }

    render() {
        return (
            <div>
                <div className="row media-input">
                    {
                        !this.state.media && (
                            <div className="link-input">
                                <form
                                    onSubmit={this.onMediaSubmit}
                                    className='link-inner'
                                >
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="Video/Audio Link"
                                        placeholder="Insert link..."
                                        variant="outlined"
                                        value={this.state.mediaPath}
                                        helperText="Insert Youtube link..."
                                        onChange={(event) => this.onMediaInput(event)}
                                    />
                                </form>
                            </div>
                        )
                    }
                </div>
                <div className="row">
                    <div className="col-5">
                        {
                            this.state.media && (
                                <VideoPlayer
                                    //thumbnail TODO Put Thumbnail of video, undefined for audio 
                                    src={this.state.media}
                                    setPlayer={this.setPlayer}
                                    onTimeUpdate={this.handleTimeUpdate}
                                    mediaType={this.state.mediaType} />
                            )
                        }
                    </div>
                    <div className="col-7">
                        <TranscriptEditor
                            ref={(editor) => {
                                this.editor = editor;
                            }}
                            editorState={this.state.decorators[this.state.decorator](this.state.editorState)}
                            speakers={this.state.speakers}
                            onChange={this.handleChange}
                            showSpeakers={this.state.showSpeakers}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ManualEditor;