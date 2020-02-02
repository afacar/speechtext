import React, { createRef } from 'react';
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
            <div ref={refs.howItWorksRef}>
                <HowItWorks />
            </div>
            <hr />
            <div ref={refs.featuresRef}>
                <Features />
            </div>
            <hr />
            <br />
            <div ref={refs.pricingRef}>
                <Pricing goToRef={goToRef} />
            </div>
            <hr />
            <div ref={refs.aboutRef}>
                <AboutUs />
            </div>
            <hr />
            <div ref={refs.contactRef}>
                <Contact goToRef={goToRef} />
            </div>
            <Footer />
        </div>
    );
}

export default Main;