import React, { Component, createRef } from 'react';
import _ from 'lodash';
import  { withMediaProps, Player } from 'react-media-player';
import { PlayerIcon } from 'react-player-controls';
import { connect } from 'react-redux';

import Slider from './slider';
import { handleTimeChange, isPlaying } from "../actions";

import '../styles/player.css';

class SpeechTextPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTime: 0
        };

        this.playerRef = createRef();
    }

    componentWillReceiveProps({ timeToSeek }) {
        if(timeToSeek || timeToSeek === 0) {
            this.seekToTime(timeToSeek);
        }
    }

    _handlePlayPause = () => {
        this.props.media.playPause()
    }

    onTimeUpdate = ({ currentTime }) => {
        this.setState({
            currentTime
        });
        this.props.handleTimeChange(this.props.editorData, currentTime);
    }

    seekTo = (progress) => {
        var currentTime = this.props.media.duration * progress;
        this.props.media.seekTo(currentTime);
        this.props.handleTimeChange(this.props.editorData, currentTime);
    }

    seekToTime = (second) => {
        this.props.media.seekTo(second);
        this.setState({
            currentTime: second
        });
    }

    render() {
        const { media, src, type, playerStatus } = this.props;
        let disabled = _.isEmpty(src);
        if(!media) {
            return null;
        }
        return (
            <div className='player-container'>
                <div className='player-controls play-resume'>
                    {
                        (!media.isPlaying || !playerStatus.isPlaying) &&
                        <PlayerIcon.Play onClick={ () => !disabled ? media.play() : null } disabled={ disabled } />
                    }
                    {
                        (media.isPlaying && playerStatus.isPlaying) &&
                        <PlayerIcon.Pause onClick={ () => !disabled ? media.pause() : null }  disabled={ disabled }/>
                    }
                </div>
                <div className='player-controls mute-unmute'>
                    {
                        !media.isMuted &&
                        <PlayerIcon.SoundOn onClick={ () => media.mute(true) } disabled={ disabled } />
                    }
                    {
                        this.props.media.isMuted &&
                        <PlayerIcon.SoundOff onClick={ () => this.props.media.mute(false) } disabled={ disabled } />
                    }
                </div>
                <div className='player-slider'>
                    <Slider
                        value={ this.state.currentTime / this.props.media.duration }
                        duration={ this.props.media.duration }
                        seekTo={ this.seekTo }
                        playPause={ this._handlePlayPause }
                        disabled={ disabled }
                    />
                </div>
                {
                    !_.isEmpty(this.props.src) &&
                    <Player
                        className={ `player ${type.startsWith('video') ? 'player-window' : ''}` }
                        src={ this.props.src }
                        onTimeUpdate={ this.onTimeUpdate }
                        onPlay={ () => this.props.isPlaying(true) }
                        onPause={ () => this.props.isPlaying(false) }
                        ref={ this.playerRef }
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile,  playerStatus }) => {
    return { user, selectedFile, playerStatus };
}

export default connect(mapStateToProps, { handleTimeChange, isPlaying })(withMediaProps(SpeechTextPlayer));