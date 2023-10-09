import { useFormik } from "formik";
import { useActionData, useSubmit } from "react-router-dom";
import classes from "./CreateHairDresserForm.module.css";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { firebaseApp } from "../utils/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { removeQueryParameters } from "../utils/helpers";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Ingresar Nombre"),
  lastName: Yup.string().required("Ingresar Apellido"),
  phone: Yup.number()
    .integer("Ingresar solo numeros")
    .moreThan(99999999, "Ingresar numero valido")
    .required("Ingresar Telefono"),
  birthDate: Yup.date()
    .nullable()
    .max(new Date(), "La fecha no puede ser en el futuro"),
  serviceType: Yup.object().test(
    "atLeastOneChecked",
    "Seleccionar al menos un tipo de servicio",
    (values) => Object.values(values).some(Boolean)
  ),
  image: Yup.mixed().required("Image is required"),
});

const uploadImage = async (image) => {
  console.log(image, "image");
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage);
  const imagesRef = ref(storageRef, "images");
  // Generate a unique name for the image (e.g., using a timestamp)
  const imageName = `${Date.now()}_${image.name}`;
  const imageRef = ref(imagesRef, imageName);
  // Upload the image using the reference
  const snapshot = await uploadBytes(imageRef, image);
  // Get the reference to the uploaded file
  const uploadedFileRef = snapshot.ref;

  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(uploadedFileRef);
  return removeQueryParameters(downloadURL);
};

const CreateHairDresserForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  console.log(formResponse, "formresponse");
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: "",
      dni: "",
      serviceType: {
        color: false,
        corte: false,
        alisado: false,
      },
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("isSubmitting");
      setIsSubmitting(true);
      const serviceTypesSelected = values.serviceType;
      const selectedCheckboxes = Object.keys(serviceTypesSelected).filter(
        (key) => {
          return serviceTypesSelected[key];
        }
      );

      const imageUrl = await uploadImage(values.image);

      const dataToSend = {
        ...values,
        serviceType: selectedCheckboxes,
        image: imageUrl,
      };
      console.log(dataToSend, "dataToSend");

      submit(dataToSend, {
        action: "/crear-peluquero",
        method: "POST",
        encType: "multipart/form-data",
      });
    },
    onSuccess: () => {
      setIsSubmitting(false);
    },
  });

  const isFormValid = formik.isValid;
  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <h2>Crear Peluquero</h2>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.firstName && formik.errors.firstName
            ? classes["invalid"]
            : ""
        }`}
      >
        <label>Nombre *</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <p>{formik.errors.firstName}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.lastName && formik.errors.lastName
            ? classes["invalid"]
            : ""
        }`}
      >
        <label>Apellido *</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <p>{formik.errors.lastName}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.birthDate && formik.errors.birthDate
            ? classes["invalid"]
            : ""
        }`}
      >
        <label>Fecha de nacimiento</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formik.values.birthDate}
          onChange={formik.handleChange}
        />
        {formik.touched.birthDate && formik.errors.birthDate ? (
          <p>{formik.errors.birthDate}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.phone && formik.errors.phone ? classes["invalid"] : ""
        }`}
      >
        <label>Telefono *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
        />
        {formik.touched.phone && formik.errors.phone ? (
          <p>{formik.errors.phone}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.image && formik.errors.image ? classes["invalid"] : ""
        }`}
      >
        <label>Foto *</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(event) => {
            formik.setFieldValue("image", event.currentTarget.files[0]);
          }}
        />
        {formik.touched.image && formik.errors.image ? (
          <p>{formik.errors.image}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.serviceType && formik.errors.serviceType
            ? classes["invalid"]
            : ""
        }`}
      >
        <label>Tipo de Servicio</label>
        <ul>
          <li>
            <label>Corte</label>{" "}
            <input
              type="checkbox"
              name="serviceType.corte"
              onChange={formik.handleChange}
              checked={formik.values.serviceType.corte}
            />
          </li>
          <li>
            <label>Color</label>{" "}
            <input
              type="checkbox"
              name="serviceType.color"
              onChange={formik.handleChange}
              checked={formik.values.serviceType.color}
            />
          </li>
          <li>
            <label>Alisado</label>{" "}
            <input
              type="checkbox"
              name="serviceType.alisado"
              onChange={formik.handleChange}
              checked={formik.values.serviceType.alisado}
            />
          </li>
        </ul>
        {formik.touched.serviceType && formik.errors.serviceType ? (
          <p>{formik.errors.serviceType}</p>
        ) : null}
      </div>
      <div className={classes.actions}>
        {formResponse && <p>{formResponse.message}</p>}
        {isSubmitting && <p>Enviando...</p>}
        <button type="submit" disabled={!isFormValid}>
          Crear
        </button>
      </div>
    </form>
  );
};

export default CreateHairDresserForm;
