import React from 'react';
import { Container } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import LogoContainer from '../landing/logo-container';

const AboutUs = () => {
    return (
        <Container className="about-us-content mb-5 mt-5">
            <div className='about-logo-container'>
                <LogoContainer />
            </div>
            <div className='about-us-title'><FormattedMessage id='AboutUs.title' /></div>
            <br /><br />
            <div className='about-us-container'>
                <p>
                    <FormattedMessage id='AboutUs.paragraph1' />
                </p>
                <p>
                    <FormattedMessage id='AboutUs.paragraph2' />
                </p>
            </div>
        </Container>
    )
}

export default AboutUs;