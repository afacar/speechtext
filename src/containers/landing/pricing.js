import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Container, Button } from 'react-bootstrap';

import '../../styles/pricing.css';
import Auth from '../../components/auth';

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
        const { user, goToRef } = this.props;
        var DemoButtonText = <FormattedMessage id="Pricing.Demo.buttonText" />;
        var StandardButtonText = <FormattedMessage id="Pricing.Standard.buttonText" />;
        var MonthlyButtonText = <FormattedMessage id="Pricing.Monthly.buttonText" />;
        if(!_.isEmpty(user)) {
            DemoButtonText = <FormattedMessage id="Pricing.Demo.loggedInButtonText" />;
            StandardButtonText = <FormattedMessage id="Pricing.Standard.loggedInButtonText" />;
            MonthlyButtonText = <FormattedMessage id="Pricing.Monthly.loggedInButtonText" />;
        }
        
        return (
            <div className='pricing-content'>
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
                        90,55
                        392,139
                        684,223
                        850,265
                        1000,265"/>
                    <g class="grid x-grid" id="xGrid">
                      <line x1="90" x2="90" y1="5" y2="371"></line>
                    </g>
                    <g class="grid y-grid" id="yGrid">
                        <line x1="90" x2="1005" y1="370" y2="370"></line>
                    </g>
                    <g class="labels x-labels">
                        <text x="100" y="400">1</text>
                        <text x="246" y="400">10</text>
                        <text x="392" y="400">20</text>
                        <text x="538" y="400">30</text>
                        <text x="684" y="400">40</text>
                        <text x="850" y="400">50+</text>
                        <text x="960" y="400">
                            <FormattedMessage id='Pricing.contactUs' />
                        </text>
                        <text x="500" y="440" class="label-title">
                            <FormattedMessage id='Pricing.hoursLabel' />
                        </text>
                    </g>
                    <g class="labels y-labels">
                        <text x="80" y="55">$9 <FormattedMessage id='Pricing.hourSubText' /></text>
                        <text x="60" y="200" class="label-title">
                            <FormattedMessage id='Pricing.priceLabel' />
                        </text>
                    </g>
                    <g class="data" data-setname="Our first data set">
                        <circle cx="246" cy="98" data-value="8.1" r="5"></circle>
                        <text x='216' y='132'>$8 <FormattedMessage id='Pricing.hourSubText' /></text>
                        <circle cx="392" cy="140" data-value="7.7" r="5"></circle>
                        <text x='362' y='174'>$7 <FormattedMessage id='Pricing.hourSubText' /></text>
                        <circle cx="538" cy="182" data-value="6.8" r="5"></circle>
                        <text x='508' y='216'>$6 <FormattedMessage id='Pricing.hourSubText' /></text>
                        <circle cx="684" cy="223" data-value="6.7" r="5"></circle>
                        <text x='654' y='257'>$5 <FormattedMessage id='Pricing.hourSubText' /></text>
                        <circle cx="850" cy="265" data-value="6.7" r="5"></circle>
                        <text x='820' y='299'>$4.5 <FormattedMessage id='Pricing.hourSubText' /></text>
                    </g>
                </svg>
            </div>
            // <div>
            //     <Container className="mb-5 mt-5">
            //         <h4>
            //             <FormattedMessage id="Pricing.title" />
            //         </h4>
            //         <div className="pricing card-deck flex-column flex-md-row mb-3">
            //             <div className="card card-pricing text-center px-3 mb-4">
            //                 <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">Demo</span>
            //                 <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
            //                     <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="15">
            //                         <span className="price">
            //                             <FormattedMessage id="Pricing.Demo.price" />
            //                         </span>
            //                     </h2>
            //                 </div>
            //                 <div className="card-body pt-0" >
            //                     <ul className="list-unstyled mb-4 pricing-body-container" >
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Demo.feature1" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Demo.feature2" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Demo.feature3" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Demo.feature4" />
            //                         </li>
            //                     </ul>
            //                     <div className='pricing-footer-container' >
            //                         <Button variant="outline-secondary" className="mb-3 payment-button-style" onClick={ () => this.handleBuyNowButton('Demo') }>
            //                             { DemoButtonText }
            //                         </Button>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="card card-pricing text-center px-3 mb-4" >
            //                 <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white">
            //                     <FormattedMessage id="Pricing.Standard.title" />
            //                 </span>
            //                 <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
            //                     <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
            //                         $<span className="price">5,90</span>
            //                         <span className="h6 text-muted ml-2">/
            //                             <FormattedMessage id="Pricing.Standard.timeText" />
            //                         </span>
            //                     </h2>
            //                 </div>
            //                 <div className="card-body pt-0">
            //                     <ul className="list-unstyled mb-4 pricing-body-container">
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Standard.feature1" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Standard.feature2" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Standard.feature3" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Standard.feature4" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Standard.feature5" />
            //                         </li>
            //                     </ul>
            //                     <div className='pricing-footer-container' >
            //                         <Button variant="outline-secondary" className="mb-3" onClick={ () => this.handleBuyNowButton('PayAsYouGo') }>
            //                             { StandardButtonText }
            //                         </Button>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="card card-pricing shadow text-center px-3 mb-4 card-pricing-popular">
            //                 <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
            //                     <FormattedMessage id="Pricing.Monthly.title" />
            //                 </span>
            //                 <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
            //                     <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
            //                         $<span className="price">24,90</span>
            //                         <span className="h6 text-muted ml-2">
            //                             / 5
            //                             <FormattedMessage id="Pricing.Monthly.timeText" />
            //                         </span>
            //                     </h2>
            //                 </div>
            //                 <div className="card-body pt-0">
            //                     <ul className="list-unstyled mb-4 pricing-body-container" >
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Monthly.feature1" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Monthly.feature2" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Monthly.feature3" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Monthly.feature4" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Monthly.feature5" />
            //                         </li>
            //                     </ul>
            //                     <div className='pricing-footer-container' >
            //                         <Button variant="primary" className="mb-3" onClick={ () => this.handleBuyNowButton('Monthly') }>
            //                             { MonthlyButtonText }
            //                         </Button>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="card card-pricing text-center px-3 mb-4">
            //                 <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
            //                     <FormattedMessage id="Pricing.Enterprise.title" />
            //                 </span>
            //                 <div className="bg-transparent card-header pt-4 border-0 pricing-header-container">
            //                     <h2 className="h2 font-weight-normal text-primary text-center mb-0 enterprise-header-style" data-pricing-value="45" >
            //                         <span className="h6 text-muted ml-1">
            //                             <FormattedMessage id="Pricing.Enterprise.pricingText" />
            //                         </span>
            //                     </h2>
            //                 </div>
            //                 <div className="card-body pt-0">
            //                     <ul className="list-unstyled mb-4 pricing-body-container">
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Enterprise.feature1" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Enterprise.feature2" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Enterprise.feature3" />
            //                         </li>
            //                         <li className='list-unstyled'>
            //                             <FormattedMessage id="Pricing.Enterprise.feature4" />
            //                         </li>
            //                     </ul>
            //                     <div className='pricing-footer-container' >
            //                         <Button variant="outline-secondary" className="mb-3" onClick={ () => goToRef('contactRef') }>
            //                             <FormattedMessage id="Pricing.Enterprise.buttonText" />
            //                         </Button>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </Container>
            //     <Auth language={ this.props.language } show={ this.state.showAuth } handleClose={ this.handleClose } />
            // </div>
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