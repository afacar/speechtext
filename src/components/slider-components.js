import React from 'react';
 
export const WHITE_SMOKE = '#eee';

// A colored bar that will represent the current value
export const SliderBar = ({ value, style, disabled }) => (
    <div className='slider-bar'
        style={Object.assign({},
        {
            top: 0,
            bottom: 0,
            left: 0,
            width: `${value * 100}%`,
        },
        style)}
        disabled={ disabled }
    />
)
 
// A handle to indicate the current value
export const SliderHandle = ({ value, style, disabled }) => (
    <div className='handle'
        style={Object.assign({},
        {
            top: 0,
            left: `${value * 100}%`,
            marginTop: -4,
            marginLeft: -8,
        },
        style)}
        disabled={ disabled }
    />
)
