import { getDocs, addDoc } from 'firebase/firestore';

const checkCollection = async (ref) => {
    const querySnapshot = await getDocs(ref);
    if (querySnapshot.empty) {
        await addDoc(ref, {});
    }
};

export default checkCollection;