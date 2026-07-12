import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../firebase/storage";

export function uploadImage(file, folder = "products") {
  return new Promise((resolve, reject) => {
    const filename = `${Date.now()}-${file.name}`;

    const storageRef = ref(storage, `${folder}/${filename}`);

    const uploadTask = uploadBytesResumable(
      storageRef,
      file
    );

    uploadTask.on(
      "state_changed",

      () => {},

      reject,

      async () => {
        const url = await getDownloadURL(
          uploadTask.snapshot.ref
        );

        resolve(url);
      }
    );
  });
}

export async function removeImage(url) {
  const imageRef = ref(storage, url);

  return deleteObject(imageRef);
}