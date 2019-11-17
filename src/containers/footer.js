import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className='bg-dark'>
            <div className="container">
                <a href="https://www.google.com/maps/dir//39.8986893,32.7742932/@39.8987893,32.7722978,17z" target="_blank" rel="noopener noreferrer"
                    className="float-left text-white">
                    <FontAwesomeIcon icon={ faMapMarkedAlt } size="2x" />
                </a>
                <p className="float-left" style={{ marginLeft: '20px' }}>
                    support@speechtext.io
                    <br />
                    +90 554 242 14 17
                </p>
                <p className="float-right" style={{ paddingTop: '10px' }}>
                    Copyright &copy; SpeechText 2019<br />
                    <span className="float-right">
                        <Link to='/faq' className='footer-link'>F.A.Q.</Link>
                        <Link to='/privacy' className='footer-link margin-left-20'>Privacy Policy</Link>
                        <Link to='/terms' className='footer-link margin-left-20'>Terms of Service</Link>
                    </span>
                </p>
            </div>
        </footer>
    );
}

export default Footer;