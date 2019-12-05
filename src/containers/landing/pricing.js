import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Container } from 'react-bootstrap';

import { DemoCard, StandardCard, MonthlyCard, EnterpriseCard  } from "../../components/pricing-cards";
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
        return (
            <div>
                <Container className="mb-5 mt-5">
                    <h4>
                        <FormattedMessage id="Pricing.title" />
                    </h4>
                    <div className="pricing card-deck flex-column flex-md-row mb-3">
                        <DemoCard user={this.props.user} handleBuyNowButton={this.handleBuyNowButton} />
                        <StandardCard user={this.props.user} handleBuyNowButton={this.handleBuyNowButton} />
                        <MonthlyCard user={this.props.user} handleBuyNowButton={this.handleBuyNowButton} />
                        <EnterpriseCard user={this.props.user} goToRef={this.props.goToRef} />
                    </div>
                </Container>
                <Auth language={this.props.language} show={this.state.showAuth} handleClose={this.handleClose} />
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