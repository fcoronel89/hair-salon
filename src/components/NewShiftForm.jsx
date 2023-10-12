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
import { getYesterdayDate } from "../utils/helpers";

const durationData = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

const validationSchema = Yup.object({
  firstName: Yup.string()
    .max(50, "Maximo 50 Caracteres")
    .required("Ingresar Nombre"),
  lastName: Yup.string()
    .max(50, "Maximo 50 Caracteres")
    .required("Ingresar Apellido"),
  email: Yup.string()
    .email("Ingresa un Email valido")
    .required("Ingresar Email"),
  phone: Yup.number()
    .integer("Ingresar solo numeros")
    .moreThan(99999999, "Ingresar numero valido")
    .required("Ingresar Telefono"),
  shiftDate: Yup.date()
    .min(getYesterdayDate(), "La fecha no puede ser en el pasado")
    .required("Ingresar fecha del turno"),
  detail: Yup.string().required("Agrega un detalle del trabajo"),
  time: Yup.string()
    .required("Ingrese hora")
    .test("is-time-valid", "Formato hora invalido", (value) => {
      // Define your custom time validation logic here
      // For example, you can use regular expressions to validate time format
      const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(value);
    }),
  professional: Yup.string().required("Selecciona un profesional"),
});

const isProfessionalHaveService = (services, serviceSelected) => {
  const exist = services.some(item => item === serviceSelected);
  console.log("exist", exist);
  return exist;
}

const formatHairdressers = (hairDressers, serviceSelected) => {
  const userList = Object.entries(hairDressers).map(([id, hairDresser]) => ({
    id,
    birthDate: hairDresser.birthDate,
    firstName: hairDresser.firstName,
    lastName: hairDresser.lastName,
    phone: hairDresser.phone,
    serviceType: hairDresser.serviceType,
    image: hairDresser.image,
    isEnabled: isProfessionalHaveService(hairDresser.serviceType,serviceSelected)
  }));
  console.log("userList")
  return userList;
};

const NewShiftForm = () => {
  const navigate = useNavigate();
  const { hairDressers, user, services } = useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  console.log(formResponse, "formresponse");
  const submit = useSubmit();

  const getSubservices = (serviceValue) => {
    const service = services.find((item) => item.value === serviceValue);
    return (
      service &&
      service.subServices.map((service) => (
        <option key={service.value} value={service.value}>
          {service.value}
        </option>
      ))
    );
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      duration: "30",
      shiftDate: "",
      time: "",
      shiftCreator: user.userName,
      service: services && services[0].value,
      subService: services && services[0].subServices[0].value,
      detail: "",
      professional: "",
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

  
  const formattedHairDressers = formatHairdressers(hairDressers, formik.values.service);
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
                <li key={hairDresser.id} className={classes[hairDresser.isEnabled ? '': 'disabled'] }>
                  <label><input
                    type="radio"
                    name="professional"
                    value={hairDresser.phone}
                    checked={formik.values.professional === hairDresser.phone && hairDresser.isEnabled}
                    onChange={formik.handleChange}
                    disabled={!hairDresser.isEnabled}
                  />
                  <img alt={hairDresser.firstName} src={hairDresser.image} />{" "}
                  <p>{hairDresser.firstName}</p></label>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${classes["input-container"]} ${classes["cols"]}`}>
            <div
              className={`${classes["col"]} ${
                formik.touched.service && formik.errors.service
                  ? classes["invalid"]
                  : ""
              }`}
            >
              <label>Servicio *</label>
              <select
                className={classes.dropdown}
                name="service"
                value={formik.values.service}
                onChange={formik.handleChange}
              >
                {services &&
                  services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.value}
                    </option>
                  ))}
              </select>
            </div>
            <div
              className={`${classes["col"]} ${
                formik.touched.subService && formik.errors.subService
                  ? classes["invalid"]
                  : ""
              }`}
            >
              <label>Sub Servicio *</label>
              <select
                className={classes.dropdown}
                name="subService"
                value={formik.values.subService}
                onChange={formik.handleChange}
              >
                {services && getSubservices(formik.values.service)}
              </select>
            </div>
          </div>
          <div className={`${classes["input-container"]} ${classes["cols"]}`}>
            <div
              className={`${classes["col"]} ${
                formik.touched.shiftDate && formik.errors.shiftDate
                  ? classes["invalid"]
                  : ""
              }`}
            >
              <label>Fecha *</label>
              <input
                type="date"
                id="shiftDate"
                name="shiftDate"
                value={formik.values.shiftDate}
                onChange={formik.handleChange}
              />
              {formik.touched.shiftDate && formik.errors.shiftDate ? (
                <p>{formik.errors.shiftDate}</p>
              ) : null}
            </div>
            <div className={`${classes["col"]} ${classes["col4"]}`}>
              <div
                className={`${classes["col"]} ${
                  formik.touched.time && formik.errors.time
                    ? classes["invalid"]
                    : ""
                }`}
              >
                <label>Hora *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.time}
                />
                {formik.touched.time && formik.errors.time ? (
                  <p>{formik.errors.time}</p>
                ) : null}
              </div>
              <div className={classes["col"]}>
                <label>Duracion(min) *</label>
                <select
                  name="duration"
                  id="duration"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                >
                  {durationData.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div
            className={`${classes["input-container"]} ${
              formik.touched.detail && formik.errors.detail
                ? classes["invalid"]
                : ""
            }`}
          >
            <label>Detalle *</label>
            <input
              type="text"
              id="detail"
              name="detail"
              value={formik.values.detail}
              onChange={formik.handleChange}
            />
            {formik.touched.detail && formik.errors.detail ? (
              <p>{formik.errors.detail}</p>
            ) : null}
          </div>
        </div>
        <div>
          <h2>Datos del cliente</h2>
          <div className={`${classes["input-container"]} ${classes["cols"]}`}>
            <div
              className={`${classes["col"]} ${
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
              className={`${classes["col"]} ${
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
          </div>
          <div className={`${classes["input-container"]} ${classes["cols"]}`}>
            <div
              className={`${classes["col"]} ${
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
              className={`${classes["col"]} ${
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
          </div>
          <div className={classes.actions}>
            {formResponse && <p>{formResponse.message}</p>}
            {isSubmitting && <p>Enviando...</p>}
            <input
              type="hidden"
              name="shiftCreator"
              value={formik.values.shiftCreator}
            />
            <button type="submit">Agendar turno</button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewShiftForm;
