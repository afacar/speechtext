import React, { useState } from 'react';
import { EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';
import SpeakerBox2 from '../speaker-box2';

const TranscriptEditorBlock = (props) => {
  const { openedEditable } = useState(false);
  /*   const { contentState } = props;
    const entity = contentState.getEntity(entityKey);
    const titleString = `${entity.data.start.toFixed(2)} - ${entity.data.end.toFixed(2)}`; */
  const characterList = props.block.getCharacterList();
  const contentState = props.contentState;
  const start = contentState.getEntity(characterList.first().entity).data.start;

  const addZero = (value, length) => {
    if (value === 0) {
      return length === 3 ? '000' : '00';
    }
    if (value < 10) return length === 3 ? '00' : '0' + value.toString();
    return value;
  }

  const formatTime = (time) => {
    let seconds = Math.floor(time);
    let formattedTime = '';
    if (seconds > 60) {
      let minutes = parseInt(seconds / 60);
      seconds = seconds % 60;
      if (minutes > 60) {
        let hours = parseInt(minutes / 60);
        minutes = minutes % 60;
        formattedTime = addZero(hours) + ':';
      } else {
        formattedTime = '00:';
      }
      formattedTime += addZero(minutes) + ':';
    } else {
      formattedTime += '00:00:';
    }
    formattedTime += addZero(seconds)

    return formattedTime;
  }

  const speakerSection = props.blockProps.showSpeakers ? (
    <div
      id={'conversionTime_' + props.index}
      className='d-flex justify-content-between conversionTime'
      disabled={true}
    >
      <div>
        {/* <FontAwesomeIcon icon={faPen} className='speaker-pen-icon' /> */}
        {/* <input className="input-speaker" ref={id} placeholder={this.props.intl.formatMessage({ id: "Editor.Speaker.Input" })} onChange={(text) => this.onSpeakerChange(text, index)} value={alternative.speakerTag}></input> */}
        {/* <OutsideAlerter handleClickOutside={this.props.setCurrentSpeakerBox}> */}
        <SpeakerBox2
          index={props.index}
          openedEditable={openedEditable}
          speaker={props.block.data.get('speaker') + 1}
        // onSpeakerChange={this.onSpeakerChange}
        // speakerList={ alternative.speakerList }
        />
        {/* </OutsideAlerter> */}

      </div>
      {start}
    </div>
  ) : null;

  return (
    <div className="transcript-editor-block row">
      <div className="transcript-editor-speaker" contentEditable={false}>
        <SpeakerBox2
          index={props.block.get('key')}
          openedEditable={openedEditable}
          speaker={props.block.data.get('speaker')}
          speakerList={props.blockProps.speakers}
          editSpeaker={props.blockProps.editSpeaker}
          addNewSpeaker={props.blockProps.addNewSpeaker}
          setSpeaker={props.blockProps.setSpeaker}
        />
        <div contentEditable={false}>{formatTime(start)}</div>
      </div>
      <div className="transcript-editor-text">
        <EditorBlock {...props} />
      </div>
    </div>
  );
};

TranscriptEditorBlock.propTypes = {
  block: PropTypes.node.isRequired,
  blockProps: PropTypes.shape({
    showSpeakers: PropTypes.bool,
  }).isRequired,
};

export default TranscriptEditorBlock;
