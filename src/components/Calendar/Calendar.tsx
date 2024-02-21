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
import AttendedShift from "../AttendedShift";
import ShiftForm from "../ShiftForm/ShiftForm";

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
    const [shiftAction, setShiftAction] = useState("");
    const [shiftSelected, setShiftSelected] = useState<Shift | null>(null);
    const [shiftSelectedClient, setShiftSelectedClient] =
      useState<Client | null>(null);

    const handleSelectedShift = (
      shift: Shift,
      client: Client | null = null
    ) => {
      setShiftSelected(shift);
      setShiftSelectedClient(client);
    };

    const handleOpenModal = (action: string) => {
      setShiftAction(action);
      setIsModalOpen(true);
      setShouldResetForm(false);
    };

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
      clients,
      handleSelectedShift,
      handleOpenModal,
    });

    console.log("Calendar");

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setShouldResetForm(true);
      setShiftAction("");
    };

    const reloadPage = () => {
      window.location.reload();
    };

    return (
      <>
        <Modal onClose={handleCloseModal} isOpen={isModalOpen}>
          {shiftAction === "new" && (
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
          )}
          {shiftAction === "attended" && (
            <AttendedShift
              shift={shiftSelected}
              users={users}
              clients={clients}
              professionals={professionals}
              services={services}
              onClose={() => {
                handleCloseModal();
                reloadPage();
              }}
            />
          )}
          {shiftAction === "edit" && (
            <ShiftForm
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
              shift={shiftSelected}
              client={shiftSelectedClient}
            />
          )}
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
                onClick={() => handleOpenModal("new")}
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
            min={new Date(0, 0, 0, 9, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            className={isDarkMode ? "dark" : "light"}
            messages={messages}
          />

          <Box mt={2} className="references-box">
            <Typography variant="h5" component="h5" mr={3}>
              Referencias 
            </Typography>
            <div className="references shift-not-confirmed"></div>
            <Typography variant="body1" component="span">
              Turnos no confirmados
            </Typography>
            <div className="references"></div>
            <Typography variant="body1" component="span">
              Turnos confirmados
            </Typography>
            <div className="references shift-assisted"></div>
            <Typography variant="body1" component="span">
              Turnos Asistidos
            </Typography>
          </Box>
        </div>
      </>
    );
  }
);

export default CalendarComponent;
