import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class UserLimits extends Component {
    render() {
        return (
            <div className='user-limits'>
                <Card>
                    <Card.Title>
                        Kullanım Bilgileri
                    </Card.Title>
                    <Card.Body>
                        <b>Remaining Minutes: </b>
                        15 dk
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default UserLimits;