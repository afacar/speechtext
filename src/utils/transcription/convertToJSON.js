
const convertToJSON = (transcript) => {
  let newJson = { speakers: [], segments: [] }

  if (transcript.segments) return transcript;
  console.log('transcript', transcript)

  for (let i = 0; i < transcript.length; i++) {
    var { alternatives } = transcript[i];
    var { words, confidence, startTime, endTime } = alternatives[0];
    if (words) {
      let speaker = words[0].speakerTag
      let newWords = words.map((word, ind) => {
        return {
          start: parseFloat(word.startTime.seconds + '.' + word.startTime.nanos / 100),
          end: parseFloat(word.endTime.seconds + '.' + word.endTime.nanos / 100),
          text: word.word
        }
      })
      newJson.speakers.push({ name: '' })
      newJson.segments.push({ words: newWords, speaker })

    }
  }

  return newJson
}

export default convertToJSON;