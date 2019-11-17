import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Carousel } from 'react-bootstrap';

import Banner1 from '../../assets/banner-1.jpg';
import Banner2 from '../../assets/banner-2.jpg';
import Banner3 from '../../assets/banner-3.jpg';
import '../../styles/entry.css';
import Auth from '../../components/auth';

class Entry extends Component {
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

    render() {
        return (
            <div className='main-div' >
                <Container align="center">
                    <Carousel nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={ Banner1 }
                                alt="State of Art"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={ Banner2 }
                                alt="Integrated Editor"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={ Banner3 }
                                alt="Best Price"
                            />
                        </Carousel.Item>
                    </Carousel>
                </Container>
                <Auth language={ this.props.language } show={ this.state.showAuth } handleClose={ this.handleClose } />
            </div>
        )
    }
}

const mapStateToProps = ({ language, user }) => {
    return {
        language,
        user
    }
}

export default connect(mapStateToProps)(Entry);