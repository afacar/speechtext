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
        title: 'Automatic Speech Recognition',
        textId: 'Features.one'
    },
    {
        key: 2,
        icon: faFileAudio,
        title: 'Highest Accuracy with State of Art Speech Recognition AI Models',
        textId: 'Features.two'
    },
    {
        key: 3,
        icon: faLanguage,
        title: 'Multi-Languages Support',
        textId: 'Features.three'
    },
    {
        key: 4,
        icon: faClock,
        title: 'Automatic Timestamps',
        textId: 'Features.four'
    },
    {
        key: 5,
        icon: faClosedCaptioning,
        title: 'Automatic Subtitle Creation',
        textId: 'Features.five'
    },
    {
        key: 6,
        icon: faFileSignature,
        title: 'Online Integrated & Interactive Editor',
        textId: 'Features.six'
    },
    {
        key: 7,
        icon: faDownload,
        title: 'Download Transcription as docx, txt, srt',
        textId: 'Features.seven'
    },
    {
        key: 8,
        icon: faHandHoldingUsd,
        title: 'Cheapest Price Per Minute',
        textId: 'Features.eight'
    },
    {
        key: 9,
        icon: faUserShield,
        title: 'Secure Your Files',
        textId: 'Features.nine'
    }
];

const Features = (props) => {
    return (
        <div>
            <div className='features-background'></div>
            <div className='features-content'>
                <Row className="mb-5 mt-5">
                    <Col lg='1' md='1' sm='0' xs='0'></Col>
                    <Col lg="10" md="10" sm="12" xs="12">
                        <p className='title'>
                            <FormattedMessage id="Features.title" />
                        </p>
                        <Row>
                            {
                                featureList.map(item => {
                                    return (
                                        <Col lg="4" md='6' sm='6' xs='12' align='center' key={ item.key }>
                                            {/* <ul className="list-group"> */}
                                                <li key={ item.key } className="list-group-item d-flex align-items-center justify-content-center flex-column feature" align="center">
                                                    <FontAwesomeIcon icon={ item.icon } title={ item.title } size='5x' color='#007bff' />
                                                    <span className='feature-text'>
                                                        <FormattedMessage id={ item.textId} />
                                                    </span>
                                                </li>
                                            {/* </ul> */}
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Features;