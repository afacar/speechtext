import React, { Component, createRef } from 'react';
import _ from 'lodash';
import  { withMediaProps, Player } from 'react-media-player';
import { PlayerIcon } from 'react-player-controls';

import Slider from './slider';
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
        this.props.onTimeChanged(currentTime);
    }

    seekTo = (progress) => {
        var currentTime = this.props.media.duration * progress;
        this.props.media.seekTo(currentTime);
        this.props.onTimeChanged(currentTime);
    }

    seekToTime = (second) => {
        this.props.media.seekTo(second);
        this.setState({
            currentTime: second
        });
    }

    render() {
        const { media, src, type } = this.props;
        let disabled = _.isEmpty(src);
        if(!media) {
            return null;
        }
        return (
            <div className='player-container'>
                <div className='player-controls play-resume'>
                    {
                        !media.isPlaying &&
                        <PlayerIcon.Play onClick={ () => !disabled ? media.play() : null } />
                    }
                    {
                        media.isPlaying &&
                        <PlayerIcon.Pause onClick={ () => !disabled ? media.pause() : null } />
                    }
                </div>
                <div className='player-controls mute-unmute'>
                    {
                        !media.isMuted &&
                        <PlayerIcon.SoundOn onClick={ () => media.mute(true) } />
                    }
                    {
                        this.props.media.isMuted &&
                        <PlayerIcon.SoundOff onClick={ () => this.props.media.mute(false) } />
                    }
                </div>
                <div className='player-slider'>
                    <Slider
                        value={ this.state.currentTime / this.props.media.duration }
                        duration={ this.props.media.duration }
                        seekTo={ this.seekTo }
                        playPause={ this._handlePlayPause }
                    />
                </div>
                <Player
                    className={ `player ${type.startsWith('video') ? 'player-window' : ''}` }
                    src={ this.props.src }
                    onTimeUpdate={ this.onTimeUpdate }
                    onPlay={ this.props.onPlay }
                    onPause={ this.props.onPause }
                    ref={ this.playerRef }
                />
            </div>
        );
    }
}

export default withMediaProps(SpeechTextPlayer);