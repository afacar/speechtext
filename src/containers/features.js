import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faMicrophoneAlt, faFileAudio, faLanguage, faClock, faClosedCaptioning,
    faDownload, faUserShield, faFileSignature, faHandHoldingUsd
} from '@fortawesome/free-solid-svg-icons';
import '../styles/features.css';

const firstGroup = [
    {
        key: 1,
        icon: faMicrophoneAlt,
        textId: 'Features.one'
    },
    {
        key: 2,
        icon: faFileAudio,
        textId: 'Features.two'
    },
    {
        key: 3,
        icon: faLanguage,
        textId: 'Features.three'
    }
];

const secondGroup = [
    {
        key: 4,
        icon: faClock,
        textId: 'Features.four'
    },
    {
        key: 5,
        icon: faClosedCaptioning,
        textId: 'Features.five'
    },
    {
        key: 6,
        icon: faFileSignature,
        textId: 'Features.six'
    }
];

const thirdGroup = [
    {
        key: 7,
        icon: faDownload,
        textId: 'Features.seven'
    },
    {
        key: 8,
        icon: faHandHoldingUsd,
        textId: 'Features.eight'
    },
    {
        key: 9,
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
                                        <li key={ item.key } className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
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
                                        <li key={ item.key } className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
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
                                        <li key={ item.key } className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
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