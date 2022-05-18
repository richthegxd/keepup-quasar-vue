import { initializeApp } from "firebase/app";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject,
} from "firebase/storage";

import generateId from "../generator";

initializeApp(
  {
    apiKey: "AIzaSyA-kGauOvCEv6QIKTxdZffwm9sEfYaJLJ0",
    authDomain: "keepup-50852.firebaseapp.com",
    projectId: "keepup-50852",
    storageBucket: "keepup-50852.appspot.com",
    messagingSenderId: "968330908178",
    appId: "1:968330908178:web:0cdf87624167f1fc6dfecb",
    measurementId: "G-3X2SLGBZN6",
  },
);

const storage = getStorage();

/**
 * It takes a file and uploads it to Firebase Storage
 * @param file - The file to upload.
 * @returns The URL of the image and the path to the image.
 */
async function uploadFile(file) {
  try {
    const storageRef = ref(storage, `images/${generateId()}-${file[0].name}`);

    const snapshot = await uploadBytes(storageRef, file[0]);

    const imageUrl = await getDownloadURL(
      ref(storage, snapshot.metadata.fullPath),
    );

    return {
      url: imageUrl,
      path: snapshot.metadata.fullPath,
    };
  } catch (e) {
    return e;
  }
}

/**
 * Delete a file from Firebase Storage
 * @param path - The path to the file in Firebase Storage.
 * @returns The return value is a promise that resolves to true
 * if the file was deleted successfully.
 */
async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);

    return true;
  } catch (e) {
    return e;
  }
}

export { uploadFile, deleteFile };
