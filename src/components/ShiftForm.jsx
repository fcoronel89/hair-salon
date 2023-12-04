import Modal from "./UI/Modal";
import classes from "./ShiftForm.module.css";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";
import { object } from "yup";
import { useEffect, useRef, useState } from "react";
import { addMinutesToDate, getCombinedDateTime } from "../utils/helpers";
import { deleteShift } from "../utils/http";
import {
  isEmail,
  isNumber,
  isRequired,
  isTime,
  isFutureDate,
} from "../utils/validation";

const durationData = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

const validationSchema = object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  email: isEmail("Ingresar Email"),
  phone: isNumber("Ingresar Telefono"),
  date: isFutureDate("La fecha no puede ser en el pasado"),
  detail: isRequired("Agrega un detalle del trabajo"),
  time: isTime("Ingrese hora"),
  professionalId: isRequired("Selecciona un profesional"),
});

const isProfessionalHaveService = (services, serviceSelected) => {
  return services.find((service) => service === serviceSelected);
};

const getShiftByProfessional = (shifts, professionalId) => {
  return shifts.filter((shift) => shift.professionalId === professionalId);
};

const formatProfessionals = (professionals, serviceSelected, shifts) => {
  return professionals.map((professional) => {
    const mapProfessional = {
      ...professional,
      isEnabled: isProfessionalHaveService(
        professional.serviceType,
        serviceSelected
      ),
      shifts: getShiftByProfessional(shifts, professional._id),
    };

    return mapProfessional;
  });
};

const isAvailable = (startDate, endDate, shiftsByProfessional) => {
  if (!startDate || !endDate) {
    return true;
  }
  const shiftSameTime = shiftsByProfessional.some((shift) => {
    const startShift = getCombinedDateTime(shift.date, shift.time);
    const endShift = addMinutesToDate(startShift, shift.duration);
    return (
      (endDate >= startShift && endDate <= endShift) ||
      (startDate >= startShift && startDate <= endShift)
    );
  });
  return !shiftSameTime;
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
  const { professionals, user, services, shift, client, shifts } = useLoaderData();
  const navigation = useNavigation();
  const formResponse = useActionData();
  const isEditMode = !!shift;
  const isAllowToDeleteAndEdit = canDeleteOrEdit(user, shift, isEditMode);
  const submit = useSubmit();

  const getSubservices = (serviceValue) => {
    const service = services.find((item) => item._id === serviceValue);
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
          let isProfessionalAvailable = true;
          if (date && time && duration) {
            const formikDate = new Date(date);
            const startDate = getCombinedDateTime(formikDate, time);
            const endDate = addMinutesToDate(startDate, duration);
            isProfessionalAvailable = isAvailable(
              startDate,
              endDate,
              professionalIterate.shifts
            );
          }
          return {
            ...professionalIterate,
            isEnabled:
              (isHasService && isProfessionalAvailable) ||
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
            {navigation.state === "submitting" && <p>Enviando...</p>}
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
                disabled={navigation.state === "submitting"}
              >
                Borrar turno
              </button>
            )}
            <button type="submit" disabled={navigation.state === "submitting"}>
              Agendar turno
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ShiftForm;
