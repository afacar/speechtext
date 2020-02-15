import React, { Component } from 'react';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setCurrentSpeakerBox } from '../actions';
import { ListGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

class SpeakerBox extends Component {

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState.editing)
    //         return true;
    //     return false;
    // }
    state = {
        editing: true,
        speakerTag: ''
    }

    submitSpeaker = (speakerTag, index, editingFlag) => {
        this.props.onSpeakerChange(speakerTag, index)
        this.props.setCurrentSpeakerBox(- 1)
        this.setState({
            editing: editingFlag,
            speakerTag: ''
        })
    }

    render() {
        const { openedIndex, index, speaker, onSpeakerChange, speakerList, setCurrentSpeakerBox } = this.props;
        if (openedIndex === index) {
            return (
                <div className="d-flex flex-column speaker-box opened" ref={this.setWrapperRef}>
                    {
                        speaker && (
                            <Form className='speaker-input-container'>
                                <FormControl className="speaker-input" readOnly={true} autoFocus={!speaker} placeholder={this.props.intl.formatMessage({ id: "Editor.Speaker.Input" })} value={speaker || this.state.speakerTag} onChange={(event) => this.setState({ speakerTag: event.target.value })} />
                                <Button className='speaker-button' onClick={() => {
                                    this.submitSpeaker(undefined, index, true)
                                    // onSpeakerChange(undefined, index)
                                    // setCurrentSpeakerBox(-1)
                                    // this.setState({
                                    //     editing: true,
                                    //     speakerTag: ''
                                    // })
                                }}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button>
                            </Form>
                        )
                    }
                    {
                        !speaker && (
                            <Form className='speaker-input-container'
                                onSubmit={(event) => {
                                    console.log("On submit")
                                    event.preventDefault();
                                    this.submitSpeaker(this.state.speakerTag, index, false)
                                }}>
                                <FormControl className="speaker-input"
                                    readOnly={false}
                                    autoFocus
                                    placeholder={this.props.intl.formatMessage({ id: "Editor.Speaker.Input" })}
                                    value={speaker}
                                    onChange={(event) => this.setState({ speakerTag: event.target.value })} />
                                <Button className='speaker-button active' onClick={() => {
                                    this.submitSpeaker(this.state.speakerTag, index, false)
                                    // onSpeakerChange(this.state.speakerTag, index)
                                    // setCurrentSpeakerBox(-1)
                                    // this.setState({
                                    //     editing: false,
                                    //     speakerTag: ''
                                    // })
                                }
                                }>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </Form>
                        )
                    }
                    <div className="speaker-box-content">
                        <ListGroup as="ul">
                            {
                                _.map(speakerList, (data) => {
                                    return (
                                        <ListGroup.Item action onClick={() => {
                                            console.log("Item clicked with data and index ", data, " ", index)
                                            this.submitSpeaker(data, index, false)
                                            // onSpeakerChange(data, index)
                                            // setCurrentSpeakerBox(-1);
                                            // this.setState({
                                            //     editing: false,
                                            //     speakerTag: ''
                                            // })
                                        }
                                        }
                                        >
                                            {data}
                                        </ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    </div>
                </div>
            )
        }
        return (
            <div className="speaker-box closed" ref={this.setWrapperRef}>
                <div className="d-flex justify-content-center align-items-center header">
                    <Button className="header-button" onClick={() => { setCurrentSpeakerBox(index) }}>
                        <span className={speaker ? 'speaker' : ''}>
                            {speaker || this.props.intl.formatMessage({ id: "Editor.Speaker.Button" })}
                        </span>
                        {
                            !speaker && (
                                <span className="header-button-icon">
                                    <svg fill="#AFAFAF" width="12px" height="12px" viewBox="0 0 13 13" class=""><path d="M6.5,0.127252432 C5.90171111,0.127252432 5.41666667,0.599187568 5.41666667,1.18130649 L5.41666667,5.3975227 L1.08333333,5.3975227 C0.485044444,5.3975227 0,5.86942973 0,6.45158378 C0,7.0337027 0.485044444,7.50563784 1.08333333,7.50563784 L5.41666667,7.50563784 L5.41666667,11.7218541 C5.41666667,12.3040081 5.90171111,12.7759081 6.5,12.7759081 C7.098325,12.7759081 7.58333333,12.3040081 7.58333333,11.7218541 L7.58333333,7.50563784 L11.9166667,7.50563784 C12.5149556,7.50563784 13,7.0337027 13,6.45158378 C13,5.86942973 12.5149556,5.3975227 11.9166667,5.3975227 L7.58333333,5.3975227 L7.58333333,1.18130649 C7.58333333,0.599187568 7.098325,0.127252432 6.5,0.127252432 Z"></path></svg>
                                </span>
                            )
                        }
                    </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ selectedSpeakerBox }) => {
    return ({
        openedIndex: selectedSpeakerBox.index
    })
}

export default connect(mapStateToProps, { setCurrentSpeakerBox })((injectIntl(SpeakerBox)));
