import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, Outlet } from "react-router-dom";
import { Box, IconButton, Typography, useTheme } from "@mui/material";

import "./Calendar.scss";
import User from "../../models/user";
import { Professional } from "../../models/professional";
import { Shift } from "../../models/shift";
import { Service } from "../../models/service";
import useCalendar from "./useCalendar";
import { memo} from "react";

const CalendarComponent = memo(({
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

  const {
    defaultDate,
    views,
    events,
    localizer,
    handleSelectEvent,
    eventStyleGetter,
    messages,
  } = useCalendar({
    user,
    shifts,
    professionals,
    users,
    services,
  });

  console.log("Calendar");

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
});

export default CalendarComponent;
