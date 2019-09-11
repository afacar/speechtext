import React, { Component } from 'react';
import { Slider as ReactSlider, Direction } from 'react-player-controls';

import { SliderBar, SliderHandle, WHITE_SMOKE } from './slider-components';

const styles = {
    slider: {
        width: 750,
        height: 8,
        borderRadius: 4,
        background: WHITE_SMOKE,
        transition: 'width 0.1s',
        cursor: true === true ? 'pointer' : 'default',
    }
}
class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            lastValueStart: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }

    onSliderChange = (value) => {
        this.setState({
            value
        });
    }

    onSliderChangeStart = (value) => {
        this.props.playPause();
        this.setState({
            lastValueStart: value
        });
    }

    onSliderChangeEnd = (value) => {
        this.setState({
            value
        });
        if(value) {
            this.props.seekTo(value);
            this.props.playPause();
        }
    }

    formatTime = (time) => {
        time = time.toFixed(0);
        let seconds = (time % 60).toFixed(0);
        let minutes = (time / 60).toFixed(0);
        let hours = (minutes / 60).toFixed(0);
        if(hours > 0) {
            minutes = (minutes % 60).toFixed(0);
        }
        if(hours < 10) hours = `0${hours}`;
        if(minutes < 10) minutes = `0${minutes}`;
        if(seconds < 10) seconds = `0${seconds}`;
        return `${hours}:${minutes}:${seconds}`;
    }

    render() {
        return (
            <ReactSlider
                isEnabled={ true }
                direction={ Direction.HORIZONTAL }
                onChange={ this.onSliderChange }
                onChangeStart={ this.onSliderChangeStart }
                onChangeEnd={ this.onSliderChangeEnd }
                style={ styles.slider }
            >
                <SliderBar direction={ Direction.HORIZONTAL } value={ this.state.value } />
                <SliderHandle direction={ Direction.HORIZONTAL } value={ this.state.value } />
                <span className='player-time'>
                    {`${this.formatTime(this.state.value * this.props.duration)} / ${this.formatTime(this.props.duration)}`}
                </span>
            </ReactSlider>
        )
    }
}

export default Slider;