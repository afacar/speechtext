import React, { useState } from 'react';
import { EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';
import SpeakerBox from '../../components/speaker-box';

const TranscriptEditorBlock = (props) => {
  const { openedEditable, setOpenedEditable } = useState(false);
/*   const { contentState } = props;
  const entity = contentState.getEntity(entityKey);
  const titleString = `${entity.data.start.toFixed(2)} - ${entity.data.end.toFixed(2)}`; */
  const characterList = props.block.getCharacterList();
  const contentState = props.contentState;
  const start = contentState.getEntity(characterList.first().entity).data.start;
  const end = contentState.getEntity(characterList.last().entity).data.end;

  const addZero = (value, length) => {
    if (value === 0) {
        return length === 3 ? '000' : '00';
    }
    if (value < 10) return length === 3 ? '00' : '0' + value.toString();
    return value;
  }

  const formatTime = (time) => {
    let seconds = Math.floor(time);
    let nanos = parseInt(time % 1 * 100);
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
    formattedTime += addZero(seconds) + ',' + addZero(nanos, 3);

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
          <SpeakerBox
              index={ props.index }
              openedEditable={openedEditable}
              speaker={ props.block.data.get('speaker') + 1 }
              // onSpeakerChange={this.onSpeakerChange}
              // speakerList={ alternative.speakerList }
          />
          {/* </OutsideAlerter> */}

      </div>
      { formatTime(start) + ' - ' + formatTime(end) }
    </div>
  ) : null;

  return (
    <div className="transcript-editor-block">
      {speakerSection}
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
