import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import Banner from '../assets/banner.png';
import '../styles/entry.css';

const Entry = () => {
    return (
        <div className='main-div' >
            <Container align="center">
                <Row>
                    <Col lg="6">
                        <img src={ Banner } alt='Speech > Text Banner' className='banner-image' />
                    </Col>
                    <Col lg="6">
                        <Row className='list-container-style'>
                            <Col lg="12">
                                <Card className='list-container-card'>
                                    <h4 className='title-style'>
                                        <span className='title-name-style'>Speech > Text</span>
                                        <FormattedMessage id="Banner.subText" />
                                    </h4>
                                    <ul>
                                        <li className="d-flex align-items-center">
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
                                            <FormattedMessage id="Banner.feature2" />
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className='badge-style'>
                                                <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                            </span>
                                            <FormattedMessage id="Banner.feature3" />
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className='badge-style'>
                                                <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                            </span>
                                            <FormattedMessage id="Banner.feature4" />
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <span className='badge-style'>
                                                <FontAwesomeIcon icon={ faCheck } color='#28a745' />
                                            </span>
                                            <FormattedMessage id="Banner.feature5" />
                                        </li>
                                    </ul>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Entry;