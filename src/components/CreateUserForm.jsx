import { useActionData, useSubmit } from "react-router-dom";
import classes from "./CreateUserForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const validationSchema = Yup.object({
  user: Yup.string().required("Ingresar nombre de usuario"),
  firstName: Yup.string()
    .max(50, "Must be 20 characters or less")
    .required("Ingresar Nombre"),
  lastName: Yup.string()
    .max(50, "Must be 20 characters or less")
    .required("Ingresar Apellido"),
  email: Yup.string()
    .email("Ingresa un Email valido")
    .required("Ingresar Email"),
  password: Yup.string().required("Ingresar Contraseña"),
  phone: Yup.string().required("Ingresar Telefono"),
  dni: Yup.string()
    .max(8, "DNI invalido")
    .min(7, "DNI invalido")
    .required("Ingresar DNI"),
});

const CreateUserForm = () => {
  const formResponse = useActionData();
  const submit = useSubmit();
  const formik = useFormik({
    initialValues: {
      user: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: "",
      dni: "",
      userType: "seller",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      submit(values, {
        action: "/crear-usuario",
        method: "POST",
      });
    },
  });
  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <h2>Crear Usuario</h2>
      <div
        className={`${classes["input-container"]} ${
          formik.touched.user && formik.errors.user ? classes["invalid"] : ""
        }`}
      >
        <label>Usuario *</label>
        <input
          type="text"
          id="user"
          name="user"
          value={formik.values.user}
          onChange={formik.handleChange}
        />
        {formik.touched.user && formik.errors.user ? (
          <p>{formik.errors.user}</p>
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
      <div className={classes["input-container"]}>
        <label>Fecha de nacimiento</label>
        <input
          type="text"
          id="birthDate"
          name="birthDate"
          value={formik.values.birthDate}
          onChange={formik.handleChange}
        />
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
      <div className={classes.actions}>
        {formResponse && <p>{formResponse.message}</p>}
        <button type="submit" disabled={!formik.isValid}>
          Crear
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;
