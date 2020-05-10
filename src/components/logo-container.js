import React, { Component } from 'react';
import { connect } from 'react-redux';

import LogoEn from '../assets/logo-en.png';
import LogoTr from '../assets/logo-tr.png';

class LogoContainer extends Component {
    render() {
        const { language } = this.props;
        return (
            <div className='logo-container'>
                <img alt='Online Audio/Video Transcripton Logo' src={language === 'tr-TR' ? LogoTr : LogoEn } className='logo-style' />
            </div>
        )
    }
}

const mapStateToProps = ({ language }) => {
    return { language };
}

export default connect(mapStateToProps)(LogoContainer);