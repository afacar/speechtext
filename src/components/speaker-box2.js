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
import '../styles/speaker-box.css';


class SpeakerBox2 extends Component {
    state = {
        speakers: undefined,
        speakerTag: '',
        show: false,
        useState: false,
    }

    ref = null;

    componentWillReceiveProps(nextProps) {
        if (nextProps.speakerList) {
            this.setState({
                speakers: nextProps.speakerList,
                useState: false
            })
        }
    }

    addNew = (e, addButton) => {
        // console.log('New speaker submit', e)
        if (e.key !== 'Enter' && !addButton) {
            console.log('Not Enter')
            return
        }
        const { speakers, speakerTag } = this.state;
        if (speakerTag && !this.state.speakers.includes(speakerTag)) {
            this.setState({
                speakerTag: ''
            })
            this.props.addNewSpeaker(speakerTag)
        }
    }

    editSpeaker = (e, index) => {
        console.log("e", e)
        // this.props.editSpeaker(e, index)
    }

    editLocalSpeaker = (e, index) => {
        var { speakers } = this.state;
        speakers = speakers.update(index, (item) => {
            return item.set('name', e.target.value);
        })
        this.setState({
            speakers,
            useState: true
        })
    }

    checkSubmit = (e, index) => {
        if (e.key === 'Enter') {
            this.props.editSpeaker(e.target.value, index)
            return
        }
    }

    setSpeaker = (blockIndex, speakerIndex) => {
        this.props.setSpeaker(blockIndex, speakerIndex);
        this.props.setCurrentSpeakerBox(-1);
    }

    render() {
        const { openedIndex, index, speaker, onSpeakerChange, speakerList, setCurrentSpeakerBox } = this.props;
        const { speakers, useState } = this.state;
        var speakerName = speakerList.toJS()[speaker].name;
        if (!speakerName)
            speakerName = '>';

        if (speakerName.length > 3)
            speakerName = speakerName.substring(0, 3);

        if (openedIndex === index) {
            return (
                <div>
                    <Button variant="primary" className="btn-circle" ref={c => this.refButton = c} onClick={() => setCurrentSpeakerBox(-1)}>
                        {speakerName.toUpperCase()}
                    </Button>
                    <Overlay target={this.refButton} show={true} placement="right">
                        <div>
                            <Popover id="popover-basic">
                                <Popover.Title as="h3">
                                    <Button variant="primary"
                                        className="btn-circle list-btn-circle"
                                        onClick={() => this.addNew(index, true)}>
                                        +
                                    </Button>
                                    <input
                                        id={'speakerTag'}
                                        type="text"
                                        className="speaker-input"
                                        contentEditable={false}
                                        onChange={(e) => this.setState({ speakerTag: e.target.value })}
                                        onKeyDown={this.addNew}
                                        value={this.state.speakerTag}
                                        placeholder={this.props.intl.formatMessage({ id: "Editor.Speaker.Input" })}
                                    />
                                </Popover.Title>
                                <Popover.Content>
                                    <ListGroup>
                                        {speakerList.map((speaker, speakerIndex) => {
                                            var speakerName = speaker.get('name');
                                            if (!speakerName)
                                                speakerName = '>';

                                            if (speakerName.length > 3)
                                                speakerName = speakerName.substring(0, 3);
                                            return (
                                                <ListGroup.Item key={speakerIndex}>
                                                    <div className="list-item">
                                                        <Button variant="primary" className="btn-circle list-btn-circle" onClick={() => this.setSpeaker(index, speakerIndex)}>
                                                            {speakerName.toUpperCase()}
                                                        </Button>

                                                        <input
                                                            id={speakerIndex}
                                                            className="speaker-input"
                                                            type="text"
                                                            onKeyDown={(e) => this.checkSubmit(e, speakerIndex)}
                                                            onChange={(e) => this.editLocalSpeaker(e, speakerIndex)}
                                                            value={useState ? speakers.toJS()[speakerIndex].name : speaker.get('name')}
                                                        />
                                                    </div>
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
        return (
            <div>
                <Button variant="primary" className="btn-circle" ref={c => this.refButton = c} onClick={() => setCurrentSpeakerBox(index)}>
                    {speakerName}
                </Button>
            </div>
        )
    }
}

const mapStateToProps = ({ selectedSpeakerBox }) => {
    return ({
        openedIndex: selectedSpeakerBox.index
    })
}

export default connect(mapStateToProps, { setCurrentSpeakerBox })(injectIntl(SpeakerBox2));
