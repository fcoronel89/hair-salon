import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../context/theme";
import "./Modal.scss";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

type Modal = {
  showModal: () => void;
  close: () => void;
};

export default function Modal({
  children,
  onClose,
}: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const ModalDomElement = document.getElementById("modal");

  if (!ModalDomElement) {
    throw new Error("Modal DOM element not found");
  }

  useEffect(() => {
    // Using useEffect to sync the Modal component with the DOM Dialog API
    // This code will open the native <dialog> via it's built-in API whenever the <Modal> component is rendered
    if (!dialog.current) return;

    const modal: Modal = dialog.current;

    modal.showModal();

    return () => {
      modal.close(); // needed to avoid error being thrown
    };
  }, []);

  return createPortal(
    <dialog
      id="modal-dialog"
      style={{ backgroundColor: colors.primary[400] }}
      className="modal"
      ref={dialog}
      onClose={onClose}
      role="dialog"
      aria-modal="true"
    >
      <i onClick={onClose} className="modal-cross" />
      {children}
    </dialog>,
    ModalDomElement
  );
}
