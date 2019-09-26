import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import LogoContainer from './landing/logo-container';
import Auth from '../components/auth';
import '../styles/header.css';

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
    }

    componentDidUpdate(props) {
        if(_.isEmpty(this.state.user) && !_.isEmpty(props.user)) {
            this.props.history.push('/dashboard');
        }
    }

    render() {
        return (
            <div>
                <Nav>
                    <Navbar variant="light" expand="lg" bg="light" fixed="top" className='text-dark fixed-top-style'>
                        <Container>
                            <Navbar.Brand href="/#" onClick={ () => this.props.goToRef('topRef') }>
                                <LogoContainer />
                            </Navbar.Brand>
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
                                        <Nav.Item>
                                            <Link to='/dashboard' className='dashboard-link nav-link'>
                                                <FormattedMessage id='Header.dashboard' />
                                            </Link>
                                        </Nav.Item>
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

export default connect(mapStateToProps)(withRouter(Header));