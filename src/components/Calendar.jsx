import { useCallback, useMemo } from "react";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "./Calendar.module.css";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { addMinutesToDate, getCombinedDateTime } from "../utils/helpers";

const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
  if (event.specialEvent) {
    let style = {
      backgroundColor: "green", // Custom background color
      borderColor: "darkgreen", // Custom border color
    };

    return {
      style,
    };
  }
};

const getUserText = (userId, users) => {
  const user = users.find((user) => user.id === userId);
  return `${user.firstName} ${user.lastName}`;
};

const getTitle = (
  professionals,
  service,
  professionalId,
  shiftCreator,
  users
) => {
  const professional = professionals[professionalId];
  const creatorName = getUserText(shiftCreator, users);

  if (professional) {
    return `${service} con ${professional.firstName} ${professional.lastName} (Vendedor: ${creatorName})`;
  }

  return ""; // Handle the case where 'professional' is not found
};

const CalendarComponent = () => {
  const navigate = useNavigate();
  const { user, shifts, professionals, users } = useLoaderData();
  const { defaultDate, views, events } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: Object.keys(Views).map((k) => Views[k]),
      events: Object.entries(shifts).map(([key, shift]) => {
        if (
          user.userType === "hairsalon" &&
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
            shift.service,
            shift.professional,
            shift.shiftCreator,
            users
          ),
          allDay: false,
          start: startDate,
          end: endDate,
          owner: shift.shiftCreator,
          assisted: shift.assisted,
          clientConfirmed: shift.clientConfirmed,
          professionalConfirmed: shift.professionalConfirmed,
        };
        console.log(event);
        return event;
      }),
    }),
    [shifts, professionals, users, user.userType]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      const now = new Date();
      const isAdmin = user.userType === "admin";
      const isOwner = user.id === event.owner;
      const isFutureEvent = event.end > now;

      if (isAdmin || (isOwner && isFutureEvent)) {
        navigate(`/agenda/editar-turno/${event.id}`);
      }
    },
    [navigate, user]
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
