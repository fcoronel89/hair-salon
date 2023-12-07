import { useCallback, useMemo } from "react";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "./Calendar.module.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { addMinutesToDate, getCombinedDateTime } from "../utils/helpers";

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
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

const getUserText = (userId, users) => {
  const user = users.find((user) => user._id === userId);
  return user ? `${user.firstName} ${user.lastName}` : "";
};

const getProfessionalText = (professionals, professionalId) => {
  const professional = professionals.find(
    (professional) => professional._id === professionalId
  );
  return professional
    ? `${professional.firstName} ${professional.lastName}`
    : "";
};

const getTitle = (
  professionals,
  serviceId,
  professionalId,
  creatorId,
  users,
  services
) => {
  const professionalName = getProfessionalText(professionals, professionalId);
  const creatorName = getUserText(creatorId, users);
  const serviceObj = services.find((item) => item._id === serviceId);
  if (professionalName) {
    return `${serviceObj?.name} con ${professionalName} (Vendedor: ${creatorName})`;
  }

  return ""; // Handle the case where 'professional' is not found
};

const CalendarComponent = (props) => {
  const navigate = useNavigate();
  const { user, shifts, professionals, users, services } = props;
  const userType = user && user.userType;
  const { defaultDate, views, events } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: Object.keys(Views).map((k) => Views[k]),
      events: shifts.map((shift) => {
        if (
          userType === "hairsalon" &&
          (!shift.clientConfirmed || !shift.professionalConfirmed)
        ) {
          return;
        }
        const startDate = getCombinedDateTime(shift.date, shift.time);
        const endDate = addMinutesToDate(startDate, shift.duration);
        const event = {
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
//console.log(event);
        return event;
      }),
    }),
    [shifts, professionals, users, userType, services]
  );

  const handleSelectEvent = useCallback(
    (event) => {
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
      <div className={classes["calendar-container"]}>
        <div className={classes["header-container"]}>
          <h1>Agenda de turnos</h1>{" "}
          {user.userType !== "hairsalon" && (
            <Link to="/agenda/crear-turno">Nuevo turno</Link>
          )}
        </div>
        <Calendar
          localizer={localizer}
          defaultDate={defaultDate}
          views={views}
          events={events}
          style={{ height: 500 }}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </>
  );
};

export default CalendarComponent;
