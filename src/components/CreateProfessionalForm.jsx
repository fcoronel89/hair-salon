import { useFormik } from "formik";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import classes from "./CreateProfessionalForm.module.css";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { firebaseApp } from "../utils/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import {
  isRequired,
  isNumber,
  isDate,
  isImage,
  isDNI,
  hasAtLeastOneChecked,
} from "../utils/validation";
import { updateProfessional } from "../utils/http";

const uploadImage = async (image) => {
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
  const downloadURL = await getDownloadURL(uploadedFileRef);
  return downloadURL;
};

const getServicesObject = (services, professional) => {
  const outputServiceObject = {};

  services.forEach((item) => {
    outputServiceObject[item._id] =
      professional &&
      professional.serviceType &&
      professional.serviceType.some(
        (service) => service === item._id.toString()
      );

    if (!outputServiceObject[item._id]) {
      outputServiceObject[item._id] = false;
    }
  });

  return outputServiceObject;
};

const CreateProfessionalForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const formResponse = useActionData();
  const { services, professional } = useLoaderData();
  const isEditMode = !!professional;
  console.log(professional, "formresponse");
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const defaultValues = professional || {
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    dni: "",
    image: null,
    id: "",
    active: true,
  };

  const validationSchema = Yup.object({
    firstName: isRequired("Ingresar Nombre"),
    lastName: isRequired("Ingresar Apellido"),
    phone: isNumber("Ingresar Telefono"),
    birthDate: isDate("La fecha no puede ser en el futuro"),
    serviceType: hasAtLeastOneChecked(
      "Seleccionar al menos un tipo de servicio"
    ),
    image:
      (isEditMode && professional.image && isRequired("Imagen requerida")) ||
      isImage("Ingresar imagen valida"),
    dni: isDNI("Ingresar DNI"),
  });

  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      serviceType: getServicesObject(services, professional),
      isEditMode,
      id: isEditMode && professional.id,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const serviceTypesSelected = values.serviceType;
      const selectedCheckboxes = Object.keys(serviceTypesSelected).filter(
        (key) => {
          return serviceTypesSelected[key];
        }
      );

      const imageUrl =
        (isEditMode &&
          values.image === professional.image &&
          professional.image) ||
        (await uploadImage(values.image));
      const dataToSend = {
        ...values,
        serviceType: selectedCheckboxes,
        image: imageUrl,
      };

      submit(dataToSend, {
        action: isEditMode
          ? "/profesionales/editar/" + professional._id
          : "/profesionales/crear",
        method: isEditMode ? "PUT" : "POST",
        encType: "multipart/form-data",
      });
    },
    onSuccess: () => {
      setIsSubmitting(false);
    },
  });

  const handleUpdateStatus = async (activeStatus) => {
    const response = await updateProfessional(
      { ...professional, active: activeStatus },
      professional._id
    );

    if (response) {
      navigate("/profesionales");
    }
  };

  const handleDelete = () => handleUpdateStatus(false);

  const handleActivate = () => handleUpdateStatus(true);

  return (
    <form id="myForm" className={classes.form} onSubmit={formik.handleSubmit}>
      <h2>Crear Profesional</h2>
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
          formik.touched.dni && formik.errors.dni ? classes["invalid"] : ""
        }`}
      >
        <label>DNI *</label>
        <input
          type="text"
          id="dni"
          name="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
        />
        {formik.touched.dni && formik.errors.dni ? (
          <p>{formik.errors.dni}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.image && formik.errors.image ? classes["invalid"] : ""
        }`}
      >
        <label>Foto *</label>
        {formik.values.image ? (
          <img src={formik.values.image} />
        ) : (
          <input
            type="file"
            id="image"
            name="image"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
          />
        )}
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
        <ul className={classes["services-list"]}>
          {services &&
            services.map((service) => (
              <li key={service._id}>
                <label>
                  {service.name}
                  <input
                    type="checkbox"
                    name={`serviceType.${service._id}`}
                    onChange={formik.handleChange}
                    checked={formik.values.serviceType[service._id]}
                  />
                </label>
              </li>
            ))}
        </ul>
        {formik.touched.serviceType && formik.errors.serviceType ? (
          <p>{formik.errors.serviceType}</p>
        ) : null}
      </div>
      <div className={classes.actions}>
        {formResponse && <p>{formResponse.message}</p>}
        {isSubmitting && <p>Enviando...</p>}
        <input type="hidden" value={formik.values.isEditMode} />
        <input type="hidden" value={formik.values.id} />
        <input type="hidden" value={formik.values.active} />
        {isEditMode && professional.active && (
          <button
            type="button"
            className={classes["button-delete"]}
            onClick={handleDelete}
          >
            Desactivar Profesional
          </button>
        )}
        {isEditMode && !professional.active && (
          <button
            type="button"
            className={classes["button-activate"]}
            onClick={handleActivate}
          >
            Activar Profesional
          </button>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Guardar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default CreateProfessionalForm;
