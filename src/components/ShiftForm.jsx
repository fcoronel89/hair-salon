import Modal from "./UI/Modal";
import classes from "./ShiftForm.module.css";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import {
  addMinutesToDate,
  getCombinedDateTime,
  getYesterdayDate,
} from "../utils/helpers";
import { deleteShift } from "../utils/http";

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
  date: Yup.date()
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
  professionalId: Yup.string().required("Selecciona un profesional"),
});

const isProfessionalHaveService = (services, serviceSelected) => {
  const exist = services.some((item) => item === serviceSelected);
  return exist;
};

const getShiftByProfessional = (shifts, professionalId) => {
  const shiftsByProfessional = shifts.filter(
    (shift) => shift.professionalId === professionalId
  );

  return shiftsByProfessional;
};

const formatProfessionals = (professionals, serviceSelected, shifts) => {
  const professionalList = professionals.map((professional) => ({
    ...professional,
    isEnabled: isProfessionalHaveService(
      professional.serviceType,
      serviceSelected
    ),
    shifts: getShiftByProfessional(shifts, professional._id),
  }));

  return professionalList;
};

const isAvailable = (startDate, endDate, shiftsByProfessional) => {
  const isFound = shiftsByProfessional.some((shift) => {
    const startShift = getCombinedDateTime(shift.date, shift.time);
    const endShift = addMinutesToDate(startShift, shift.duration);
    return (
      (endDate >= startShift && endDate <= endShift) ||
      (startDate >= startShift && startDate <= endShift)
    );
  });
  return !isFound;
};

function canDeleteOrEdit(user, shift, isEditMode) {
  return (
    isEditMode &&
    (user.userType === "admin" ||
      (user.userType === "seller" && user._id === shift.creatorId))
  );
}

const ShiftForm = () => {
  const navigate = useNavigate();
  const { shifts } = useRouteLoaderData("calendar");
  const { professionals, user, services, shift, client } = useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formResponse = useActionData();
  const isEditMode = !!shift;
  const isAllowToDeleteAndEdit = canDeleteOrEdit(user, shift, isEditMode);
  console.log("isEditMode", isEditMode);
  const submit = useSubmit();

  const getSubservices = (serviceValue) => {
    const service = services.find((item) => {
    console.log("item", item._id, serviceValue)
    return item._id === serviceValue }
    );
    console.log("service", service);
    formik.values.subServiceId =
      formik.values.subServiceId || service.subServices[0]._id;
    return (
      service &&
      service.subServices.map((subSservice) => (
        <option key={subSservice._id} value={subSservice._id}>
          {subSservice.name}
        </option>
      ))
    );
  };


  const defaultShiftValue = shift || {
    duration: 30,
    time: "",
    date: "",
    creatorId: user._id,
    serviceId: services[0]._id,
    subServiceId: services[0].subServices[0]._id,
    detail: "",
    professionalId: "",
    clientConfirmed: false,
    professionalConfirmed: false,
  };


  const defaultClientValue = client || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  const formik = useFormik({
    initialValues: {
      ...defaultShiftValue,
      ...defaultClientValue,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      submit(values, {
        action: isEditMode
          ? "/agenda/editar-turno/" + shift._id
          : "/agenda/crear-turno",
        method: isEditMode ? "PUT" : "POST",
      });
    },
  });

  const { serviceId, date, time, duration, professional } = formik.values;

  let formattedProfessionals = formatProfessionals(
    professionals,
    formik.values.serviceId,
    shifts
  );
  const [professionalsUpdated, setProfessionalsUpdated] = useState(
    formattedProfessionals
  );

  const professionalsUpdatedRef = useRef();
  professionalsUpdatedRef.current = professionalsUpdated;

  useEffect(() => {
    if (professionalsUpdatedRef.current) {
      const professionals = professionalsUpdatedRef.current.map(
        (professionalIterate) => {
          const isHasService = isProfessionalHaveService(
            professionalIterate.serviceType,
            serviceId
          );
          const startDate = getCombinedDateTime(date, time);
          const endDate = addMinutesToDate(startDate, duration);
          console.log(
            "professional.id === professional",
            professionalIterate._id,
            professional
          );
          return {
            ...professionalIterate,
            isEnabled:
              (isHasService &&
                isAvailable(startDate, endDate, professionalIterate.shifts)) ||
              (isEditMode && professionalIterate._id === professional),
          };
        }
      );
      setProfessionalsUpdated(professionals);
    }
    console.log("useEffect");
  }, [serviceId, date, time, duration, professional, isEditMode]);

  const handleDeleteShift = async () => {
    await deleteShift(shift._id);
    navigate("../");
  };

  return (
    <Modal
      onClose={() => {
        navigate("../");
      }}
    >
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <div>
          <h2>Datos del turno</h2>
          <div
            className={`${classes["professionals-container"]} ${
              formik.touched.professional && formik.errors.professional
                ? classes["invalid"]
                : ""
            }`}
          >
            <label>Profesional *</label>
            <ul className={classes["professionals-list"]}>
              {professionalsUpdatedRef.current &&
                professionalsUpdatedRef.current.map((professional) => (
                  <li
                    key={professional._id}
                    className={
                      classes[professional.isEnabled ? "" : "disabled"]
                    }
                  >
                    <label>
                      <input
                        type="radio"
                        name="professionalId"
                        value={professional._id}
                        checked={
                          formik.values.professionalId === professional._id &&
                          professional.isEnabled
                        }
                        onChange={formik.handleChange}
                        disabled={!professional.isEnabled}
                      />
                      <img
                        alt={professional.firstName}
                        src={professional.image}
                      />{" "}
                      <p>{professional.firstName}</p>
                    </label>
                  </li>
                ))}
            </ul>
            {formik.touched.professionalId && formik.errors.professionalId ? (
              <p>{formik.errors.professionalId}</p>
            ) : null}
          </div>
          <div className={`${classes["input-container"]} ${classes["cols"]}`}>
            <div
              className={`${classes["col"]} ${
                formik.touched.serviceId && formik.errors.serviceId
                  ? classes["invalid"]
                  : ""
              }`}
            >
              <label>Servicio *</label>
              <select
                className={classes.dropdown}
                name="serviceId"
                value={formik.values.serviceId}
                onChange={formik.handleChange}
              >
                {services &&
                  services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
              </select>
            </div>
            <div
              className={`${classes["col"]} ${
                formik.touched.subServiceId && formik.errors.subServiceId
                  ? classes["invalid"]
                  : ""
              }`}
            >
              <label>Sub Servicio *</label>
              <select
                className={classes.dropdown}
                name="subServiceId"
                value={formik.values.subServiceId}
                onChange={formik.handleChange}
              >
                {services && getSubservices(formik.values.serviceId)}
              </select>
            </div>
          </div>
          <div className={`${classes["input-container"]} ${classes["cols"]}`}>
            <div
              className={`${classes["col"]} ${
                formik.touched.date && formik.errors.date
                  ? classes["invalid"]
                  : ""
              }`}
            >
              <label>Fecha *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
              />
              {formik.touched.date && formik.errors.date ? (
                <p>{formik.errors.date}</p>
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
              name="creatorId"
              value={formik.values.creatorId}
            />
            <input
              type="hidden"
              name="clientConfirmed"
              value={formik.values.clientConfirmed}
            />
            <input
              type="hidden"
              name="professionalConfirmed"
              value={formik.values.professionalConfirmed}
            />
            {shift?.professionalConfirmed && (
              <span>Profesional confirmó ✔</span>
            )}
            {shift?.clientConfirmed && <span>Cliente confirmó ✔</span>}
            {isAllowToDeleteAndEdit && (
              <button
                type="button"
                className={classes["button-delete"]}
                onClick={handleDeleteShift}
                disabled={isSubmitting}
              >
                Borrar turno
              </button>
            )}
            <button type="submit" disabled={isSubmitting}>
              Agendar turno
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ShiftForm;
