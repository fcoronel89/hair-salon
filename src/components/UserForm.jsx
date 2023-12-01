import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import classes from "./UserForm.module.css";
import { useFormik } from "formik";
import { object } from "yup";

import { isRequired, isNumber, isDate, isDNI } from "../utils/validation";
import { updateUser } from "../utils/http";
import { apiUrl, getCombinedDateTime } from "../utils/helpers";

const validationSchema = object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  phone: isNumber("Ingresar Telefono"),
  dni: isDNI("Ingresar DNI"),
  birthDate: isDate("La fecha no puede ser en el futuro"),
});

const UserForm = (props) => {
  const navigate = useNavigate();
  const formResponse = useActionData();
  const { user, adminEditing } = props;
  const isEditMode = user && user.firstName ? true : false;
  const submit = useSubmit();
  const navigation = useNavigation();

  if (isEditMode) {
    user.birthDate = getCombinedDateTime(user.birthDate, "0:00")
      .toISOString()
      .split("T")[0];
  }

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

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      submit(
        { ...values, id: user?._id, googleId: user?.googleId },
        {
          action: "/crear-usuario",
          method: "PUT",
        }
      );
    },
  });

  const handleUpdateStatus = async (activeStatus) => {
    const response = await updateUser(user?._id, {
      ...user,
      active: activeStatus,
    });

    if (response) {
      navigate("/usuarios");
    }
  };

  const handleDelete = () => handleUpdateStatus(false);
  const handleActivate = () => handleUpdateStatus(true);

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
            {navigation.state === "submitting" && <p>Enviando...</p>}
            {isEditMode && adminEditing && (
              <button
                type="button"
                className={
                  user.active
                    ? classes["button-delete"]
                    : classes["button-activate"]
                }
                onClick={user.active ? handleDelete : handleActivate}
              >
                {user.active ? "Desactivar Usuario" : "Activar Usuario"}
              </button>
            )}
            <button type="submit" disabled={navigation.state === "submitting"}>
              {isEditMode ? "Guardar" : "Crear"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default UserForm;
