import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Player, BigPlayButton, PlayToggle, ReplayControl, ForwardControl, VolumeMenuButton, PlaybackRateMenuButton, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
import YouTube from 'react-youtube';
import '../../styles/editor.css'

class VideoPlayer extends Component {

  constructor(props) {
    super(props);
    this.onReady = this.onReady.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onError = this.onError.bind(this);
    this.onPlaybackQualityChange = this.onPlaybackQualityChange.bind(this);
    this.onPlaybackRateChange = this.onPlaybackRateChange.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.state = {
      player: undefined
    }

  }
  componentDidMount() {
    // this.video.addEventListener('play', () => this.startInterval());
    // this.video.addEventListener('pause', () => this.stopInterval());
    // this.video.addEventListener('seeked', () => this.updateTime());
    if (this.props.mediaType !== 'youtube')
      this.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }
  handleStateChange(state, prevState) {
    // copy player state to this component's state
    this.props.onTimeUpdate(state.currentTime)
  }
  startInterval() {
    this.interval = setInterval(() => {
      this.updateTime();
    }, 100);
  }

  stopInterval() {
    clearInterval(this.interval);
  }

  updateTime() {
    if (this.props.onTimeUpdate) {
      this.props.onTimeUpdate(this.video.currentTime);
    }
  }

  youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
  }

  onReady(event) {
    console.log(`YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`); // eslint-disable-line
    this.props.setPlayer(event.target)
  }

  onPlay(event) {
    console.log("on play ", event)
  }

  onPause(event) {
    console.log("onPause ", event)
  }

  onError(event) {
    console.log("onError ", event)
  }

  onEnd(event) {
    console.log("onEnd ", event)
  }

  onStateChange(event) {
    console.log("onStateChange ", event)
  }

  onPlaybackRateChange(event) {
    console.log("onPlaybackRateChange ", event)
  }

  onPlaybackQualityChange(event) {
    console.log("onPlaybackQualityChange ", event)
  }

  render() {
    /* eslint-disable jsx-a11y/media-has-caption */
    return (
      <div>
        {
          this.props.mediaType === 'youtube' && (
            <YouTube
              ref={(c) => { this.player = c; }}
              videoId={this.youtube_parser(this.props.src)}
              id={this.youtube_parser(this.props.src)}
              onReady={this.onReady}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onEnd={this.onEnd}
              onError={this.onError}
              onStateChange={this.onStateChange}
              onPlaybackRateChange={this.onPlaybackRateChange}
              onPlaybackQualityChange={this.onPlaybackQualityChange}
              className='player-container'
            />
          )
        }
        {
          this.props.mediaType !== 'youtube' && (
            <Player
              ref={(c) => { this.player = c; }}
              src={this.props.src}
              controls
              className='player-container'
              poster={this.props.poster || '../assets/audio_thumbnail.png'}
            >
              <BigPlayButton position="center" />
              <ControlBar>
                <PlayToggle />
                <ReplayControl seconds={5} order={2.1} />
                <ForwardControl seconds={5} order={3.1} />
                <VolumeMenuButton vertical />
                <PlaybackRateMenuButton rates={[2, 1.5, 1, 0.5, 0.1]} />
              </ControlBar>
            </Player>
          )
        }

      </div>
    );
    /* eslint-enable */
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  onTimeUpdate: PropTypes.func,
};

VideoPlayer.defaultProps = {
  onTimeUpdate: null,
};

export default VideoPlayer;
