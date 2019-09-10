import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const UserBox = () => {
    return (
        <div className='user-box'>
            <Link to='/profile' className='profile-link'>
                <p className='profile-name'>
                    Salih Şentürk
                    <br />
                    <span className='profile-subtext'>
                        <FormattedMessage id='Header.myAccount' />
                    </span>
                </p>
            </Link>
            <Button variant='outline-danger' size='sm' className='sign-out' alt='Sign out'>
                <FontAwesomeIcon icon={ faSignOutAlt } />
            </Button>
        </div>
    );
}

export default UserBox;