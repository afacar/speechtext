import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { withRouter } from 'react-router'
import _ from 'lodash';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Logo from '../assets/logo.png';
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

    componentDidUpdate({ firebaseUserInfo }) {
        if(_.isEmpty(this.props.firebaseUserInfo) && !_.isEmpty(firebaseUserInfo)) {
            this.props.history.push(`/demo?token=${firebaseUserInfo.token}`);
        }
    }

    render() {
        return (
            <div>
                <Nav>
                    <Navbar variant="light" expand="lg" bg="light" fixed="top" className='text-dark fixed-top-style'>
                        <Container>
                            <Navbar.Brand href="#" onClick={ () => this.props.goToRef('topRef') }>
                                <img alt='Speech > Text' src={ Logo } className='logo-style' />
                                <div style={ { float:'right'} }>
                                    <div className='logo-text-style'>
                                        Speech > Text
                                    </div>
                                    <small className='logo-footer-style'>
                                        <FormattedMessage id="Header.subText"
                                            description="Logo subtext"
                                        />
                                    </small>
                                </div>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                            <Navbar.Collapse>
                                <Nav className="ml-auto">
                                    <Nav.Item>
                                        <Nav.Link href="#how-it-works" onClick={ () => this.props.goToRef('howItWorksRef') }>
                                            <FormattedMessage id="Header.howItWorks" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#features" onClick={ () => this.props.goToRef('featuresRef') }>
                                            <FormattedMessage id="Header.features" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#pricing" onClick={ () => this.props.goToRef('pricingRef') }>
                                            <FormattedMessage id="Header.pricing" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#contact" onClick={ () => this.props.goToRef('contactRef') }>
                                            <FormattedMessage id="Header.contact" />
                                        </Nav.Link>
                                    </Nav.Item>
                                    {
                                        // _.isEmpty(this.props.firebaseUserInfo) &&
                                        // <Nav.Item>
                                        //     <Nav.Link href="#demo" onClick={ () => this.setState({ showAuth: true }) }>
                                        //         <Button variant="primary" className='demo-button-style'>
                                        //             <FormattedMessage id="Header.try" />
                                        //         </Button>
                                        //     </Nav.Link>
                                        // </Nav.Item>
                                    }
                                    {
                                        // !_.isEmpty(this.props.firebaseUserInfo) &&
                                        // <Nav.Item>
                                        //     <Nav.Link href="#demo" onClick={ () => this.setState({ showAuth: true }) }>
                                        //         <Link to={`/demo?token=${this.props.firebaseUserInfo.token}`}>
                                        //             <Button variant="primary" className='demo-button-style'>
                                        //                 <FormattedMessage id="Header.demo" />
                                        //             </Button>
                                        //         </Link>
                                        //     </Nav.Link>
                                        // </Nav.Item>
                                    }
                                    {/* <Nav.Item>
                                        <Link to='/demo' className="nav-link text-white">Demo</Link>
                                    </Nav.Item> */}
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

const mapStateToProps = ({ firebaseUserInfo, language }) => {
    return {
        firebaseUserInfo,
        language
    }
}

export default connect(mapStateToProps)(withRouter(Header));