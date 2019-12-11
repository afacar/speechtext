import React from 'react';
import { Container, Accordion, Card, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

import Header from '../header';
import Footer from '../footer';

const FrequentlyAskedQuestions = (props) => {

    return (
        <div>
            <Helmet>
                <meta name="description" content={ props.intl.formatMessage({ id: "FAQ.ContentDescription" }) } />
                <title>{ props.intl.formatMessage({ id: "FAQ.Title" }) }</title>
                <link rel="canonical" href="http://speechtext.io/faq" />
            </Helmet>
            <Header />
            <Container className='faq-container'>
                <h2 align='center'>
                    <b>
                        <FormattedHTMLMessage id="FAQ.Header" />
                    </b>
                </h2>
                <br />
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                <FormattedHTMLMessage id="FAQ.Question1" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer1" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                <FormattedHTMLMessage id="FAQ.Question2" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer2" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                <FormattedHTMLMessage id="FAQ.Question3" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer3" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                <FormattedHTMLMessage id="FAQ.Question4" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer4" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                <FormattedHTMLMessage id="FAQ.Question5" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="4">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer5" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                <FormattedHTMLMessage id="FAQ.Question6" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="5">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer6" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                <FormattedHTMLMessage id="FAQ.Question7" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="6">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer7" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="7">
                                <FormattedHTMLMessage id="FAQ.Question8" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="7">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer8" />
                                <ul>
                                    <li>
                                        <FormattedHTMLMessage id="FAQ.Answer8.1" />
                                    </li>
                                    <li>
                                        <FormattedHTMLMessage id="FAQ.Answer8.2" />
                                    </li>
                                </ul>
                                <FormattedHTMLMessage id="FAQ.Answer8.3" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="8">
                                <FormattedHTMLMessage id="FAQ.Question9" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="8">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer9" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="9">
                                <FormattedHTMLMessage id="FAQ.Question10" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="9">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer10" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="10">
                                <FormattedHTMLMessage id="FAQ.Question11" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="10">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer11" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="11">
                                <FormattedHTMLMessage id="FAQ.Question12" />
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="11">
                            <Card.Body>
                                <FormattedHTMLMessage id="FAQ.Answer12" />
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Container>
            <Footer />
        </div>
    )
}

export default injectIntl(FrequentlyAskedQuestions);