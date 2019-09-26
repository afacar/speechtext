import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faUpload, faDownload, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../../styles/how-it-works.css';

const HowItWorks = (props) => {
    return (
        <Row className="mb-5 mt-5">
            <Col lg="12">
                <h4>
                    <FormattedMessage id="HowItWorks.title" />
                </h4>
                <Row>
                    <Col lg="3" mb="3">
                        <Card className="h-100 text-center">
                            <span className='span-style'>1</span>
                            <FontAwesomeIcon icon={ faUpload } className='image-style' size="5x" />
                            <Card.Body>
                                <p className="card-text">
                                    <FormattedMessage id="HowItWorks.step1" />
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3" mb="3">
                        <Card className="h-100 text-center">
                            <span className='span-style'>2</span>
                            <FontAwesomeIcon icon={ faSync } className='image-style' size="5x" />
                            <Card.Body>
                                <p className="card-text">
                                    <FormattedMessage id="HowItWorks.step2" />
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3" mb="3">
                        <Card className="h-100 text-center">
                            <span className='span-style'>3</span>
                            <FontAwesomeIcon icon={ faEdit } className='image-style' size="5x" />
                            <Card.Body>
                                <p className="card-text">
                                    <FormattedMessage id="HowItWorks.step3" />
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="3" mb="3">
                        <Card className="h-100 text-center">
                            <span className='span-style'>4</span>
                            <FontAwesomeIcon icon={ faDownload } className='image-style' size="5x" />
                            <Card.Body>
                                <p className="card-text">
                                    <FormattedMessage id="HowItWorks.step4" />
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default HowItWorks;