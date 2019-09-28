import React, { Component } from 'react';
import { Slider as ReactSlider, Direction } from 'react-player-controls';

import { SliderBar, SliderHandle, WHITE_SMOKE } from './slider-components';

const styles = {
    slider: {
        width: 750,
        height: 8,
        borderRadius: 4,
        background: WHITE_SMOKE,
        transition: 'width 0s',
        cursor: 'pointer'
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
        if(this.props.duration > 0.1) {
            this.setState({
                value
            });
        }
    }

    onSliderChangeStart = (value) => {
        if(this.props.duration > 0.1) {
            this.props.playPause();
            this.setState({
                lastValueStart: value
            });
        }
    }

    onSliderChangeEnd = (value) => {
        if(this.props.duration > 0.1) {
            this.setState({
                value
            });
            if(value) {
                this.props.seekTo(value);
                this.props.playPause();
            }
        }
    }

    formatTime = (time) => {
        time = Math.floor(time);
        let seconds = Math.floor(time % 60);
        let minutes = Math.floor(time / 60);
        let hours = Math.floor(minutes / 60)
        if(hours > 0) {
            minutes = Math.floor(minutes % 60);
        }
        if(hours < 10) hours = `0${hours}`;
        if(minutes < 10) minutes = `0${minutes}`;
        if(seconds < 10) seconds = `0${seconds}`;
        if(!hours) hours = '00';
        if(!minutes) minutes = '00';
        if(!seconds) seconds = '00';
        return `${hours}:${minutes}:${seconds}`;
    }

    render() {
        const duration = this.formatTime(this.props.duration);
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
                    {`${this.formatTime(this.state.value * this.props.duration)} / ${duration}`}
                </span>
            </ReactSlider>
        )
    }
}

export default Slider;