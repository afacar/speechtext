import React from 'react';
import { Container, Accordion, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../header';
import Footer from '../footer';
import { FormattedMessage } from 'react-intl';

const FrequentlyAskedQuestions = (props) => {
    localStorage.setItem('location', window.location.pathname);
    return (
        <div>
            <Helmet>
                <meta name="description" content="Read Frequently Asked Questions for Speechtext.io" />
                <title>Speechtext.io | Frequently Asked Questions</title>
                <link rel="canonical" href="http://speechtext.io/faq" />
            </Helmet>
            <Header />
            <Container className='faq-container'>
                <h2 align='center'><b>Frequently Asked Questions (F.A.Q.)</b></h2>
                <br />
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                How does SpeechText.io work?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                When you upload your video/audio file, it is first processed and converted to a more suitable format for Automatic Speech Recognition (ASR) engine on the secure cloud systems. Then speechtext.io extracts speech from within your video/audio files by using state-of-art ASR engines at the background. After it is transcribed, result is presented within an online speech-text editor so you can edit your transcription and download it to your PC. 
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                Is there any cost using SpeechText.io?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                There is no cost to using the default Speechtext.io (demo version). You get 10 minutes of transcription for free at the beginning. You can upgrade to Speechtext.io “Pay as You Go” for $5,90 / 60 minutes or “Monthly Subscription” to get 300 minutes of transcription per month for a low subscription fee of USD $24.90 monthly. For enterprise plan, please contact us!
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                How can I transcribe my files for free? 
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                You can easily create your account and make use of 10 minutes of free transcription with demo account. Once you tried our service, we believe that you will like its functionality and accuracy. For more than 10 minutes transcription, you will need to go to our paid plans which offers best price for transcription among competitors. 
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                Is there any educational discount for Speechtext.io Plans?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>
                                Yes, there is an educational discount available to those who provide verification. All you need to do is, create SpeechText.io account with your university/college email account and email us at support@speechtext.io to claim student/researcher discount. When it is approved, you can get %20 discount for your all orders for 1 year.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="4">
                                Can I get a better rate, if I have over 30 hours of audio/video files that need to be transcribed?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="4">
                            <Card.Body>
                                For that case, you should consider our enterprise plans that offer better price and extra functionalities. To get the best offers you can contact us at <a href='mailto:support@speechtext.io' target='_blank'>support@speechtext.io</a>. We will be happy to hear from you.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                Which languages are supported?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="5">
                            <Card.Body>
                                We currently support English, Turkish, Arabic, Russian and Spanish. If your language isn’t listed, please contact us (<a href='mailto:support@speechtext.io' target='_blank'>support@speechtext.io</a>). We will be ready to help for transcribing in your language.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                How can I improve the quality of my audio / video file?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="6">
                            <Card.Body>
                                To get the best transcription results, you should upload high quality audio/video. To do that, record your interviews or survey in a quiet environment with less background noise, ensure your speakers to speak  clearly and separately. Additionally, you can provide context information about the speech by entering keywords while uploading your files. This context information is used to feed ASR engines to improve automatic transcription results.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="7">
                                Which file types for audio or video are supported?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="7">
                            <Card.Body>
                                As SpeechText.io, we can transcribe most of audio and video file formats including, but not limited to:
                                <ul>
                                    <li>
                                        Popular audio file formats: *.mp3, *.mp4, *.m4a, *.aac, and *.wav
                                    </li>
                                    <li>
                                        Popular video file formats: *.mp4, *.wma, *.mov, and *.avi
                                    </li>
                                </ul>
                                If your file format isn’t listed, please feel free to contact us (<a href='mailto:support@speechtext.io' target='_blank'>support@speechtext.io</a>).
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="8">
                                How accurate are the transcripts that SpeechText.io does?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="8">
                            <Card.Body>
                                As an automated system, we don't claim that your transcript will be 100% accurate but trying to be as accurate as possible.  With high quality audio files, you can get your transcripts up to %95 accuracy rate. To finalize your transcript and make it perfect, we provide an online editor that you can easily edit your transcript file. In order to help you, we also highlight the words that we are not so sure about.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="9">
                                How does SpeechText.io online editor work?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="9">
                            <Card.Body>
                                SpeechText.io online embedded editor works together audio and text. This lets you to edit or correct your transcripted text while listening to your record. You can update, delete, and adjust words and phrases and SpeechText.io will continue to put timestamps.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="10">
                                Can I export my transcript as .docx (MS Word) or .srt (Subtitle File)?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="10">
                            <Card.Body>
                                Yes you can export your transcripted files in .txt, .srt, .docx formats. If you need another file format, please contact us at <a href='mailto:support@speechtext.io' target='_blank'>support@speechtext.io</a>. 
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="11">
                                How long it takes to transcribe an audio/video file?
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="11">
                            <Card.Body>
                                The length and size of your audio or video file is the main determinant of transcription time. After your file upload is finished, it takes 5-10 minutes to complete 1 hour audio approximately. Good news is you don’t need to wait for transcription to finish, since SpeechText.io sends a notification email when it is ready.
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Container>
            <Footer />
        </div>
    )
}

export default FrequentlyAskedQuestions;