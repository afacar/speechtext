import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Helmet } from "react-helmet";
import Header from '../header';
import Footer from '../footer';

const Privacy = () => {
    localStorage.setItem('location', window.location.pathname);
    return (
        <div className='privacy'>
            <Helmet>
                <meta name="description" content="Read Privacy Policy for Speechtext.io" />
                <title>Speechtext.io | Privacy Policy</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Header />
            <Container className='privacy-container'>
                <h2 align='center'><b>Privacy Policy</b></h2>
                <p className='last-update'><b>Last Updated: September 12, 2019</b></p>
                <p>
                    This privacy policy applies between you, the User of this Website and SpeechText.io, the owner and provider of this Website.
                    SpeechText.io takes the privacy of your information very seriously.
                    This privacy policy applies to our use of any and all Data collected by us or provided by you in relation to your use of the Website.
                </p>

                <br />
                <h5><b>Contact Information of the Data Controller</b></h5>
                <p>
                    For the purposes of data protection legislation in the European Union, we are the data controller.
                    This means that we determine the purposes for, and ways in which, we collect and use personal information.
                    SpeechText.io is incorporated in Ankara, TURKEY and registered in Ankara.
                </p>

                <br />
                <h5><b>Scope of Privacy Policy</b></h5>
                <p>
                    This privacy policy applies only to the actions of SpeechText.io and Users with respect to this Website.
                    It does not extend to any websites that can be accessed from this Website including, but not limited to,
                    any links we may provide to social media websites.
                </p>
                <p>
                    For purposes of the applicable Data Protection Laws, SpeechText.io is the "data controller".
                    This means that SpeechText.io determines the purposes for which, and the manner in which, your Data is processed.
                </p>

                <br />
                <h5><b>Information We Collect</b></h5>
                <p>
                    When you interact with us through the Services, we may collect Personal Data and other information from you, as further described below:
                </p>
                <p>
                    Personal Data That You Provide Through the Services: We collect Personal Data from you when you voluntarily provide such information,
                    such as when you contact us with inquiries, respond to one of our surveys, register for access to the Services or use certain Services.
                    Wherever SpeechText.io collects Personal Data we make an effort to provide a link to this Privacy Policy.
                </p>
                <p>
                    In addition, we may have access to your Personal Data if such data is included in any audio files you send us for transcription
                    services. We only use such Personal Data solely to provide the Services to you and to improve our algorithms.
                    We will never sell, lease, or otherwise provide access to such Personal Data to our employees, contractors,
                    agents or other third parties without your authorization.
                </p>
                <p>
                    By voluntarily providing us with Personal Data, you are consenting to our use of it in accordance with this Privacy Policy.
                    If you provide Personal Data to the Services, you acknowledge and agree that such Personal Data may be transferred from your current
                    location to the offices and servers of SpeechText.io and the authorized third parties referred to here in located in Turkey.
                </p>

                <br />
                <h5><b>How We Collect Data</b></h5>
                <p>
                    We collect Data in the following ways:
                </p>
                <ul>
                    <li>data is given to us by you,</li>
                    <li>data is received from other sources, and</li>
                    <li>data is collected automatically</li>
                </ul>

                <br />
                <h5><b>Data Given by You</b></h5>
                <p>
                    SpeechText.io will collect your Data in a number of ways, for example:
                </p>
                <ul>
                    <li>
                        when you contact us through the Website, by telephone, post, e-mail or through any other means;
                    </li>
                    <li>
                        when you register with us and set up an account to receive our products/services;
                    </li>
                    <li>
                        when you complete surveys that we use for research purposes (although you are not obliged to respond to them);
                    </li>
                    <li>
                        when you use our services;
                    </li>
                </ul>
                <p>in each case, in accordance with this privacy policy.</p>

                <br />
                <h5><b>Data Collected Automatically</b></h5>
                <p>
                    To the extent that you access the Website, we will collect your Data automatically, for example:
                </p>
                <ul>
                    <li>
                        we automatically collect some information about your visit to the Website.
                        This information helps us to make improvements to Website content and navigation, and includes your IP address,
                        the date, times and frequency with which you access the Website and the way you use and interact with its content.
                    </li>
                    <li>
                        we will collect your Data automatically via cookies, in line with the cookie settings on your browser.
                        For more information about cookies, and how we use them on the Website, see the section below, headed "Cookies".
                    </li>
                </ul>

                <br />
                <h5><b>Our Use of Data</b></h5>
                <ul>
                    <li>
                        Any or all of the above Data may be required by us from time to time in order to provide you with the best possible service
                        and experience when using our Website. Specifically, Data may be used by us for the following reasons:
                        <ul>
                            <li>
                                internal record keeping;
                            </li>
                            <li>
                                improvement of our products / services;
                            </li>
                            <li>
                                transmission by email of marketing materials that may be of interest to you;
                            </li>
                            <li>
                                contact for market research purposes which may be done using email, telephone, fax or mail.
                                Such information may be used to customise or update the Website;
                            </li>
                        </ul>
                    </li>
                    <li>
                        We may use your Data for the above purposes if we deem it necessary to do so for our legitimate interests.
                        If you are not satisfied with this, you have the right to object in certain circumstances.
                    </li>
                    <li>
                        For the delivery of direct marketing to you via e-mail, we'll need your consent, whether via an opt-in or soft-opt-in:
                        <ul>
                            <li>
                                soft opt-in consent is a specific type of consent which applies when you have previously engaged with us
                                (for example, you contact us to ask us for more details about a particular product/service,
                                and we are marketing similar products/services). Under "soft opt-in" consent,
                                we will take your consent as given unless you opt-out.
                            </li>
                            <li>
                                for other types of e-marketing, we are required to obtain your explicit consent; that is,
                                you need to take positive and affirmative action when consenting by, for example,
                                checking a tick box that we'll provide.
                            </li>
                            <li>
                                if you are not satisfied about our approach to marketing, you have the right to withdraw consent at any time.
                                To find out how to withdraw your consent, see the section headed "Your rights" below.
                            </li>
                        </ul>
                    </li>
                    <li>
                        When you register with us and set up an account to receive our services, the legal basis for this processing is the performance
                        of a contract between you and us and/or taking steps, at your request, to enter into such a contract.
                    </li>
                </ul>

                <br />
                <h5><b>Data Share with</b></h5>
                <p>
                    We may share your Data with the following groups of people for the following reasons:
                </p>
                <ul>
                    <li>
                        our employees, agents and/or professional advisors - To enable us to engage in direct marketing
                        (such as newsletters or marketing emails for products and services provided by us that we believe will be of interest to you);
                    </li>
                    <li>
                        third party payment providers who process payments made over the Website -
                        to enable third party payment providers to process user payments and refunds;
                    </li>
                </ul>
                <p>in each case, in accordance with this privacy policy.</p>

                <br />
                <h5><b>Keeping Data Secure</b></h5>
                <p>
                    SpeechText.io takes reasonable steps to protect the Personal Data provided via the Services from loss, misuse, and
                    unauthorized access, disclosure, alteration, or destruction. However, no Internet or email transmission is ever fully secure or
                    error free. In particular, email sent to or from the Services may not be secure. Therefore, you should take special care in
                    deciding what information you send to us via email. Please keep this in mind when disclosing any Personal Data to SpeechText.io
                    via the Internet.
                </p>
                <p>
                    Unless a longer retention period is required or permitted by law, we will only hold your Data on our systems for the period
                    necessary to fulfil the purposes outlined in this privacy policy or until you request that the Data be deleted.
                </p>
                <p>
                    Even if we delete your Data, it may persist on backup or archival media for legal, tax or regulatory purposes.
                </p>

                <br />
                <h5><b>Links to Other Websites</b></h5>
                <p>
                    This Website may, from time to time, provide links to other websites. We have no control over such websites and are not responsible
                    for the content of these websites. This privacy policy does not extend to your use of such websites.
                    You are advised to read the privacy policy or statement of other websites prior to using them.
                </p>

                <br />
                <h5><b>Cookies</b></h5>
                <p>
                    In operating the Services, we may use a technology called "cookies." A cookie is a piece of information that the computer
                    that hosts our Services gives to your browser when you access the Services. Our cookies help provide additional functionality
                    to the Services and help us analyze Services usage more accurately. For instance, our Site may set a cookie on your browser
                    that allows you to access the Services without needing to remember and then enter a password more than once during a visit
                    to the Site. In all cases in which we use cookies, we will not collect Personal Data except with your permission.
                    On most web browsers, you will find a “help” section on the toolbar. Please refer to this section for information on
                    how to receive notification when you are receiving a new cookie and how to turn cookies off. We recommend that you
                    leave cookies turned on because they allow you to take advantage of some of the Service features.
                </p>

                <br />
                <h5><b>Children’s Privacy</b></h5>
                <p>
                    SpeechText.io does not knowingly collect Personal Data from children under the age of 13.
                    If you are under the age of 13, please do not submit any Personal Data through the Services.
                    We encourage parents and legal guardians to monitor their children’s Internet usage and to help enforce our Privacy Policy
                    by instructing their children never to provide Personal Data on the Services without their permission.
                    If you have reason to believe that a child under the age of 13 has provided Personal Data to SpeechText.io through the Services,
                    please contact us, and we will endeavor to delete that information from our databases.
                </p>

                <br />
                <h5><b>Other Terms and Conditions:</b></h5>
                <p>
                    Your access to and use of the Services is subject to the Terms of Service at&nbsp;
                    <Link to='/terms'>https://speechtext.io/terms</Link>
                </p>

                <br />
                <h5><b>Changes to This Privacy Policy</b></h5>
                <p>
                    SpeechText.io reserves the right to change this privacy policy as we may deem necessary from time to time or
                    as may be required by law. Any changes will be immediately posted on the Website and you are deemed to have accepted the terms
                    of the privacy policy on your first use of the Website following the alterations.
                </p>
                <p>
                    We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the
                    top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage
                    or sending you an email notification). We encourage you to review the Privacy Policy whenever you access the
                    Transcription Service to stay informed about our information practices and the ways you can help protect your privacy.
                </p>
                <br />
                <h5><b>Questions or Complaints</b></h5>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at&nbsp;
                    <a href='mailto:‍support@speechtext.io'>‍support@speechtext.io.</a>
                </p>
            </Container>
            <Footer />
        </div>
    )
}

export default Privacy;