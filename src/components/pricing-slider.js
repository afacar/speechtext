import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Slider from 'rc-slider';
import { Row, Col, Container, Form } from "react-bootstrap";
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
  20: '20',
  30: '30',
  40: '40',
  50: '50'
};

export default class PricingSlider extends Component {

    render() {
        const { duration, durationChanged } = this.props;
        return (
          <div className='slider-container'>
              {/* <div style={style}> */}
                <h4>
                    <FormattedMessage id={"Payment.Slider.Header"} />
                </h4>
                <Container className="">
                    <Row>
                        <Col lg='10' md='10' sm='8'>
                          <Slider min={1} marks={marks} step={1} max={50}
                              className='slider'
                              value={duration}
                              onChange={durationChanged} defaultValue={5}
                              railStyle={{ backgroundColor: "white", height: "0.5rem" }}
                              dotStyle={{ height: "0.5rem" }}
                              trackStyle={[{ height: "0.5rem" }, { backgroundColor: 'red' }, { backgroundColor: 'orange' }]}
                            />
                        </Col>
                        <Col lg='2' md='2' sm='4' className='duration-to-buy-container'>
                            <label for="chooseHours" className='duration-to-buy-header'>
                              <FormattedMessage id={"Payment.DurationType.hours"} />
                            </label>
                            <Form.Control
                              id="chooseHours"
                              name='duration'
                              type='number'
                              value={duration}
                              max={50}
                              min={1}
                              onChange={durationChanged}
                              className='duration-to-buy'
                            />
                        </Col>  
                    </Row>
                </Container>
              {/* </div> */}
          </div>
        )
    }
}