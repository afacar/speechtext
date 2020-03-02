import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className='bg-dark'>
            <div className="container">
                <div className='footer-left'>
                    <a href="https://www.google.com/maps/dir//39.8986893,32.7742932/@39.8987893,32.7722978,17z" target="_blank" rel="noopener noreferrer"
                        className="float-left text-white">
                        <FontAwesomeIcon icon={ faMapMarkedAlt } size="2x" />
                    </a>
                    <p className="float-left">
                        support@speechtext.io
                    </p>
                </div>
                <p className="float-right footer-right">
                    Copyright &copy; SpeechText 2019<br />
                    <span className="float-right">
                        <Link to='/faq' className='footer-link'><FormattedMessage id="Footer.faq" /></Link>
                        <Link to='/privacy' className='footer-link margin-left-20'>Privacy Policy</Link>
                        <Link to='/terms' className='footer-link margin-left-20'>Terms of Service</Link>
                    </span>
                </p>
            </div>
        </footer>
    );
}

export default Footer;