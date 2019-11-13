import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Container, Carousel, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Banner from '../../assets/banner.png';
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
        const { user } = this.props;
        return (
            <div className='main-div' >
                <Container align="center">
                    {/* <Row>
                        <Col lg="6" md="12" sm="12" xs="12">
                            <img src={ Banner } title='Speech to Text Transcription' alt='Speech to text Automatic Transcription Editor Banner' className='banner-image' />
                        </Col>
                        <Col lg="6" md="12" sm="12" xs="12">
                            <Row className='list-container-style'>
                                <Col lg="12">
                                    <Card className='list-container-card'>
                                        <h4 className='title-style'>
                                            <span className='title-name-style'>Speechtext.io</span>
                                            <FormattedMessage id="Banner.subText" />
                                        </h4>
                                        <ul>
                                            <li className="d-flex">
                                                <span className='badge-style'>
                                                    <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                                </span>
                                                <div className='list-text-style'>
                                                    <FormattedMessage id="Banner.feature1" />
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <span className='badge-style'>
                                                    <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                                </span>
                                                <div className='list-text-style'>
                                                    <FormattedMessage id="Banner.feature2" />
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <span className='badge-style'>
                                                    <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                                </span>
                                                <div className='list-text-style'>
                                                    <FormattedMessage id="Banner.feature3" />
                                                </div>
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <span className='badge-style'>
                                                    <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                                </span>
                                                <div className='list-text-style'>
                                                    <FormattedMessage id="Banner.feature4" />
                                                </div>
                                            </li>
                                            {
                                                _.isEmpty(user) &&
                                                <li className="d-flex align-items-center">
                                                    <Button variant='secondary' className='margin-left-25' onClick={ () => this.setState({ showAuth: true }) } >
                                                        <FormattedMessage id="Banner.tryForFree" />
                                                    </Button>
                                                </li>
                                            }
                                        </ul>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row> */}
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