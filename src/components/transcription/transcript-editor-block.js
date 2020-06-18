import React, { useState } from 'react';
import { EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';

import SpeakerBox from '../speaker-box';
import Utils from '../../utils';

const TranscriptEditorBlock = (props) => {
  const { openedEditable } = useState(false);
  /*   const { contentState } = props;
    const entity = contentState.getEntity(entityKey);
    const titleString = `${entity.data.start.toFixed(2)} - ${entity.data.end.toFixed(2)}`; */
  const characterList = props.block.getCharacterList();
  const contentState = props.contentState;
  let start = 0;

  if (characterList && characterList.first()) {
    start = contentState.getEntity(characterList.first().entity).data.start;
  } else {
    return <div></div>;
  }

  return (
    <div className="transcript-editor-block row">
      <div className="transcript-editor-speaker" contentEditable={false}>
        <SpeakerBox
          index={props.block.get('key')}
          openedEditable={openedEditable}
          speaker={props.block.data.get('speaker')}
          speakerList={props.blockProps.speakers}
          editSpeaker={props.blockProps.editSpeaker}
          addNewSpeaker={props.blockProps.addNewSpeaker}
          setSpeaker={props.blockProps.setSpeaker}
        />
        <div contentEditable={false}>{Utils.formatTime(start)}</div>
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
