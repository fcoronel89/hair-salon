import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from "./firebase";
export const uploadImage = async (image: File) => {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage);
  // Generate a unique name for the image (e.g., using a timestamp)
  const imageName = `${Date.now()}_${image.name}`;

  const imagesRef = ref(storageRef, "images");
  const imageRef = ref(imagesRef, imageName);
  // Upload the image using the reference
  const snapshot = await uploadBytes(imageRef, image);
  // Get the reference to the uploaded file
  const uploadedFileRef = snapshot.ref;
  // Get the download URL of the uploaded file
  return await getDownloadURL(uploadedFileRef);
};
