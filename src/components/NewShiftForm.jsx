import Modal from "./UI/Modal";
import classes from "./NewShiftForm.module.css";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const durationData = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

const validationSchema = Yup.object({
  firstName: Yup.string()
    .max(50, "Must be 20 characters or less")
    .required("Ingresar Nombre"),
  lastName: Yup.string()
    .max(50, "Must be 20 characters or less")
    .required("Ingresar Apellido"),
  email: Yup.string()
    .email("Ingresa un Email valido")
    .required("Ingresar Email"),
  phone: Yup.number()
    .integer("Ingresar solo numeros")
    .moreThan(99999999, "Ingresar numero valido")
    .required("Ingresar Telefono"),
});

const formatHairdressers = (hairDressers) => {
  const userList = Object.entries(hairDressers).map(([id, hairDresser]) => ({
    id,
    birthDate: hairDresser.birthDate,
    firstName: hairDresser.firstName,
    lastName: hairDresser.lastName,
    phone: hairDresser.phone,
    serviceType: hairDresser.serviceType,
    image: hairDresser.image,
  }));
  return userList;
};

const NewShiftForm = () => {
  const navigate = useNavigate();
  const { hairDressers, user } = useLoaderData();
  const formattedHairDressers = formatHairdressers(hairDressers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  console.log(formResponse, "formresponse");
  const submit = useSubmit();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      submit(values, {
        action: "/agenda/crear-turno",
        method: "POST",
      });
    },
  });

  const isFormValid = formik.isValid;

  return (
    <Modal
      onClose={() => {
        navigate("../");
      }}
    >
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <div>
          <h2>Datos del turno</h2>
          <div>
            <label>Profesional *</label>
            <ul className={classes["hairdressers-list"]}>
              {formattedHairDressers.map((hairDresser) => (
                <li key={hairDresser.id}>
                  <img alt={hairDresser.firstName} src={hairDresser.image} />{" "}
                  <p>{hairDresser.firstName}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="input-container">
            <label>Fecha *</label>
            <input
              type="date"
              id="shiftDate"
              name="shiftDate"
              value={formik.values.shiftDate}
              onChange={formik.handleChange}
            />
            <label>Duracion en min*</label>
            <select></select>
          </div>
        </div>
        <div>
          <h2>Datos del cliente</h2>
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
              formik.touched.email && formik.errors.email
                ? classes["invalid"]
                : ""
            }`}
          >
            <label>Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email ? (
              <p>{formik.errors.email}</p>
            ) : null}
          </div>
          <div
            className={`${classes["input-container"]} ${
              formik.touched.phone && formik.errors.phone
                ? classes["invalid"]
                : ""
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
          <div className={classes.actions}>
            {formResponse && <p>{formResponse.message}</p>}
            {isSubmitting && <p>Enviando...</p>}
            <button type="submit" disabled={!isFormValid}>
              Agendar turno
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewShiftForm;
