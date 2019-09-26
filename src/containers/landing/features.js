import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faMicrophoneAlt, faFileAudio, faLanguage, faClock, faClosedCaptioning,
    faDownload, faUserShield, faFileSignature, faHandHoldingUsd
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/features.css';

const featureList = [
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
    },
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
    },
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
        <Row className="mb-5 mt-5">
            <Col lg="12" md="12" sm="12" xs="12">
                <h4>
                    <FormattedMessage id="Features.title" />
                </h4>
                <Row>
                    {
                        featureList.map(item => {
                            return (
                                <Col lg="4" md='4' align='center' key={ item.key }>
                                    <ul className="list-group">
                                        <li key={ item.key } className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
                                            <FontAwesomeIcon icon={ item.icon } size='5x' color='#007bff' />
                                            <span className='feature-text'>
                                                <FormattedMessage id={ item.textId} />
                                            </span>
                                        </li>
                                    </ul>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Col>
        </Row>
    )
}

export default Features;