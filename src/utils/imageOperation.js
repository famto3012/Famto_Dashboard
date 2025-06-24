import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/config/firebase";

const uploadFileToFirebase = (file, folderName) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const fileName = `${file.name}-${new Date()}`;

    const storageRef = ref(storage, `${folderName}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optionally handle progress
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch(reject);
      }
    );
  });
};

const deleteFileFromFirebase = async (fileUrl) => {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    throw error;
  }
};

export { uploadFileToFirebase, deleteFileFromFirebase };
