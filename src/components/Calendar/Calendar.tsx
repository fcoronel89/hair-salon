import { useCallback, useMemo } from "react";
import moment from "moment";
import { Calendar, View, ViewKey, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { addMinutesToDate, getCombinedDateTime } from "../../utils/helpers";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

import "./Calendar.scss";
import "moment/locale/es";
moment.locale("es");
import User from "../../models/user";
import { Professional } from "../../models/professional";
import { Shift } from "../../models/shift";
import { Service } from "../../models/service";

const localizer = momentLocalizer(moment);

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
};


const eventStyleGetter = (event: Event) => {
  let style = {
    backgroundColor: "#4e81ad", // Default background color
    borderColor: "#4e81ad", // Default border color
  };

  if (event.attended) {
    style = {
      backgroundColor: "green",
      borderColor: "darkgreen",
    };
  } else if (event.clientConfirmed && event.professionalConfirmed) {
    style = {
      backgroundColor: "#a7db23",
      borderColor: "#a7db23",
    };
  }

  return { style };
};

const getUserText = (userId: string, users: User[]) => {
  const user = users.find((user) => user._id === userId);
  return user ? `${user.firstName} ${user.lastName}` : "";
};

const getProfessionalText = (
  professionals: Professional[],
  professionalId: string
) => {
  const professional = professionals.find(
    (professional) => professional._id === professionalId
  );
  return professional
    ? `${professional.firstName} ${professional.lastName}`
    : "";
};

const getTitle = (
  professionals: Professional[],
  serviceId: string,
  professionalId: string,
  creatorId: string,
  users: User[],
  services: Service[]
) => {
  const professionalName = getProfessionalText(professionals, professionalId);
  const creatorName = getUserText(creatorId, users);
  const serviceObj = services.find((item) => item._id === serviceId);
  if (professionalName) {
    return `${serviceObj?.name} con ${professionalName} (Vendedor: ${creatorName})`;
  }

  return ""; // Handle the case where 'professional' is not found
};

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  attended: boolean | undefined;
  clientConfirmed: boolean;
  professionalConfirmed: boolean;
  allDay: boolean;
  owner: string;
}

const CalendarComponent = ({
  user,
  shifts,
  professionals,
  users,
  services,
}: {
  user: User;
  shifts: Shift[];
  professionals: Professional[];
  users: User[];
  services: Service[];
}) => {

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const userType = user && user.userType;

  const availableViews = Object.keys(Views)
    .map((k) => Views[k as ViewKey])
    .filter((view) => view !== Views.WORK_WEEK);

  const shiftsFiltered: Shift[] = shifts.filter(
    (shift) => userType !== "hairsalon" || (shift.clientConfirmed && shift.professionalConfirmed)
  )

  const { defaultDate, views, events } : { defaultDate: Date; views: View[]; events: Event[] } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: availableViews,
      events: shiftsFiltered.map((shift) => {
        const startDate = getCombinedDateTime(shift.date, shift.time);
        const endDate = addMinutesToDate(startDate, shift.duration);
        const event: Event = {
          id: shift._id,
          title: getTitle(
            professionals,
            shift.serviceId,
            shift.professionalId,
            shift.creatorId,
            users,
            services
          ),
          allDay: false,
          start: startDate,
          end: endDate,
          owner: shift.creatorId,
          attended: shift.attended,
          clientConfirmed: shift.clientConfirmed,
          professionalConfirmed: shift.professionalConfirmed,
        };

        return event;
      }),
    }),
    [shifts, professionals, users, userType, services, availableViews]
  );

  const handleSelectEvent = useCallback(
    (event: Event) => {
      const now = new Date();
      const isAdmin = userType === "admin";
      const isOwner = user._id === event.owner;
      const isFutureEvent = event.end > now;

      if (isAdmin || (isOwner && isFutureEvent)) {
        navigate(`/agenda/editar-turno/${event.id}`);
      }

      if (userType === "hairsalon" && !isFutureEvent && !event.attended) {
        navigate(`/agenda/asistio/${event.id}`);
      }
    },
    [navigate, user, userType]
  );
  return (
    <>
      <Outlet />
      <div>
        <Typography variant="h3" component="h1">
          Agenda de turnos
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          mb={5}
          mt={3}
          className="button-box"
        >
          {user.userType !== "hairsalon" && (
            <Link to="/agenda/crear-turno">
              <IconButton
                size="small"
                aria-label="add"
                color="primary"
                sx={{
                  backgroundColor: "secondary.main",
                  "&:hover": { backgroundColor: "secondary.dark" },
                }}
              >
                Nuevo turno
              </IconButton>
            </Link>
          )}
        </Box>

        <Calendar
          localizer={localizer}
          defaultDate={defaultDate}
          views={views}
          events={events}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          className={isDarkMode ? "dark" : "light"}
          messages={messages}
        />
      </div>
    </>
  );
};

export default CalendarComponent;
