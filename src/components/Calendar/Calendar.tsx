import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Outlet } from "react-router-dom";
import { Box, Button, Typography, useTheme } from "@mui/material";

import "./Calendar.scss";
import User from "../../models/user";
import { Professional } from "../../models/professional";
import { Shift } from "../../models/shift";
import { Service } from "../../models/service";
import useCalendar from "./useCalendar";
import { memo, useState } from "react";
import Modal from "../UI/Modal";
import ShiftFormNew from "../ShiftForm/ShiftFormNew";
import { Client } from "../../models/client";

const CalendarComponent = memo(
  ({
    user,
    shifts,
    professionals,
    users,
    services,
    hairSalonUsers,
    clients,
  }: {
    user: User;
    shifts: Shift[];
    professionals: Professional[];
    users: User[];
    services: Service[];
    hairSalonUsers: User[];
    clients: Client[];
  }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldResetForm, setShouldResetForm] = useState(false);

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
      clients
    });

    console.log("Calendar");

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setShouldResetForm(true);
    };

    const reloadPage = () => {
      window.location.reload();
    };

    const handleOpenModal = () => {
      setIsModalOpen(true);
      setShouldResetForm(false);
    };

    return (
      <>
        <Modal onClose={handleCloseModal} isOpen={isModalOpen}>
          <ShiftFormNew
            professionals={professionals}
            services={services}
            shifts={shifts}
            user={user}
            hairSalonUsers={hairSalonUsers}
            shouldResetForm={shouldResetForm}
            onClose={() => {
              handleCloseModal();
              reloadPage();
            }}
          />
        </Modal>
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
              <Button
                aria-label="add"
                color="secondary"
                variant="contained"
                onClick={handleOpenModal}
              >
                Nuevo Turno
              </Button>
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
  }
);

export default CalendarComponent;
