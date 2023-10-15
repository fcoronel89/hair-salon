import { useCallback, useMemo } from "react";
import moment from "moment";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "./Calendar.module.css";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { addMinutesToDate, getCombinedDateTime } from "../utils/helpers";

const mLocalizer = momentLocalizer(moment);

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
const CalendarComponent = () => {
  const navigate = useNavigate();
  const { user, shifts } = useLoaderData();
  const { defaultDate, views, events } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: Object.keys(Views).map((k) => Views[k]),
      events: Object.entries(shifts).map(([key, shift]) => {
        const startDate = getCombinedDateTime(shift.shiftDate, shift.time);
        const endDate = addMinutesToDate(startDate, shift.duration);
        const event = {
          id: key,
          title: shift.subService,
          allDay: false,
          start: startDate,
          end: endDate,
        };
        console.log(event);
        return event;
      }),
    }),
    [shifts]
  );

  const handleSelectEvent = useCallback(
    (event) => navigate(`/agenda/editar-turno/${event.id}`),
    [navigate]
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
          localizer={mLocalizer}
          defaultDate={defaultDate}
          views={views}
          events={events}
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </>
  );
};

export default CalendarComponent;
