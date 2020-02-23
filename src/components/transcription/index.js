import TranscriptEditor from './transcript-editor';
import TranscriptEditorBlock from './transcript-editor-block';
import TranscriptEditorWord from './transcript-editor-word';
import TranscriptEditorSpace from './transcript-editor-space';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE } from '../../utils/transcription/transcript-entities';
import convertFromTranscript from '../../utils/transcription/convertFromTranscript';
import convertToTranscript from '../../utils/transcription/convertToTranscript';
import convertToJSON from '../../utils/transcription/convertToJSON';
import { withWords, withTime } from '../../utils/transcription/decorators';

export default TranscriptEditor;
export {
  TranscriptEditorBlock,
  TranscriptEditorWord,
  TranscriptEditorSpace,
  TRANSCRIPT_WORD,
  TRANSCRIPT_SPACE,
  convertFromTranscript,
  convertToTranscript,
  convertToJSON,
  withWords,
  withTime,
};
