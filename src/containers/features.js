import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophoneAlt, faFileAudio, faLanguage, faClock, faClosedCaptioning, faDownload, faUserShield, faFileSignature, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import '../styles/features.css';

const firstGroup = [
    {
        icon: faMicrophoneAlt,
        textId: 'Features.one'
    },
    {
        icon: faFileAudio,
        textId: 'Features.two'
    },
    {
        icon: faLanguage,
        textId: 'Features.three'
    }
];

const secondGroup = [
    {
        icon: faClock,
        textId: 'Features.four'
    },
    {
        icon: faClosedCaptioning,
        textId: 'Features.five'
    },
    {
        icon: faFileSignature,
        textId: 'Features.six'
    }
];

const thirdGroup = [
    {
        icon: faDownload,
        textId: 'Features.seven'
    },
    {
        icon: faHandHoldingUsd,
        textId: 'Features.eight'
    },
    {
        icon: faUserShield,
        textId: 'Features.nine'
    }
];

const Features = (props) => {
    return (
        <Row>
            <Col lg="12" md="12" sm="12" xs="12">
                <h4>
                    <FormattedMessage id="Features.title" />
                </h4>
                <Row>
                    <Col lg="3">
                        <ul className="list-group">
                            {
                                firstGroup.map(item => {
                                    return (
                                        <li className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
                                            <FontAwesomeIcon icon={ item.icon } size='5x' color='#007bff' />
                                            <span className='feature-text'>
                                                <FormattedMessage id={ item.textId } />
                                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Col>
                    <Col lg="3" md="3">
                        <ul className="list-group">
                            {
                                secondGroup.map(item => {
                                    return (
                                        <li className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
                                            <FontAwesomeIcon icon={ item.icon } size='5x' color='#007bff' />
                                            <span className='feature-text'>
                                                <FormattedMessage id={ item.textId } />
                                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Col>
                    <Col lg="3" md="3">
                        <ul className="list-group">
                            {
                                thirdGroup.map(item => {
                                    return (
                                        <li className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
                                            <FontAwesomeIcon icon={ item.icon } size='5x' color='#007bff' />
                                            <span className='feature-text'>
                                                <FormattedMessage id={ item.textId } />
                                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Features;