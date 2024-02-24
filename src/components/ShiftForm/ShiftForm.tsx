import {
  useActionData,
} from "react-router-dom";
import { useFormik } from "formik";
import { object } from "yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { addMinutesToDate, getCombinedDateTime } from "../../utils/helpers";
import {
  ConfirmationType,
  confirmShift,
  createClient,
  deleteShift,
  getClientbyPhone,
  updateShift,
} from "../../utils/http";
import {
  isEmail,
  isNumber,
  isRequired,
  isTime,
  isFutureDate,
} from "../../utils/validation";
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
import InputContainer from "../UI/InputContainer";
import "./ShiftForm.scss";
import { Service } from "../../models/service";
import { Shift } from "../../models/shift";
import { Professional } from "../../models/professional";
import User from "../../models/user";
import { Client } from "../../models/client";

const neighbourhoods = [
  {
    id: "devoto",
    name: "Devoto",
  },
  {
    id: "ballester",
    name: "Ballester",
  },
  {
    id: "villaadelina",
    name: "Villa Adelina",
  },
];

const durationData = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

const validationSchema = object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  email: isEmail("Ingresar Email"),
  phone: isNumber("Ingresar Telefono"),
  date: isFutureDate("La fecha no puede ser en el pasado"),
  time: isTime("Ingrese hora"),
  professionalId: isRequired("Selecciona un profesional"),
});

const isProfessionalHaveService = (
  services: string[],
  serviceSelected: string
) => {
  return Boolean(services.find((service) => service === serviceSelected));
};

const isAvailableForHairSalon = (
  hairSalonsByProfessional: string[],
  hairSalonSelected: string
) => {
  return Boolean(
    hairSalonsByProfessional.find(
      (hairSalon) => hairSalon === hairSalonSelected
    )
  );
};

const getShiftByProfessional = (shifts: Shift[], professionalId: string) => {
  return shifts.filter((shift) => shift.professionalId === professionalId);
};

interface FormatedProfessionals extends Professional {
  isEnabled: boolean;
  shifts: Shift[];
}

const formatProfessionals = (
  professionals: Professional[],
  serviceSelected: string,
  shifts: Shift[]
): FormatedProfessionals[] => {
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

const isAvailable = (
  startDate: Date,
  endDate: Date,
  shiftsByProfessional: Shift[]
) => {
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

function canDeleteOrEdit(user: User, shift: Shift) {
  return (
    user.userType === "admin" ||
    (user.userType === "seller" && user._id === shift.creatorId)
  );
}

const getDefaultValues = (shift: Shift, hairSalonUsers: User[]) => ({
  ...shift,
  hairsalonId: shift.hairsalonId || hairSalonUsers[0]._id,
  neighbourhood: shift.neighbourhood || neighbourhoods[0].id,
});

const ShiftForm = ({
  professionals,
  services,
  shifts,
  user,
  hairSalonUsers,
  shift,
  client,
  shouldResetForm,
  onClose,
}: {
  professionals: Professional[];
  services: Service[];
  shifts: Shift[];
  user: User;
  hairSalonUsers: User[];
  shift: Shift | null;
  client: Client | null;
  shouldResetForm: boolean;
  onClose: () => void;
}) => {
  const [error, setError] = useState("");
  const formResponse = useActionData() as { message: string };
  const dialogElement = document.getElementById("modal-dialog");
  const isAllowToDeleteAndEdit = useMemo(
    () => canDeleteOrEdit(user, shift),
    [user, shift]
  );
  console.log("ShiftForm");
  const servicesKeys: Record<string, Service["subServices"]> = useMemo(
    () =>
      services.reduce((acc, service) => {
        if (!acc[service._id]) acc[service._id] = [];
        acc[service._id] = service.subServices;
        return acc;
      }, {} as Record<string, Service["subServices"]>),
    [services]
  );
  const defaultService = services[0];

  const getSubservices = (serviceValue: string) => {
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

  const getHairSalonsByNeighbourhood = (
    neighbourhood: string,
    hairSalonUserSelected: string
  ) => {
    const hairSalonsFiltered =
      hairSalonUsers &&
      hairSalonUsers.filter((user) => user.neighbourhood === neighbourhood);
    hairSalonUserSelected =
      hairSalonsFiltered && (hairSalonsFiltered[0]._id as string);
    return (
      hairSalonsFiltered &&
      hairSalonsFiltered.map((hairSalon) => (
        <MenuItem key={hairSalon._id} value={hairSalon._id}>
          {hairSalon.firstName} {hairSalon.lastName}
        </MenuItem>
      ))
    );
  };

  const defaultShiftValue = useMemo(
    () => getDefaultValues(shift, hairSalonUsers),
    [shift, hairSalonUsers]
  );

  const formik = useFormik({
    initialValues: {
      ...defaultShiftValue,
      ...client,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      console.log(values);
      try {
        const client = await getClientbyPhone(values.phone);
        let clientId = "";
        const {
          firstName,
          lastName,
          email,
          phone,
          _id: shiftId,
          ...shiftData
        } = values;
        if (!client) {
          const newClientData = {
            firstName,
            lastName,
            email,
            phone,
          };
          const newClient = await createClient(newClientData);
          clientId = newClient._id as string;
        } else {
          clientId = client._id as string;
        }

        await updateShift(
          {
            ...shiftData,
            clientId,
          },
          shift?._id as string
        );
        onClose();
      } catch (error) {
        setError("Error al crear el turno");
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    serviceId,
    date,
    time,
    duration,
    professionalId,
    neighbourhood,
    hairsalonId,
  } = formik.values;

  let formattedProfessionals = formatProfessionals(
    professionals,
    formik.values.serviceId,
    shifts
  );
  const [professionalsUpdated, setProfessionalsUpdated] = useState(
    formattedProfessionals
  );

  const professionalsUpdatedRef = useRef<FormatedProfessionals[]>();
  professionalsUpdatedRef.current = professionalsUpdated;

  useEffect(() => {
    if (professionalsUpdatedRef.current) {
      const professionals = professionalsUpdatedRef.current.map(
        (professionalIterate: FormatedProfessionals) => {
          const isHasService = isProfessionalHaveService(
            professionalIterate.serviceType,
            serviceId
          );
          const isInHairSalon = isAvailableForHairSalon(
            professionalIterate.hairSalons,
            hairsalonId
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
              (isHasService && isInHairSalon && isProfessionalAvailable) ||
              professionalIterate._id === professionalId,
          };
        }
      );
      setProfessionalsUpdated(professionals);
    }
  }, [serviceId, date, time, duration, professionalId, hairsalonId]);

  useEffect(() => {
    formik.values.hairsalonId = hairSalonUsers.find(
      (hairSalon) => hairSalon.neighbourhood === neighbourhood
    )?._id as string;
  }, [neighbourhood]);

  useEffect(() => {
    if (shouldResetForm) {
      formik.resetForm();
    }
  }, [shouldResetForm]);

  const handleDeleteShift = async () => {
    await deleteShift(shift._id);
    onClose();
  };

  const handleConfirmProfessional = async (
    confirmationType: ConfirmationType
  ) => {
    await confirmShift(shift._id, confirmationType);
    onClose();
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Typography variant="h4" component="h2" mb={3}>
        Datos del turno
      </Typography>
      <InputContainer
        cssClasses={
          formik.touched.professionalId && formik.errors.professionalId
            ? "invalid"
            : ""
        }
      >
        <Typography variant="h6" component="h6" mb={2} mt={2}>
          Profesional *
        </Typography>
        <Grid container spacing={3} className="professionals-list">
          {professionalsUpdatedRef.current &&
            professionalsUpdatedRef.current.map(
              (professional: FormatedProfessionals) => (
                <Grid item key={professional._id}>
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
                      src={professional.image.toString()}
                      sx={{ width: 60, height: 60 }}
                    />{" "}
                    <span>{professional.firstName}</span>
                  </label>
                </Grid>
              )
            )}
        </Grid>
        {formik.touched.professionalId && formik.errors.professionalId ? (
          <p>{formik.errors.professionalId}</p>
        ) : null}
      </InputContainer>
      <Grid container spacing={1} columnSpacing={3} rowSpacing={0}>
        <Grid item xs={6}>
          <InputContainer
            cssClasses={
              formik.touched.neighbourhood && formik.errors.neighbourhood
                ? "invalid"
                : ""
            }
          >
            <FormControl variant="filled">
              <InputLabel id="neighbourhood">Zona *</InputLabel>
              <Select
                labelId="neighbourhood"
                name="neighbourhood"
                value={formik.values.neighbourhood}
                onChange={formik.handleChange}
                error={
                  formik.touched.neighbourhood && formik.errors.neighbourhood
                    ? true
                    : false
                }
                color="primary"
                MenuProps={{
                  container: dialogElement,
                }}
              >
                {neighbourhoods &&
                  neighbourhoods.map((neighbourhood) => (
                    <MenuItem key={neighbourhood.id} value={neighbourhood.id}>
                      {neighbourhood.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </InputContainer>
        </Grid>
        <Grid item xs={6}>
          <InputContainer
            cssClasses={
              formik.touched.hairsalonId && formik.errors.hairsalonId
                ? "invalid"
                : ""
            }
          >
            <FormControl variant="filled">
              <InputLabel id="hairsalonId">Peluquería *</InputLabel>
              <Select
                labelId="hairsalonId"
                name="hairsalonId"
                value={formik.values.hairsalonId}
                onChange={formik.handleChange}
                error={
                  formik.touched.hairsalonId && formik.errors.hairsalonId
                    ? true
                    : false
                }
                color="primary"
                MenuProps={{
                  container: dialogElement,
                }}
              >
                {getHairSalonsByNeighbourhood(
                  formik.values.neighbourhood,
                  formik.values.hairsalonId
                )}
              </Select>
            </FormControl>
          </InputContainer>
        </Grid>
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
                MenuProps={{
                  container: dialogElement,
                }}
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
                name="subServiceId"
                value={formik.values.subServiceId}
                onChange={formik.handleChange}
                error={
                  formik.touched.subServiceId && formik.errors.subServiceId
                    ? true
                    : false
                }
                color="primary"
                MenuProps={{
                  container: dialogElement,
                }}
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
              <p>{String(formik.errors.date)}</p>
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
              error={formik.touched.time && formik.errors.time ? true : false}
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
                color="primary"
                MenuProps={{
                  container: dialogElement,
                }}
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
              label="Detalle"
              error={
                formik.touched.detail && formik.errors.detail ? true : false
              }
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
              formik.touched.lastName && formik.errors.lastName ? "invalid" : ""
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
                formik.touched.lastName && formik.errors.lastName ? true : false
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
              error={formik.touched.email && formik.errors.email ? true : false}
            />
            {formik.touched.email && formik.errors.email ? (
              <p>{formik.errors.email}</p>
            ) : null}
          </InputContainer>
        </Grid>
        <Grid item xs={6}>
          <InputContainer
            cssClasses={
              formik.touched.phone && formik.errors.phone ? "invalid" : ""
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
              error={formik.touched.phone && formik.errors.phone ? true : false}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p>{formik.errors.phone}</p>
            ) : null}
          </InputContainer>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={2}
        mt={2}
      >
        {formResponse && <p>{formResponse.message}</p>}
        <input type="hidden" name="creatorId" value={formik.values.creatorId} />
        <input
          type="hidden"
          name="clientConfirmed"
          value={formik.values.clientConfirmed ? "true" : "false"}
        />
        <input
          type="hidden"
          name="professionalConfirmed"
          value={formik.values.professionalConfirmed ? "true" : "false"}
        />
        {shift?.professionalConfirmed && <span>Profesional confirmó ✔</span>}
        {shift?.clientConfirmed && <span>Cliente confirmó ✔</span>}
        {isAllowToDeleteAndEdit && (
          <>
            <Button
              onClick={handleDeleteShift}
              disabled={formik.isSubmitting}
              variant="contained"
              color="error"
            >
              Borrar turno
            </Button>
            {!shift.professionalConfirmed ? (
              <Button
                onClick={() => handleConfirmProfessional("professional")}
                disabled={formik.isSubmitting}
                variant="contained"
                color="success"
              >
                Confirmar Peluquero
              </Button>
            ) : (
              ""
            )}
            {!shift.clientConfirmed ? (
              <Button
                onClick={() => handleConfirmProfessional("client")}
                disabled={formik.isSubmitting}
                variant="contained"
                color="success"
              >
                Confirmar Cliente
              </Button>
            ) : (
              ""
            )}
          </>
        )}
        {error ? <p className="error">{error}</p> : null}
        {formik.isSubmitting ? <p>Guardando...</p> : null}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={formik.isSubmitting}
        >
          Guardar turno
        </Button>
      </Box>
    </form>
  );
};

export default ShiftForm;
