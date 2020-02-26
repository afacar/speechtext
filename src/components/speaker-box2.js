import React, { Component } from 'react';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Overlay } from 'react-bootstrap';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setCurrentSpeakerBox } from '../actions';
import { ListGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';


class SpeakerBox2 extends Component {
    state = {
        speakers: ['Ali', 'Cemil'],
        _new: '',
        show: false
    }

    ref = null;

    addNew = (e) => {
        console.log('New speaker submit', e)
        if (e.key !== 'Enter') {
            console.log('Not Enter')
            return
        }
        const { speakers, _new } = this.state;
        console.log('state before push', this.state)
        if (_new && !this.state.speakers.includes(_new)) {
            console.log('Adding New speaker')
            speakers.push(_new)
            this.setState({ speakers, _new: '' })
            console.log('newState after new spaker', this.state.speakers)
        }
    }

    editSpeaker = (e, index) => {
        console.log('editSpeaker called', e.target.value, index)
        const { speakers } = this.state;
        speakers[index] = e.target.value;
        this.setState({ speakers })
        console.log('new state', this.state)
    }

    render() {
        console.log('Rendering Overlay')
        return (
            <div>
                <Button variant="light" ref={c => this.refButton = c} onClick={() => this.setState({ show: !this.state.show })}>
                    <FontAwesomeIcon icon={faUserPlus} color="blue" size="1x" />
                </Button>
                <Overlay target={this.refButton} show={this.state.show} placement="right">
                    <div>
                        <Popover id="popover-basic">
                            <Popover.Title as="h3">
                                <input
                                    id={'_new'}
                                    type="text"
                                    onChange={(e) => this.setState({ _new: e.target.value })}
                                    onKeyDown={this.addNew}
                                    value={this.state._new}
                                    placeholder={'Add new...'}
                                />
                            </Popover.Title>
                            <Popover.Content>
                                <ListGroup>
                                    {this.state.speakers.map((speaker, index) => {
                                        console.log('new speakers came!')
                                        return (
                                            <ListGroup.Item>
                                                <input
                                                    id={index}
                                                    type="text"
                                                    onChange={(e) => this.editSpeaker(e, index)}
                                                    value={speaker}
                                                />
                                            </ListGroup.Item>
                                        )
                                    }
                                    )
                                    }
                                </ListGroup>
                            </Popover.Content>
                        </Popover>
                    </div>
                </Overlay>
            </div>
        );
    }
}

const mapStateToProps = ({ selectedSpeakerBox }) => {
    return ({
        openedIndex: selectedSpeakerBox.index
    })
}

export default SpeakerBox2;
