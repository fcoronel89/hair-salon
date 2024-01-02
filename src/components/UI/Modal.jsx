import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classes from './Modal.module.css';
import { useTheme } from "@mui/material";
import { tokens } from "../../context/theme";
import './Modal.scss';

export default function Modal({ children, onClose }) {
  const dialog = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    // Using useEffect to sync the Modal component with the DOM Dialog API
    // This code will open the native <dialog> via it's built-in API whenever the <Modal> component is rendered
    const modal = dialog.current;
    modal.showModal();

    return () => {
      modal.close(); // needed to avoid error being thrown
    };
  }, []);

  return createPortal(
    <dialog id="modal-dialog" style={{ backgroundColor: colors.primary[400] }} className="modal" ref={dialog} onClose={onClose}>
      <i onClick={onClose} className="modal-cross" />
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
