import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Slider from 'rc-slider';
import { Container, Form } from "react-bootstrap";
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

const marks = {
  1: {
    style: {
      fontSize: 21,
      color: 'green',
    },
    label: "1",
  },
  10: '10',
  25: '25',
  50: '50'
};

const style = { height: 100, width: '100%', padding: 20, backgroundColor: 'rgb(224, 236, 210)' };
const parentStyle = { borderWidth: 1, width: '100%', backgroundColor: 'rgb(224, 236, 210)', borderRadius: 10, paddingBottom: 50, paddingRight: 15, paddingLeft: 15 };

export default class PricingSlider extends Component {

  render() {
    const { duration, durationChanged } = this.props;
    return (
      <div style={parentStyle}>
        <div style={style}>
          <h4>
            <FormattedMessage id={"Payment.Slider.Header"} /></h4>
          <Container className="d-flex flex-row justify-content-around">
            <Slider min={1} marks={marks} step={1} max={50}
              style={{ marginTop: "0.75rem" }}
              value={duration}
              onChange={durationChanged} defaultValue={5}
              railStyle={{ backgroundColor: "white", height: "0.5rem" }}
              dotStyle={{ height: "0.5rem" }}
              trackStyle={[{ height: "0.5rem" }, { backgroundColor: 'red' }, { backgroundColor: 'orange' }]}
            />
            <div className="d-flex justify-content-center flex-column" style={{ marginTop: "-1.75rem" }}>
              <label for="chooseHours" style={{ fontSize: 10, textAlign: 'center', marginLeft: 12, fontWeight: 'bold' }}>Choose Hours</label>
              <Form.Control
                id="chooseHours"
                name='duration'
                type='number'
                value={duration}
                max={50}
                min={1}
                onChange={durationChanged}
                style={{ fontSize: 21, fontWeight: 'bold', textAlign: 'center', width: "4rem", height: "3rem", borderRadius: "5px", marginLeft: 15 }}
              />
            </div>
          </Container>
        </div>
      </div>
    )
  }
}