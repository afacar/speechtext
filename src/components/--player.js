import React, { Component, createRef } from 'react';
import _ from 'lodash';
import { withMediaProps } from 'react-media-player';
import { PlayerIcon } from 'react-player-controls';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import Slider from './--slider';
import { handleTimeChange, isPlaying } from "../actions";

import Backward from '../assets/five_seconds_backward.png';
import Forward from '../assets/five_seconds_forward.png';

import '../styles/player.css';
import { Dropdown } from 'react-bootstrap';

class SpeechTextPlayer extends Component {
    constructor(props) {
        super(props);

        this.timer = undefined;

        this.state = {
            currentTime: 0,
            timer: 0,
            muted: false,
            playing: false,
            playbackRate: 1.0
        };

        this.playerRef = createRef();
    }

    componentWillReceiveProps({ timeToSeek }) {
        console.log("component received timeToSeek ", timeToSeek)
        if (timeToSeek || timeToSeek === 0) {
            this.seekToTime(timeToSeek);
        } 
        if ( timeToSeek <= 1 ){
            this.seekToTime(1);
        }
    }

    _handlePlayPause = () => {
        this.setState({
            playing: !this.state.playing
        })
    }

    onTimeUpdate = (currentTime) => {
        console.log("On time update callled", currentTime);
        this.setState({
            currentTime,
            timer: currentTime,
        });
        // this.props.handleTimeChange(this.props.editorData, currentTime);
    }

    seekTo = (progress) => {
        console.log("seek to called", progress)
        console.log("seek duration", this.state.duration)
        var currentTime = this.state.duration * progress;
        this.setState({
            timer: currentTime,
            currentTime,
        })
        this.player.seekTo(currentTime);
        this.props.handleTimeChange(this.props.editorData, currentTime);
    }

    seekToTime = (second) => {
        console.log("seek to time called", second)
        if (second >= 0) {
            this.player.seekTo(second);
            this.setState({
                currentTime: second,
                timer: second,
            });
        }
    }

    ref = (player) => {
        this.player = player
    }

    onDuration = (duration) => {
        this.setState({
            duration
        })
    }

    onProgress = (progress) => {
        if (!this.state.seeking) {
            this.setState({
                progress,
                currentTime: progress.playedSeconds,
                timer: progress.playedSeconds
            })
            this.props.handleTimeChange(this.props.editorData, progress.playedSeconds);
        }
    }

    seeking = (flag) => {
        this.setState({
            seeking: flag
        })
    }

    onResume = () => {
        console.log("Resume pressed")
    }

    setPlaybackRate = (rate) => {
        this.setState({
            playbackRate: rate
        })
    }

    render() {
        const { media, src, type, fileName } = this.props;
        let disabled = _.isEmpty(src);
        if (!media) {
            return null;
        }
        return (
            <div className='player-container'>
                <div className='selected-file-name'>
                    { fileName}
                </div>
                <div className='player-controls-container'>
                    <div className='player-controls play-resume'>
                        {
                            <img src={Backward} alt='Rewind 5 seconds ' className='backward-icon' onClick={() => this.seekToTime(this.state.currentTime >= 5 ? this.state.currentTime - 5 : 0)} />
                        }
                        {
                            (!this.state.playing) && (
                                <PlayerIcon.Play onClick={() => {
                                    // this.createInterval();
                                    this.setState({ playing: true })
                                }} />
                            )
                        }
                        {
                            (this.state.playing) && (
                                <PlayerIcon.Pause onClick={() => {
                                    // this.stopInterval();
                                    this.setState({ playing: false })
                                }} />
                            )
                        }
                        <img src={Forward} alt='Fast forward 5 seconds' className='forward-icon' onClick={() => this.seekToTime(this.state.currentTime + 5)} />
                    </div>
                    <div className='player-controls mute-unmute'>
                        {
                            !this.state.muted &&
                            <PlayerIcon.SoundOn onClick={() => this.setState({ muted: true })} disabled={disabled} />
                        }
                        {
                            this.state.muted &&
                            <PlayerIcon.SoundOff onClick={() => this.setState({ muted: false })} disabled={disabled} />
                        }
                        {
                            <Dropdown className="playback-dropdown" size="sm">
                                <Dropdown.Toggle id="dropdown-custom-1" className="playback-dropdown-menu-toggle">{this.state.playbackRate + "x"}</Dropdown.Toggle>
                                <Dropdown.Menu className="playback-dropdown-menu">
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(0.2) }}>
                                        0.2x
                                    </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(0.4) }}>
                                        0.4x
                                    </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(0.5) }}>
                                        0.5x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(0.6) }}>
                                        0.6x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(0.8) }}>
                                        0.8x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(1.0) }}>
                                        1.0x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(1.2) }}>
                                        1.2x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(1.4) }}>
                                        1.4x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(1.5) }}>
                                        1.5x
                                            </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(1.6) }}>
                                        1.6x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(1.8) }}>
                                        1.8x
                                        </Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => { this.setPlaybackRate(2.0) }}>
                                        2.0x
                                        </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                    </div>
                    <div className='player-slider'>
                        <Slider
                            value={this.state.progress ? this.state.progress.playedSeconds / this.state.duration : 0}
                            duration={this.state.duration}
                            seekTo={this.seekTo}
                            playPause={this._handlePlayPause}
                            disabled={disabled}
                            seeking={this.seeking}
                        />
                    </div>
                </div>
                {
                    !_.isEmpty(this.props.src) && (
                        <ReactPlayer
                            className={`player ${type.startsWith('video') ? 'player-window' : ''}`}
                            url={this.props.src}
                            onSeek={this.onTimeUpdate}
                            onPlay={() => this.props.isPlaying(true)}
                            onPause={() => this.props.isPlaying(false)}
                            onEnded={() => this.setState({ playing: false })}
                            ref={this.ref}
                            playbackRate={this.state.playbackRate}
                            volume={this.state.volume} // TODO: slider might be added in the future 
                            muted={this.state.muted}
                            onDuration={this.onDuration}
                            onProgress={this.onProgress}
                            progressInterval={ 175 / this.state.playbackRate}
                            playing={this.state.playing}
                        />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = ({ user, selectedFile, playerStatus }) => {
    return { user, selectedFile, playerStatus };
}

export default connect(mapStateToProps, { handleTimeChange, isPlaying })(withMediaProps(SpeechTextPlayer));