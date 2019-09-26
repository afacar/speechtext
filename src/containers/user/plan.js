import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Container, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Alert from 'react-s-alert';

import firebase from '../../utils/firebase';
import ApprovementPopup from '../../components/approvement-popup';

class Plan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPlanType: ''
        }
    }

    componentWillReceiveProps({ user }) {
        if(user && user.currentPlan && user.currentPlan.type && user.currentPlan.type !== 'Demo') {
            this.setState({
                selectedPlanType: user.currentPlan.type
            })
        }
    }

    changeCurrentPlan = () => {
        const { user } = this.props;
        if(user.currentPlan.type !== 'Demo') {
            this.setState({
                showApprovement: true
            });
        } else {
            this.submitPlanChange();
        }
    }

    submitPlanChange = () => {
        const { selectedPlanType } = this.state;
        const { plans } = this.props;
        var selectedPlan = _.find(plans, { type: selectedPlanType });
        var fncAddBasket = firebase.functions().httpsCallable('changeUserPlan');
        fncAddBasket({ 
            planId: selectedPlan.planId
        }).then(({ data }) => {
            if(data.success) {
                Alert.success('You plan changed successfully.');
            }
        });
        this.setState({
            showApprovement: false
        });
    }

    cancelPlanChange = () => {
        this.setState({
            showApprovement: false
        })
    }

    render() {
        var { currentPlan } = this.props.user;
        var { selectedPlanType } = this.state;
        if(_.isEmpty(currentPlan)) currentPlan = {};
        if(!selectedPlanType) selectedPlanType = currentPlan.type;
        return (
            <Container>
                <div className="pricing card-deck flex-column flex-md-row user-plan">
                    <div className={`card card-pricing text-center px-3 mb-4 ${selectedPlanType === 'PayAsYouGo' ? 'shadow card-pricing-popular' : ''}`} 
                            onClick={ () => this.setState({ selectedPlanType: 'PayAsYouGo'}) }>
                        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white">
                            <FormattedMessage id="Pricing.Standard.title" />
                        </span>
                        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
                            <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
                                $<span className="price">5,90</span>
                                <span className="h6 text-muted ml-2">/
                                    <FormattedMessage id="Pricing.Standard.timeText" />
                                </span>
                            </h2>
                        </div>
                        <div className="card-body pt-0">
                            <ul className="list-unstyled mb-4 plan-body-container">
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
                        </div>
                    </div>
                    <div className={`card card-pricing text-center px-3 mb-4 ${selectedPlanType === 'Monthly' ? 'shadow card-pricing-popular' : ''}`} 
                            onClick={ () => this.setState({ selectedPlanType: 'Monthly'}) }>
                        <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">
                            <FormattedMessage id="Pricing.Monthly.title" />
                        </span>
                        <div className="bg-transparent card-header pt-4 border-0 pricing-header-container" >
                            <h2 className="h2 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">
                                $<span className="price">24,90</span>
                                <span className="h6 text-muted ml-2">
                                    / 5
                                    <FormattedMessage id="Pricing.Monthly.timeText" />
                                </span>
                            </h2>
                        </div>
                        <div className="card-body pt-0">
                            <ul className="list-unstyled mb-4 plan-body-container" >
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
                        </div>
                    </div>
                </div>
                {
                    selectedPlanType && selectedPlanType !== currentPlan.type &&
                    <div align='center'>
                        <Button variant='success' onClick={ this.changeCurrentPlan }>Change Plan</Button>
                    </div>
                }
                {
                    this.state.showApprovement &&
                    <ApprovementPopup
                        show={ this.state.showApprovement }
                        headerText='Plan Change Confirmation'
                        bodyText='You remaining duration will be deleted if you change plan now'
                        handleSuccess={ this.submitPlanChange }
                        handleCancel={ this.cancelPlanChange }
                    />
                }
            </Container>
        )
    }
}

const mapStateToProps = ({ user, plans }) => {
    return {
        user,
        plans
    }
}

export default connect(mapStateToProps)(Plan);