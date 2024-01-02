import Modal from "./UI/Modal";
import classes from "./ShiftForm.module.css";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";
import { object } from "yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { addMinutesToDate, getCombinedDateTime } from "../utils/helpers";
import { deleteShift } from "../utils/http";
import {
  isEmail,
  isNumber,
  isRequired,
  isTime,
  isFutureDate,
} from "../utils/validation";
import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  TextField,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import InputContainer from "./UI/InputContainer";
import './ShiftForm.scss';

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

const getDefaultValues = (shift, isEditMode, user, defaultService) =>
  isEditMode
    ? shift
    : {
        duration: 30,
        time: "",
        date: "",
        creatorId: user._id,
        serviceId: defaultService._id,
        subServiceId: defaultService.subServices[0]._id,
        detail: "",
        professionalId: "",
        clientConfirmed: false,
        professionalConfirmed: false,
      };

const ShiftForm = ({ professionals, services, shifts, user }) => {
  const navigate = useNavigate();
  const { shift, client } = useLoaderData();
  const navigation = useNavigation();
  const formResponse = useActionData();
  const isEditMode = !!shift;
  const submit = useSubmit();
  const dialogElement = document.getElementById("modal-dialog");
  const isAllowToDeleteAndEdit = useMemo(
    () => canDeleteOrEdit(user, shift, isEditMode),
    [user, shift, isEditMode]
  );

  const servicesKeys = useMemo(
    () =>
      services.reduce((acc, service) => {
        acc[service._id] = service.subServices;
        return acc;
      }, {}),
    [services]
  );
  const defaultService = services[0];

  const getSubservices = (serviceValue) => {
    const service = servicesKeys[serviceValue];
    formik.values.subServiceId =
      formik.values.subServiceId || defaultService._id;
    return (
      service &&
      service.map((subSservice) => (
        <MenuItem key={subSservice._id} value={subSservice._id}>
          {subSservice.name}
        </MenuItem>
      ))
    );
  };

  const defaultShiftValue = useMemo(
    () => getDefaultValues(shift, isEditMode, user, defaultService),
    [shift, isEditMode, user, defaultService]
  );

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
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h4" component="h2" mb={3}>
          Datos del turno
        </Typography>
        <div
          className={`${classes["professionals-container"]} ${
            formik.touched.professional && formik.errors.professional
              ? classes["invalid"]
              : ""
          }`}
        >
          <Typography variant="h6" component="p" mb={2} mt={2}>Profesional *</Typography>
          <Grid container spacing={3} className="professionals-list">
            {professionalsUpdatedRef.current &&
              professionalsUpdatedRef.current.map((professional) => (
                <Grid item
                  key={professional._id}
                >
                  <label className={professional.isEnabled ? "" : "disabled"}>
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
                    <Avatar
                      alt={professional.firstName}
                      src={professional.image}
                      sx={{ width: 60, height: 60 }}
                    />{" "}
                    <p>{professional.firstName}</p>
                  </label>
                </Grid>
              ))}
          </Grid>
          {formik.touched.professionalId && formik.errors.professionalId ? (
            <p>{formik.errors.professionalId}</p>
          ) : null}
        </div>
        <Grid container spacing={1} columnSpacing={3} rowSpacing={0}>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.serviceId && formik.errors.serviceId
                  ? "invalid"
                  : ""
              }
            >
              <FormControl variant="filled">
                <InputLabel id="serviceId">Servicio *</InputLabel>
                <Select
                  labelId="serviceId"
                  name="serviceId"
                  value={formik.values.serviceId}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.serviceId && formik.errors.serviceId
                      ? true
                      : false
                  }
                  color="primary"
                  MenuProps={{ getContentAnchorEl: null, container: dialogElement }}
                >
                  {services &&
                    services.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </InputContainer>
          </Grid>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.subServiceId && formik.errors.subServiceId
                  ? "invalid"
                  : ""
              }
            >
              <FormControl variant="filled">
                <InputLabel id="subServiceId">Sub Servicio *</InputLabel>
                <Select
                  labelId="subServiceId"
                  className={classes.dropdown}
                  name="subServiceId"
                  value={formik.values.subServiceId}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subServiceId && formik.errors.subServiceId
                      ? true
                      : false
                  }
                  color="primary"
                  MenuProps={{ getContentAnchorEl: null, container: dialogElement }}
                >
                  {services && getSubservices(formik.values.serviceId)}
                </Select>
              </FormControl>
            </InputContainer>
          </Grid>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.date && formik.errors.date ? "invalid" : ""
              }
            >
              <TextField
                type="date"
                id="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                variant="filled"
                label="Fecha *"
                error={formik.touched.date && formik.errors.date ? true : false}
              />
              {formik.touched.date && formik.errors.date ? (
                <p>{formik.errors.date}</p>
              ) : null}
            </InputContainer>
          </Grid>
          <Grid item xs={3}>
            <InputContainer
              cssClasses={
                formik.touched.time && formik.errors.time ? "invalid" : ""
              }
            >
              <TextField
                type="time"
                id="time"
                name="time"
                onChange={formik.handleChange}
                value={formik.values.time}
                variant="filled"
                label="Hora *"
                error={formik.touched.time && formik.errors.time}
              />
              {formik.touched.time && formik.errors.time ? (
                <p>{formik.errors.time}</p>
              ) : null}
            </InputContainer>
          </Grid>
          <Grid item xs={3}>
            <InputContainer>
              <FormControl variant="filled">
                <InputLabel id="duration">Duración(min) *</InputLabel>
                <Select
                  labelId="duration"
                  name="duration"
                  id="duration"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  error={formik.touched.duration && formik.errors.duration}
                  color="primary"
                  MenuProps={{ getContentAnchorEl: null, container: dialogElement }}
                >
                  {durationData.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </InputContainer>
          </Grid>
          <Grid item xs={12}>
            <InputContainer
              cssClasses={
                formik.touched.detail && formik.errors.detail ? "invalid" : ""
              }
            >
              <TextField
                type="text"
                id="detail"
                name="detail"
                value={formik.values.detail}
                onChange={formik.handleChange}
                variant="filled"
                label="Detalle *"
                error={formik.touched.detail && formik.errors.detail}
              />
              {formik.touched.detail && formik.errors.detail ? (
                <p>{formik.errors.detail}</p>
              ) : null}
            </InputContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" mb={2}>
              Datos del Cliente
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.firstName && formik.errors.firstName
                  ? "invalid"
                  : ""
              }
            >
              <TextField
                type="text"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                variant="filled"
                label="Nombre *"
                error={
                  formik.touched.firstName && formik.errors.firstName
                    ? true
                    : false
                }
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <p>{formik.errors.firstName}</p>
              ) : null}
            </InputContainer>
          </Grid>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.lastName && formik.errors.lastName
                  ? "invalid"
                  : ""
              }
            >
              <TextField
                type="text"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                variant="filled"
                label="Apellido *"
                error={
                  formik.touched.lastName && formik.errors.lastName
                    ? true
                    : false
                }
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <p>{formik.errors.lastName}</p>
              ) : null}
            </InputContainer>
          </Grid>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.email && formik.errors.email ? "invalid" : ""
              }
            >
              <TextField
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                variant="filled"
                label="Email *"
                error={
                  formik.touched.email && formik.errors.email ? true : false
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <p>{formik.errors.email}</p>
              ) : null}
            </InputContainer>
          </Grid>
          <Grid item xs={6}>
            <InputContainer
              cssClasses={
                formik.touched.phone && formik.errors.phone
                  ? "invalid"
                  : ""
              }
            >
              <TextField
                type="tel"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                variant="filled"
                label="Telefono *"
                error={
                  formik.touched.phone && formik.errors.phone ? true : false
                }
              />
              {formik.touched.phone && formik.errors.phone ? (
                <p>{formik.errors.phone}</p>
              ) : null}
            </InputContainer>
          </Grid>
        </Grid>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
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
              <Button
                onClick={handleDeleteShift}
                disabled={navigation.state === "submitting"}
                variant="contained"
                color="error"
              >
                Borrar turno
              </Button>
            )}
            <Button type="submit" variant="contained" color="secondary" disabled={navigation.state === "submitting"}>
              Agendar turno
            </Button>
          </Box>
      </form>
    </Modal>
  );
};

export default ShiftForm;
