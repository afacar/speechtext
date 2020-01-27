import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';

import '../../styles/pricing.css';

class Pricing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAuth: false
        }
    }

    handleClose = () => {
        this.setState({
            showAuth: false
        })
    }

    handleBuyNowButton = (selectedType) => {
        const { user } = this.props;
        if(_.isEmpty(user)) {
            this.setState({ showAuth: true });
        } else if(user.currentPlan) {
            const { type } = user.currentPlan;
            if(type === 'Demo') {
                if(selectedType !== 'Demo') {
                    this.props.history.push('/user#payment');
                } else {
                    this.props.history.push('/dashboard');
                }
            } else {
                this.props.history.push('/user#payment');
            }
        }
    }

    render() {
        return (
            <div>
                <div className='pricing-content'>
                    <p className='title'>
                        <FormattedMessage id="Pricing.title" />
                    </p>
                    <h3>
                        <i><FormattedMessage id='Pricing.message' /></i>
                    </h3>
                    <br />
                    <Row>
                        <Col lg='7' md='7'>
                            <svg version="1.2" class="graph" aria-labelledby="title" role="img">
                                <polyline
                                    fill="none"
                                    stroke="#384d60"
                                    stroke-width="5"
                                    points="
                                    90,77
                                    392,161
                                    684,245
                                    850,287
                                    900,287"/>
                                <g class="grid x-grid" id="xGrid">
                                <line x1="90" x2="90" y1="5" y2="371"></line>
                                </g>
                                <g class="grid y-grid" id="yGrid">
                                    <line x1="90" x2="905" y1="370" y2="370"></line>
                                </g>
                                <g class="labels x-labels">
                                    <text x="100" y="400">1</text>
                                    <text x="186" y="400">10</text>
                                    <text x="326" y="400">20</text>
                                    <text x="466" y="400">30</text>
                                    <text x="606" y="400">40</text>
                                    <text x="746" y="400">50+</text>
                                    <text x="850" y="400">
                                        <FormattedMessage id='Pricing.contactUs' />
                                    </text>
                                    <text x="450" y="440" class="label-title">
                                        <FormattedMessage id='Pricing.hoursLabel' />
                                    </text>
                                </g>
                                <g class="labels y-labels">
                                    <text x="86" y="77">$9 <FormattedMessage id='Pricing.hourSubText' /></text>
                                    <text x="60" y="200" class="label-title">
                                        <FormattedMessage id='Pricing.priceLabel' />
                                    </text>
                                </g>
                                <g class="data" data-setname="Our first data set">
                                    <circle cx="186" cy="104" data-value="8.1" r="5"></circle>
                                    <text x='156' y='132'>$8 <FormattedMessage id='Pricing.hourSubText' /></text>
                                    <circle cx="326" cy="142" data-value="7.7" r="5"></circle>
                                    <text x='296' y='174'>$7 <FormattedMessage id='Pricing.hourSubText' /></text>
                                    <circle cx="466" cy="182" data-value="6.8" r="5"></circle>
                                    <text x='436' y='216'>$6 <FormattedMessage id='Pricing.hourSubText' /></text>
                                    <circle cx="606" cy="223" data-value="6.7" r="5"></circle>
                                    <text x='574' y='257'>$5 <FormattedMessage id='Pricing.hourSubText' /></text>
                                    <circle cx="746" cy="260" data-value="6.7" r="5"></circle>
                                    <text x='720' y='299'>$4.5 <FormattedMessage id='Pricing.hourSubText' /></text>
                                </g>
                            </svg>
                        </Col>
                        <Col lg='5' md='5' className='side-message'>
                            <div className='side-message-title'>
                                <FormattedHTMLMessage id='Pricing.sideMessage.title' />
                            </div>
                            <br />
                            <ul>
                                <li>
                                    <FormattedMessage id='Pricing.sideMessage.message1' />
                                </li>
                                <li>
                                    <FormattedMessage id='Pricing.sideMessage.message2' />
                                </li>
                                <li>
                                    <FormattedMessage id='Pricing.sideMessage.message3' />
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
                <div className='pricing-mobile-content'>
                    <p className='title'>
                        <FormattedMessage id="Pricing.title" />
                    </p>
                    <h3 align='center'>
                        <i><FormattedMessage id='Pricing.message' /></i>
                    </h3>
                    <br />
                    <svg version="1.2" class="graph" aria-labelledby="title" role="img">
                        <polyline
                            fill="none"
                            stroke="#384d60"
                            stroke-width="5"
                            points="
                            90,56
                            130,98
                            180,140
                            230,182
                            280,224,
                            330,266,
                            430,266"/>
                        <g class="grid x-grid" id="xGrid">
                        <line x1="90" x2="90" y1="5" y2="371"></line>
                        </g>
                        <g class="grid y-grid" id="yGrid">
                            <line x1="90" x2="1005" y1="370" y2="370"></line>
                        </g>
                        <g class="labels x-labels">
                            <text x="100" y="400">1</text>
                            <text x="130" y="400">10</text>
                            <text x="180" y="400">20</text>
                            <text x="230" y="400">30</text>
                            <text x="280" y="400">40</text>
                            <text x="330" y="400">50+</text>
                            <text x="230" y="440" class="label-title">
                                <FormattedMessage id='Pricing.hoursLabel' />
                            </text>
                        </g>
                        <g class="labels y-labels">
                            <text x="80" y="55">$9 <FormattedMessage id='Pricing.hourSubText' /></text>
                        </g>
                        <g class="data" data-setname="Our first data set">
                            <circle cx="130" cy="98" data-value="8.1" r="5"></circle>
                            <text x='110' y='122'>$8 <FormattedMessage id='Pricing.hourSubText' /></text>
                            <circle cx="180" cy="140" data-value="7.7" r="5"></circle>
                            <text x='160' y='164'>$7 <FormattedMessage id='Pricing.hourSubText' /></text>
                            <circle cx="230" cy="182" data-value="6.8" r="5"></circle>
                            <text x='210' y='206'>$6 <FormattedMessage id='Pricing.hourSubText' /></text>
                            <circle cx="280" cy="223" data-value="6.7" r="5"></circle>
                            <text x='260' y='247'>$5 <FormattedMessage id='Pricing.hourSubText' /></text>
                            <circle cx="330" cy="265" data-value="6.7" r="5"></circle>
                            <text x='310' y='289'>$4.5 <FormattedMessage id='Pricing.hourSubText' /></text>
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ user, language }) => {
    return {
        user,
        language
    }
}

export default connect(mapStateToProps)(withRouter(Pricing));