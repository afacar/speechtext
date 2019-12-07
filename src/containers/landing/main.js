import React, { createRef } from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import '../../styles/main.css';

import Header from '../header';
import Entry from './entry';
import HowItWorks from './how-it-works';
import Features from './features';
import Pricing from './pricing';
import AboutUs from './about-us';
import Contact from './contact';
import Footer from '../footer';

const Main = () => {
    const refs = {
        topRef: createRef(),
        howItWorksRef: createRef(),
        featuresRef: createRef(),
        pricingRef: createRef(),
        aboutRef: createRef(),
        contactRef: createRef(),
        demoRef: createRef()
    }

    const goToRef = (ref) => {
        refs[ref].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    return (
        <div>
            <Helmet>
                <meta name="description" content="Transcribe All Audio/Video Records into Text with Speechtext.io" />
                <title>Speechtext.io | Speech to Text Audio/Video Transcription</title>
                <link rel="canonical" href="https://speechtext.io" />
            </Helmet>
            <Header goToRef={goToRef} showLinks={true} />
            <div ref={refs.topRef}>
                <Entry />
            </div>
            <Container style={{ marginBottom: '100px' }}>
                <div ref={refs.howItWorksRef} className='page-style'>
                    <HowItWorks />
                </div>
                <hr />
                <div ref={refs.featuresRef} className='page-style'>
                    <Features />
                </div>
                <hr />
                <div ref={refs.pricingRef} className='page-style'>
                    <Pricing goToRef={goToRef} />
                </div>
                <hr />
                <div ref={refs.aboutRef} className='page-style'>
                    <AboutUs />
                </div>
                <hr />
                <div ref={refs.contactRef} className='page-style'>
                    <Contact goToRef={goToRef} />
                </div>
            </Container>
            <Footer />
        </div>
    );
}

export default Main;