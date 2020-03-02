import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Player, BigPlayButton, PlayToggle, ReplayControl, ForwardControl, VolumeMenuButton, PlaybackRateMenuButton, ControlBar , PosterImage} from 'video-react';
import 'video-react/dist/video-react.css'; // import css

class VideoPlayer extends Component {
  componentDidMount() {
    // this.video.addEventListener('play', () => this.startInterval());
    // this.video.addEventListener('pause', () => this.stopInterval());
    // this.video.addEventListener('seeked', () => this.updateTime());
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

  render() {
    /* eslint-disable jsx-a11y/media-has-caption */
    return (
      <div>
        <Player
          ref={(c) => { this.player = c; }}
          src={this.props.src}
          controls
          style={{ width: '100%' }}
          //poster="this.props.poster ||'../assets/audio_thumbnail.png'"
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
      </div>
    );
    /* eslint-enable */
  }
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  onTimeUpdate: PropTypes.func,
};

PosterImage.propTypes = {
  // The poster image url
  poster: PropTypes.string,

}

VideoPlayer.defaultProps = {
  onTimeUpdate: null,
};

export default VideoPlayer;
