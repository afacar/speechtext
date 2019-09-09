import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Button } from 'react-bootstrap';
import '../styles/pricing.css';

const Pricing = (props) => {
    return (
        <Container className="mb-5 mt-5">
            <h4>
                <FormattedMessage id="Pricing.title" />
            </h4>
            <div className="pricing card-deck flex-column flex-md-row mb-3">
                <div className="card card-pricing text-center px-3 mb-4">
                    <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">Demo</span>
                    <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
                        <h1 className="h1 font-weight-normal text-primary text-center mb-0" data-pricing-value="15"><span className="price">
                            <FormattedMessage id="Pricing.Demo.price" />
                        </span></h1>
                    </div>
                    <div className="card-body pt-0" >
                        <ul className="list-unstyled mb-4 pricing-body-container" >
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Demo.feature1" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Demo.feature2" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Demo.feature3" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Demo.feature4" />
                            </li>
                        </ul>
                        <div className='pricing-footer-container' >
                            <Button variant="outline-secondary" className="mb-3 payment-button-style" onClick={ () => props.goToRef('contactRef') }>
                                <FormattedMessage id="Pricing.Demo.buttonText" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="card card-pricing shadow text-center px-3 mb-4 card-pricing-popular" >
                    <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
                        <FormattedMessage id="Pricing.Standard.title" />
                    </span>
                    <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
                        <h1 className="h1 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
                            $<span className="price">5</span>
                            <span className="h6 text-muted ml-2">/
                                <FormattedMessage id="Pricing.Standard.timeText" />
                            </span>
                        </h1>
                    </div>
                    <div className="card-body pt-0">
                        <ul className="list-unstyled mb-4 pricing-body-container">
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Standard.feature1" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Standard.feature2" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Standard.feature3" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Standard.feature4" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Standard.feature5" />
                            </li>
                        </ul>
                        <div className='pricing-footer-container' >
                            <Button variant="primary" className="mb-3" onClick={ () => props.goToRef('contactRef') }>
                                <FormattedMessage id="Pricing.Standard.buttonText" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="card card-pricing shadow text-center px-3 mb-4" >
                    <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
                        <FormattedMessage id="Pricing.Monthly.title" />
                    </span>
                    <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
                        <h1 className="h1 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
                            $<span className="price">20</span>
                            <span className="h6 text-muted ml-2">
                                / 5
                                <FormattedMessage id="Pricing.Monthly.timeText" />
                            </span>
                        </h1>
                    </div>
                    <div className="card-body pt-0">
                        <ul className="list-unstyled mb-4 pricing-body-container" >
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Monthly.feature1" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Monthly.feature2" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Monthly.feature3" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Monthly.feature4" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Monthly.feature5" />
                            </li>
                        </ul>
                        <div className='pricing-footer-container' >
                            <Button variant="outline-secondary" className="mb-3" onClick={ () => props.goToRef('contactRef') }>
                                <FormattedMessage id="Pricing.Monthly.buttonText" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="card card-pricing text-center px-3 mb-4">
                    <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
                        <FormattedMessage id="Pricing.Enterprise.title" />
                    </span>
                    <div className="bg-transparent card-header pt-4 border-0 pricing-header-container">
                        <h1 className="h1 font-weight-normal text-primary text-center mb-0 enterprise-header-style" data-pricing-value="45" >
                            <span className="h6 text-muted ml-1">
                                <FormattedMessage id="Pricing.Enterprise.pricingText" />
                            </span>
                        </h1>
                    </div>
                    <div className="card-body pt-0">
                        <ul className="list-unstyled mb-4 pricing-body-container">
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Enterprise.feature1" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Enterprise.feature2" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Enterprise.feature3" />
                            </li>
                            <li className='list-unstyled'>
                                <FormattedMessage id="Pricing.Enterprise.feature4" />
                            </li>
                        </ul>
                        <div className='pricing-footer-container' >
                            <Button variant="outline-secondary" className="mb-3" onClick={ () => props.goToRef('contactRef') }>
                                <FormattedMessage id="Pricing.Enterprise.buttonText" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Pricing;