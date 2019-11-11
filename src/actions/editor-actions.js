import _ from 'lodash'
import Utils from '../utils';

export const handleEditorChange = (oldEditorData, neweditorData) => {
    console.log('handleEditorChange ')
    return (dispatch, getState) => {
        // Burda kaldik
        dispatch({
            type: Utils.ActionTypes.HANDLE_TIME_CHANGE,
            payload: { }
        })
    }
}

export const handleTimeChange = (editorData, currentTime) => {
    //console.log('handleTimeChange ', currentTime)
    return (dispatch, getState) => {
        let seconds = Math.floor(currentTime);
        let nanoSeconds = parseInt((currentTime - seconds) * 1000);
        let playerTime = { seconds, nanoSeconds }
        let playerActiveIndex = -1, playerActiveWordIndex = -1;

        if (!_.isEmpty(playerTime) && !_.isEmpty(editorData)) {
            const { seconds, nanoSeconds } = playerTime;
            _.each(editorData, (data, index) => {
                let alternative = data.alternatives[0];
                _.map(alternative.words, (word, wordIndex) => {
                    let { startTime, endTime } = word;
                    let currTime = parseFloat(seconds + '.' + nanoSeconds);
                    startTime = parseFloat(startTime.seconds + '.' + startTime.nanos);
                    endTime = parseFloat(endTime.seconds + '.' + endTime.nanos);
                    if (startTime <= currTime && endTime > currTime) {
                        playerActiveIndex = index;
                        playerActiveWordIndex = wordIndex;
                        return;
                    }
                })
            });

        }
        dispatch({
            type: Utils.ActionTypes.HANDLE_TIME_CHANGE,
            payload: { playerTime, playerActiveIndex, playerActiveWordIndex }
        })
    }
}

export const isPlaying = (isPlaying) => {
    //console.log('isPlaying ', isPlaying)
    return (dispatch, getState) => {
        dispatch({
            type: Utils.ActionTypes.IS_PLAYING,
            payload: { isPlaying }
        })
    }
}