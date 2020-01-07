import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faCloudUploadAlt, faCloudDownloadAlt, faEdit, faFilePdf, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../../styles/how-it-works.css';

const HowItWorks = (props) => {
    return (
        <div className='how-it-works-content'>
            <Row className="mb-5 mt-5">
                <Col lg="12">
                    <p className='title'>
                        <FormattedMessage id="HowItWorks.title" />
                    </p>
                    <br />
                    <h5>
                        <b><FormattedMessage id="HowItWorks.message" /></b>
                    </h5>
                    <Row className='steps-container'>
                        <Col lg='2' md='2' sm='0' xs='0'></Col>
                        <Col lg='4' md='4' sm='12' xs='12'>
                            <Card className="h-100 text-center">
                                <span className='span-style'>1</span>
                                <FontAwesomeIcon 
                                    icon={faCloudUploadAlt} 
                                    title='Upload Audio/Video Files' 
                                    className='image-style' size="6x" />
                                <Card.Body>
                                    <p className="card-text">
                                        <FormattedMessage id="HowItWorks.step1" />
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg='2' md='2' sm='6' xs='6' className='steps-direction-right'></Col>
                    </Row>
                    <Row className='steps-container'>
                        <Col lg='4' md='4' className='d-none d-lg-block d-md-block'></Col>
                        <Col lg='2' md='2' className='steps-direction-left d-none d-lg-block d-md-block'></Col>
                        <Col lg="4" mb="4" sm='12' xs='12'>
                            <Card className="h-100 text-center">
                                <span className='span-style'>2</span>
                                <FontAwesomeIcon
                                    icon={faSync}
                                    title='Automatic Speech to Text Convertion'
                                    className='image-style' size="5x" />
                                <Card.Body>
                                    <p className="card-text">
                                        <FormattedMessage id="HowItWorks.step2" />
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg='0' md='0' sm='6' xs='6' className='steps-direction-right step-direction-mobile'></Col>
                    </Row>
                    <Row className='steps-container'>
                        <Col lg='2' md='2' sm='0' xs='0'></Col>
                        <Col lg="4" mb="4" sm='12' xs='12'>
                            <Card className="h-100 text-center">
                                <span className='span-style'>3</span>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    title='Online Integrated Player & Editor'
                                    className='image-style' size="5x" />
                                <Card.Body>
                                    <p className="card-text">
                                        <FormattedMessage id="HowItWorks.step3" />
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg='2' md='2' sm='6' xs='6' className='steps-direction-right'></Col>
                    </Row>
                    <Row className='steps-container'>
                        <Col lg='4' md='4' sm='0' xs='0'></Col>
                        <Col lg='2' md='2' className='steps-direction-left d-none d-lg-block d-md-block'></Col>
                        <Col lg="4" mb="4" sm='12' xs='12'>
                            <Card className="h-100 text-center">
                                <span className='span-style'>4</span>
                                <FontAwesomeIcon
                                    icon={faCloudDownloadAlt}
                                    title='Export Your Transcription'
                                    className='image-style' size="6x" />
                                <Card.Body>
                                    <p className="card-text">
                                        <FormattedMessage id="HowItWorks.step4" />
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg='0' md='0' sm='6' xs='6' className='steps-direction-right step-direction-mobile'></Col>
                    </Row>
                    <Row className='steps-container'>
                        <Col lg='2' md='2' sm='0' xs='0'></Col>
                        <Col lg="4" mb="4" sm='12' xs='12'>
                            <Card className="h-100 text-center">
                                <span className='span-style'>
                                    <FontAwesomeIcon
                                        icon={faCheck} color='green' className='mt-1' />
                                </span>
                                <FontAwesomeIcon
                                    icon={faFilePdf}
                                    title='Export Your Transcription'
                                    className='image-style' size="6x" />
                                <Card.Body>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default HowItWorks;