import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import classes from "./UserForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

import { isRequired, isNumber, isDate, isDNI } from "../utils/validation";
import { deleteUser, updateUser } from "../utils/http";
import { apiUrl } from "../utils/helpers";

const validationSchema = Yup.object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  phone: isNumber("Ingresar Telefono"),
  dni: isDNI("Ingresar DNI"),
  birthDate: isDate("La fecha no puede ser en el futuro"),
});

const UserForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  const user = useLoaderData();
  const isEditMode = user && user.firstName ? true : false;
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const defaultValues = isEditMode
    ? user
    : {
        email: user ? user.email : "",
        firstName: "",
        lastName: "",
        birthDate: "",
        phone: "",
        dni: "",
        userType: "seller",
        active: true,
      };
  console.log("user", user);
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log("isSubmittiing", values);
      submit(
        { ...values, id: user._id, googleId: user.googleId },
        {
          action: "/crear-usuario",
          method: "PUT",
        }
      );
    },
    onSuccess: () => {
      setIsSubmitting(false);
    },
  });

  const handleDelete = async () => {
    await deleteUser(user.id);
    navigate("/usuarios");
  };

  const handleActivate = async () => {
    const activate = await updateUser({ ...user, active: true }, user.id);
    if (activate) {
      navigate("/usuarios");
    }
  };

  return (
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <h2>{isEditMode ? "Editar Usuario" : "Crear Usuario"}</h2>
      {!user ? (
        <div>
          <a className={classes["login-button"]} href={`${apiUrl}/auth/google`}>
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" />{" "}
            Entrar con google
          </a>
        </div>
      ) : (
        <>
          <div className={classes["input-container"]}>
            <label>Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              readOnly={true}
            />
          </div>
          <h3>Completar datos adicionales</h3>
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
            <input
              type="hidden"
              name="userType"
              value={formik.values.userType}
            />
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
            <input type="hidden" name="active" value={formik.values.active} />
            {formResponse && <p>{formResponse.message}</p>}
            {isSubmitting && <p>Enviando...</p>}
            {isEditMode && user.userType === "admin" && (
              <button
                type="button"
                className={
                  user.active
                    ? classes["button-delete"]
                    : classes["button-activate"]
                }
                onClick={user.active ? handleDelete : handleActivate}
              >
                {user.active ? "Borrar Usuario" : "Activar Usuario"}
              </button>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isEditMode ? "Guardar" : "Crear"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default UserForm;
