import Utils from '../utils';
import publicIp from 'public-ip';

const { firestore } = Utils.firebase;

export const saveEvaluation = (evaluation) => {
    return async () => {
        const { userId, fileId, transcriptionRating, editorRating, thoughts } = evaluation;
        var ip = await publicIp.v4();
        firestore().collection('evaluation').doc(userId).collection('files').doc(fileId)
            .set({
                transcriptionRating,
                editorRating,
                thoughts,
                ip
            });
    }
}