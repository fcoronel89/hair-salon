import { useActionData, useSubmit } from "react-router-dom";
import classes from "./LoginForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

const validationSchema = Yup.object({
  userName: Yup.string().required("Ingresar nombre de usuario"),
  password: Yup.string().required("Ingresar contraseña"),
});

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  const submit = useSubmit();

  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      submit(values, {
        action: "/login",
        method: "POST",
      });
    },
  });
  return (
    <section>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <h2>Ingresar</h2>
        <div
          className={`${classes["input-container"]} ${
            formik.touched.userName && formik.errors.userName
              ? classes["invalid"]
              : ""
          }`}
        >
          <label>Usuario</label>
          <input type="text" id="userName" name="userName" value={formik.values.userName}
          onChange={formik.handleChange} />
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
          <label>Contraseña</label>
          <input type="password" id="password" name="password" value={formik.values.password}
          onChange={formik.handleChange} />
          {formik.touched.password && formik.errors.password ? (
            <p>{formik.errors.password}</p>
          ) : null}
        </div>
        <div className={classes.actions}>
          {formResponse && <p>{formResponse.message}</p>}
          {isSubmitting && <p>Enviando...</p>}
          <button type="submit">Ingresar</button>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
