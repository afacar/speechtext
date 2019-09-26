import React from 'react';
import { FormattedMessage } from 'react-intl';

import Logo from '../../assets/logo.png';

const LogoContainer = () => {
    return (
        <div className='logo-container'>
            <img alt='Speech > Text' src={ Logo } className='logo-style' />
            <div style={ { float:'right'} }>
                <div className='logo-text-style'>
                    Speech > Text
                </div>
                <small className='logo-footer-style'>
                    <FormattedMessage id="Header.subText"
                        description="Logo subtext"
                    />
                </small>
            </div>
        </div>
    )
}

export default LogoContainer;