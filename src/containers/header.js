import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { login } from "../actions";
import LogoContainer from './landing/logo-container';
import Auth from '../components/auth';
import UserBox from '../containers/dashboard/user-box';
import '../styles/header.css';

import Utils from '../utils';
import { bake_cookie } from 'sfcookies';
const { firebase } = Utils;

class Header extends Component {
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

    componentDidMount() {
        this.setState({
            user: this.props.user
        })

        var that = this;
        firebase.auth().onAuthStateChanged(user => {
            const currentUser = user ? user : '';
            that.setState({ user: currentUser });
            if (currentUser) {
                console.log('currentUser at header....')
                const { uid, displayName, email, emailVerified, metadata } = currentUser;
                const { lastSignInTime, creationTime } = metadata;
                const isNewUser = creationTime === lastSignInTime
                let now = new Date()
                let sinceLogin = now.getTime() - new Date(lastSignInTime).getTime() 
                console.log('sinceLogin:', sinceLogin) 
                const loginInfo = {
                    uid,
                    displayName,
                    email,
                    isNewUser,
                    emailVerified,
                    creationTime: new Date(creationTime),
                };
                that.props.login(loginInfo);

                bake_cookie('speechtext-dev-login', loginInfo);
                if(sinceLogin < 4500) {
                    // Redirect new user to dashboard 
                    this.props.history.push('/dashboard')
                }
            }
        });
    }

    logoClicked = () => {
        if(this.props.goToRef) {
            this.props.goToRef('topRef');
        }
    }

    render() {
        return (
            <div>
                <Nav>
                    <Navbar id='header-nav' variant="light" expand="lg" fixed="top" className='text-dark fixed-top-style'>
                        <div className='header-background'></div>
                        <Container>
                            <Link to='/' onClick={ this.logoClicked }>
                                <Navbar.Brand>
                                    <LogoContainer />
                                </Navbar.Brand>
                            </Link>
                            <Navbar.Toggle />
                            <Navbar.Collapse>
                                <Nav className="ml-auto">
                                    <Nav.Item className={ this.props.showLinks ? 'visible' : 'invisible' }>
                                        <Nav.Link href="/#how-it-works" onClick={ () => this.props.goToRef('howItWorksRef') }>
                                            <FormattedMessage id="Header.howItWorks" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className={ this.props.showLinks ? 'visible' : 'invisible' }>
                                        <Nav.Link href="/#features" onClick={ () => this.props.goToRef('featuresRef') }>
                                            <FormattedMessage id="Header.features" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className={ this.props.showLinks ? 'visible' : 'invisible' }>
                                        <Nav.Link href="/#pricing" onClick={ () => this.props.goToRef('pricingRef') }>
                                            <FormattedMessage id="Header.pricing" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className={ this.props.showLinks ? 'visible' : 'invisible' }>
                                        <Nav.Link href="/#about" onClick={ () => this.props.goToRef('aboutRef') }>
                                            <FormattedMessage id="Header.aboutUs" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className={ this.props.showLinks ? 'visible' : 'invisible' }>
                                        <Nav.Link href="/#contact" onClick={ () => this.props.goToRef('contactRef') }>
                                            <FormattedMessage id="Header.contact" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    {
                                        _.isEmpty(this.props.user) && 
                                        <Nav.Item>
                                            <Button onClick={() => { this.setState({ showAuth: true }) }}>
                                                <FontAwesomeIcon icon={ faSignInAlt } className='margin-right-10' />
                                                <FormattedMessage id="Header.signIn" />
                                            </Button>
                                        </Nav.Item>
                                    }
                                    {
                                        !_.isEmpty(this.props.user) &&
                                        <UserBox alignLeft={ true } />
                                    }
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Nav>
                <Auth language={ this.props.language } show={ this.state.showAuth } handleClose={ this.handleClose } />
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

export default connect(mapStateToProps, { login })(withRouter(Header));