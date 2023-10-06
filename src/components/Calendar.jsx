import React, { useMemo, useState } from "react";
import moment from "moment";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import classes from "./Calendar.module.css";
import Modal from "./UI/Modal";
import { Form } from "react-router-dom";

const mLocalizer = momentLocalizer(moment);
const events = [
  {
    id: 1,
    title: "Corte con Alejandro",
    start: new Date(2023, 9, 4, 10, 0), // October 5th, 2023, 10:00 AM
    end: new Date(2023, 9, 4, 11, 0), // October 5th, 2023, 12:00 PM
    allDay: false, // Set to true if it's an all-day event
    style: {
      backgroundColor: "green",
      borderColor: "darkgreen",
    },
    specialEvent: true,
  },
  {
    id: 2,
    title: "Tintura con Pablo",
    start: new Date(2023, 9, 6, 12, 30), // October 6th, 2023, 12:30 PM
    end: new Date(2023, 9, 6, 15, 30), // October 6th, 2023, 1:30 PM
    allDay: false,
    style: {
      backgroundColor: "green",
      borderColor: "darkgreen",
    },
  },
  {
    id: 3,
    title: "Alisado con Pablo",
    start: new Date(2023, 9, 8, 14, 0), // October 8th, 2023, 2:00 PM
    end: new Date(2023, 9, 8, 15, 30), // October 8th, 2023, 3:30 PM
    allDay: false,
    style: {
      backgroundColor: "green",
      borderColor: "darkgreen",
    },
  },
  {
    id: 4,
    title: "Corte con Pablo",
    start: new Date(2023, 9, 15),
    end: new Date(2023, 9, 17),
    allDay: true, // This is an all-day event
    style: {
      backgroundColor: "green",
      borderColor: "darkgreen",
    },
  },
];

const eventStyleGetter = (event, start, end, isSelected) => {
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
  const [isShowModal, setIsShowModal] = useState(false);
  const { defaultDate, views } = useMemo(
    () => ({
      defaultDate: new Date(2023, 3, 1),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  const closeModalHandler = () => {
    setIsShowModal(false);
  };

  const showModalHandler = () => {
    setIsShowModal(true);
  }

  return (
    <>
    <div className={`${classes['modal-container']} ${isShowModal ? 'show':''}`}>
      <Modal onClose={closeModalHandler} isShowModal={isShowModal}>
        <Form method="post" className='form-new'>
          <h2>Nuevo Turno</h2>
          <div className='input-container'>
            <label>Peluquero</label>
            <input type="text" id="user" name="user" />
          </div>
          <div className='input-container'>
            <label>Tratamiento</label>
            <input type="text" id="password" name="password" />
          </div>
          <div className='input-container'>
            <label>Dia y hora</label>
            <input type="date" id="password" name="password" />
          </div>
          <div className='actions'>
            <button onClick={closeModalHandler}>Ingresar</button>
          </div>
        </Form>
      </Modal>
    </div>
      <div className={classes["calendar-container"]}>
        <div className={classes["header-container"]}>
          <h1>Agenda de turnos</h1> <button onClick={showModalHandler}>Nuevo turno</button>
        </div>
        <Calendar
          localizer={mLocalizer}
          defaultDate={defaultDate}
          views={views}
          events={events}
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </>
  );
};

export default CalendarComponent;
