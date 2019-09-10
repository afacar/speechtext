import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Logo from '../assets/logo.png';
import '../styles/header.css';
import '../styles/user.css';

import Auth from '../components/auth';
import UserBox from './user-box';

class UserHeader extends Component {
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
                        <Link to='/'>
                            <Navbar.Brand>
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
                        </Link>
                        <Navbar.Toggle />
                        <Navbar.Collapse>
                            <Nav className="ml-auto">
                                <Nav.Item>
                                    <UserBox />
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

export default connect(mapStateToProps)(withRouter(UserHeader));