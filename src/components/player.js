import React, { Component, createRef } from 'react';
import  {withMediaProps, Player } from 'react-media-player';
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

    _handlePlayPause = () => {
        this.props.media.playPause()
    }

    onTimeUpdate = (playerInfo) => {
        this.setState({
            currentTime: playerInfo.currentTime
        });
    }

    seekTo = (progress) => {
        console.log(this.props.media);
        this.props.media.seekTo(this.props.media.duration * progress);
    }

    render() {
        const { media } = this.props;
        if(!media) {
            return null;
        }
        return (
            <div className='player-container'>
                <div className='player-controls play-resume'>
                    {
                        !this.props.media.isPlaying &&
                        <PlayerIcon.Play onClick={ () => this.props.media.play() } />
                    }
                    {
                        this.props.media.isPlaying &&
                        <PlayerIcon.Pause onClick={ () => this.props.media.pause() } />
                    }
                </div>
                <div className='player-controls mute-unmute'>
                    {
                        !this.props.media.isMuted &&
                        <PlayerIcon.SoundOn onClick={ () => this.props.media.mute(true) } />
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
                    className='player-window'
                    src={ this.props.src }
                    onTimeUpdate={ this.onTimeUpdate }
                    useAudioObject
                    ref={ this.playerRef }
                />
            </div>
        );
    }
}

export default withMediaProps(SpeechTextPlayer);