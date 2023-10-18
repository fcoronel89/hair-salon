import { useActionData, useLoaderData, useSubmit } from "react-router-dom";
import classes from "./CreateUserForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

import {
  isRequired,
  isNumber,
  isDate,
  isDNI,
  isEmail,
  isPassword,
} from "../utils/validation";

const validationSchema = Yup.object({
  userName: isRequired("Ingresar nombre de usuario"),
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  email: isEmail("Ingresar Email"),
  password: isPassword("Ingresar Contraseña"),
  phone: isNumber("Ingresar Telefono"),
  dni: isDNI("Ingresar DNI"),
  birthDate: isDate("La fecha no puede ser en el futuro"),
});

const CreateUserForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  const user = useLoaderData();
  const isEditMode = !!user;
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const defaultValues = user || {
    userName: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    dni: "",
    userType: "seller",
  };
  console.log("user", user);
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      submit(values, {
        action: isEditMode ? "/usuarios/editar/" + user.id : "/crear-usuario",
        method: isEditMode ? "PUT" : "POST",
      });
    },
    onSuccess: () => {
      setIsSubmitting(false);
    },
  });

  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <h2>Crear Usuario</h2>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.userName && formik.errors.userName
            ? classes["invalid"]
            : ""
        }`}
      >
        <label>Usuario *</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formik.values.userName}
          onChange={formik.handleChange}
        />
        {formik.touched.userName && formik.errors.userName ? (
          <p>{formik.errors.userName}</p>
        ) : null}
      </div>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.password && formik.errors.password
            ? classes["invalid"]
            : ""
        }`}
      >
        <label>Contraseña *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password ? (
          <p>{formik.errors.password}</p>
        ) : null}
      </div>
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
          formik.touched.email && formik.errors.email ? classes["invalid"] : ""
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
        <label>Dni *</label>
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
      {formik.values.userType === "admin" ? (
        <input type="hidden" name="userType" value={formik.values.userType} />
      ) : (
        <div className={classes["input-container"]}>
          <label>Tipo de usuario</label>
          <select
            name="userType"
            value={formik.values.userType}
            onChange={formik.handleChange}
          >
            <option value="seller">Vendedor</option>
            <option value="hairsalon">Peluqueria</option>
          </select>
        </div>
      )}
      <div className={classes.actions}>
        {formResponse && <p>{formResponse.message}</p>}
        {isSubmitting && <p>Enviando...</p>}
        <button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Guardar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
