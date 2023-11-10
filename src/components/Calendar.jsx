import { useCallback, useMemo } from "react";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "./Calendar.module.css";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
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
  return user ? `${user.firstName} ${user.lastName}` : '';
};

const getTitle = (
  professionals,
  service,
  professionalId,
  shiftCreator,
  users,
  services
) => {
  const professional = professionals[professionalId];
  const creatorName = getUserText(shiftCreator, users);
  const serviceObj = services?.find((item) => item.id === service);
  if (professional) {
    return `${serviceObj.value} con ${professional.firstName} ${professional.lastName} (Vendedor: ${creatorName})`;
  }

  return ""; // Handle the case where 'professional' is not found
};

const CalendarComponent = () => {
  const navigate = useNavigate();
  const { user, shifts, professionals, users, services } = useLoaderData();
  const userType = user && user.userType;
  console.log("Serveces", services);
  const { defaultDate, views, events } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: Object.keys(Views).map((k) => Views[k]),
      events: Object.entries(shifts).map(([key, shift]) => {
        if (
          userType === "hairsalon" &&
          (!shift.clientConfirmed || !shift.professionalConfirmed)
        ) {
          return;
        }
        const startDate = getCombinedDateTime(shift.shiftDate, shift.time);
        const endDate = addMinutesToDate(startDate, shift.duration);
        const event = {
          id: key,
          title: getTitle(
            professionals,
            Number(shift.service),
            shift.professional,
            shift.shiftCreator,
            users,
            services
          ),
          allDay: false,
          start: startDate,
          end: endDate,
          owner: shift.shiftCreator,
          attended: shift.attended,
          clientConfirmed: shift.clientConfirmed,
          professionalConfirmed: shift.professionalConfirmed,
        };
        console.log(event);
        return event;
      }),
    }),
    [shifts, professionals, users, userType, services]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      const now = new Date();
      const isAdmin = userType === "admin";
      const isOwner = user.id === event.owner;
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
          {user.userType !== "hairSalon" && (
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
