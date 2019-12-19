import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Slider, { Range } from 'rc-slider';
import { Overlay } from "react-bootstrap";
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

const marks = {
  1: {
    style: {
      fontSize: 17,
      color: 'green',
    },
    label: '1 hour',
  },
  5: {
    style: {
      fontSize: 17,
      color: 'green',
    },
    label: <strong>5 hours</strong>,
  } ,
  10: '10 hours',
  25: '25 hours',
  50: {
    style: {
      fontSize: 21,
      color: 'green',
    },
    label: <strong>50+ hours</strong>,
  },
};

const style = { height: 100, width: '100%', padding: 20, backgroundColor: 'rgb(224, 236, 210)' };
const parentStyle = { borderWidth: 1, width: '100%', backgroundColor: 'rgb(224, 236, 255)', borderRadius: 10, paddingBottom: 50, paddingRight: 15, paddingLeft: 15 };

const log = (val) => {
  console.log('slider val is', val)
}

export default class PricingSlider extends Component {

  render() {
    const { vertical, min, max, step, onChange, defaultValue } = this.props;
    return (
      <div style={parentStyle}>
        <div style={style}>
          <h4>Transcription Friendly Pricing :)</h4>
          <Slider min={1} marks={marks} step={1} max={50}
            onChange={log} defaultValue={5}
            railStyle={{ backgroundColor: 'black' }}
            dotStyle={{ backgroundColor: 'pink' }}
            trackStyle={[{backgroundColor: 'yellow'}, {backgroundColor: 'red'},{backgroundColor: 'orange'}]}
          />
        </div>
      </div>
    )
  }
}