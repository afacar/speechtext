import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Fade } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import '../../styles/entry.css';
import Auth from '../../components/auth';

class Entry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAuth: false,
            animatedDivIndex: 1
        }
    }
    
    componentDidMount = () => {
        setInterval(() => {
            let index = this.state.animatedDivIndex;
            index = index === 3 ? 1 : index + 1;
            this.setState({
                animatedDivIndex: index
            })
        }, 3000);
    }

    handleClose = () => {
        this.setState({
            showAuth: false
        })
    }

    render() {
        return (
            <div className='main-div' >
                <div className='main-div-background'></div>
                <div className='main-div-content'>
                    <Container align="center" className='banner'>
                        <Fade in={this.state.animatedDivIndex === 1} timeout={3000}>
                            <div className='centered'>
                                <FormattedMessage id='Banner.feature1' />
                            </div>
                        </Fade>
                        <Fade in={this.state.animatedDivIndex === 2} timeout={3000}>
                            <div className='centered'>
                                <FormattedMessage id='Banner.feature2' />
                                <br />
                                <FormattedMessage id='Banner.feature3' />
                            </div>
                        </Fade>
                        <Fade in={this.state.animatedDivIndex === 3} timeout={3000}>
                            <div className='centered'>
                                <FormattedMessage id='Banner.feature4' />
                            </div>
                        </Fade>
                    </Container>
                </div>
                <Auth language={ this.props.language } show={ this.state.showAuth } handleClose={ this.handleClose } />
            </div>
        )
    }
}

const mapStateToProps = ({ language, user }) => {
    return {
        language,
        user
    }
}

export default connect(mapStateToProps)(Entry);