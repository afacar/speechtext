import Utils from '../utils';
import publicIp from 'public-ip';

const { firestore } = Utils.firebase;

export const saveEvaluation = (evaluation) => {
    return async () => {
        const { userId, fileId, transcriptionRating, editorRating, thoughts } = evaluation;
        let ip = '';
        try {
            ip = await publicIp.v4();
        } catch (error) {
            console.log('Cannot get user IP adress')
        }
        firestore().collection('evaluation').doc(userId).collection('files').doc(fileId)
            .set({
                transcriptionRating,
                editorRating,
                thoughts,
                ip
            });
    }
}