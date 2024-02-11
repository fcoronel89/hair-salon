import { useFormik } from "formik";
import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import { object } from "yup";
import { firebaseApp } from "../../utils/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import {
  isRequired,
  isNumber,
  isDate,
  isImage,
  isDNI,
  hasAtLeastOneChecked,
} from "../../utils/validation";
import { updateProfessional } from "../../utils/http";
import { getCombinedDateTime } from "../../utils/helpers";

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputContainer from "../UI/InputContainer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Service } from "../../models/service";
import { Professional } from "../../models/professional";
import { useMemo } from "react";
import User from "../../models/user";

const uploadImage = async (image: File) => {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage);
  // Generate a unique name for the image (e.g., using a timestamp)
  const imageName = `${Date.now()}_${image.name}`;

  const imagesRef = ref(storageRef, "images");
  const imageRef = ref(imagesRef, imageName);
  // Upload the image using the reference
  const snapshot = await uploadBytes(imageRef, image);
  // Get the reference to the uploaded file
  const uploadedFileRef = snapshot.ref;
  // Get the download URL of the uploaded file
  const downloadURL = await getDownloadURL(uploadedFileRef);
  return downloadURL;
};

type ProfessionalCheckboxKeys = "serviceType" | "hairSalons";

const getCheckBoxObject = (
  array: any[],
  professional?: Professional,
  key?: ProfessionalCheckboxKeys
) => {
  const outputObject: Record<string, boolean> = {};

  array.forEach((item) => {
    if (!professional || !key) {
      outputObject[item._id] = false;
    } else {
      outputObject[item._id] =
        professional[key] &&
        professional[key].some((subItem) => subItem === item._id.toString());
    }
  });

  return outputObject;
};

const getSelectedCheckboxes = (itemsSelected: { [key: string]: boolean }) =>
  Object.keys(itemsSelected).filter((key) => {
    return itemsSelected[key];
  });

const CreateProfessionalForm = ({
  services,
  professional,
  hairSalonUsers,
}: {
  services: Service[];
  professional: Professional;
  hairSalonUsers: User[];
}) => {
  const isNonMobile = useMediaQuery("(min-width:420px)");
  const navigate = useNavigate();
  const navigation = useNavigation();
  const formResponse = useActionData() as { message: string };
  const isEditMode = !!professional;
  
  const submit = useSubmit();

  if (professional) {
    const birthDate = getCombinedDateTime(
      new Date(professional.birthDate),
      "0:00"
    )
      .toISOString()
      .split("T")[0];
    professional.birthDate = birthDate;
  }

  const serviceType = useMemo(() => {
    if (professional) {
      return getCheckBoxObject(services, professional, "serviceType");
    }
    return getCheckBoxObject(services);
  }, [professional, services]);

  const hairSalons = useMemo(() => {
    if (professional) {
      return getCheckBoxObject(hairSalonUsers, professional, "hairSalons");
    }
    return getCheckBoxObject(hairSalonUsers);
  }, [hairSalonUsers, professional]);

  const defaultValues = professional || {
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    dni: "",
    image: null as File | null,
    active: true,
  };

  const validationSchema = object({
    firstName: isRequired("Ingresar Nombre"),
    lastName: isRequired("Ingresar Apellido"),
    phone: isNumber("Ingresar Telefono"),
    birthDate: isDate("La fecha no puede ser en el futuro"),
    serviceType: hasAtLeastOneChecked(
      "Seleccionar al menos un tipo de servicio"
    ),
    hairSalons: hasAtLeastOneChecked("Seleccionar al menos una peluqueria"),
    image:
      (isEditMode && professional.image && isRequired("Imagen requerida")) ||
      isImage("Ingresar imagen valida"),
    dni: isDNI("Ingresar DNI"),
  });

  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      serviceType: serviceType,
      hairSalons: hairSalons,
      isEditMode,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const serviceTypesSelected = values.serviceType;
      const selectedCheckboxes = getSelectedCheckboxes(serviceTypesSelected);

      const hairSalonsSelected = values.hairSalons;
      const selectedHairSalons = getSelectedCheckboxes(hairSalonsSelected);

      let imageUrl: string;
      if (values.image instanceof File) {
        imageUrl = await uploadImage(values.image);
      } else {
        imageUrl = professional.image.toString();
      }
      const dataToSend = {
        ...values,
        serviceType: selectedCheckboxes,
        hairSalons: selectedHairSalons,
        image: imageUrl,
        birthDate: values.birthDate + "T00:00:00.000Z", // convert to ISO format
      };
      if ("__v" in dataToSend) {
        delete (dataToSend as any).__v;
      }

      submit(dataToSend, {
        action: isEditMode
          ? "/profesionales/editar/" + professional._id
          : "/profesionales/crear",
        method: isEditMode ? "PUT" : "POST",
        encType: "multipart/form-data",
      });
    },
  });

  const handleUpdateStatus = async (activeStatus: boolean) => {
    const response = await updateProfessional(
      { ...professional, active: activeStatus },
      professional._id
    );

    if (response) {
      navigate("/profesionales");
    }
  };

  const handleDelete = () => handleUpdateStatus(false);

  const handleActivate = () => handleUpdateStatus(true);

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <h2>Crear Profesional</h2>
      <InputContainer
        cssClasses={
          formik.touched.firstName && formik.errors.firstName ? "invalid" : ""
        }
      >
        <TextField
          fullWidth
          variant="filled"
          label="Nombre *"
          type="text"
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          error={
            formik.touched.firstName && formik.errors.firstName ? true : false
          }
          onChange={formik.handleChange}
        />
        {formik.touched.firstName && formik.errors.firstName ? (
          <p>{formik.errors.firstName}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={
          formik.touched.lastName && formik.errors.lastName ? "invalid" : ""
        }
      >
        <TextField
          type="text"
          id="lastName"
          name="lastName"
          label="Apellido *"
          value={formik.values.lastName}
          error={
            formik.touched.lastName && formik.errors.lastName ? true : false
          }
          onChange={formik.handleChange}
          variant="filled"
        />
        {formik.touched.lastName && formik.errors.lastName ? (
          <p>{formik.errors.lastName}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={
          formik.touched.birthDate && formik.errors.birthDate ? "invalid" : ""
        }
      >
        <TextField
          type="date"
          id="birthDate"
          name="birthDate"
          value={formik.values.birthDate}
          onChange={formik.handleChange}
          label="Fecha de nacimiento "
          error={
            formik.touched.birthDate && formik.errors.birthDate ? true : false
          }
          variant="filled"
        />
        {formik.touched.birthDate && formik.errors.birthDate ? (
          <p>{formik.errors.birthDate}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={
          formik.touched.phone && formik.errors.phone ? "invalid" : ""
        }
      >
        <TextField
          type="tel"
          id="phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          label="Telefono *"
          error={formik.touched.phone && formik.errors.phone ? true : false}
          variant="filled"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <p>{formik.errors.phone}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={formik.touched.dni && formik.errors.dni ? "invalid" : ""}
      >
        <TextField
          type="text"
          id="dni"
          name="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
          label="DNI *"
          error={formik.touched.dni && formik.errors.dni ? true : false}
          variant="filled"
        />
        {formik.touched.dni && formik.errors.dni ? (
          <p>{formik.errors.dni}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={
          formik.touched.image && formik.errors.image ? "invalid" : ""
        }
      >
        <label>Foto *</label>
        {formik.values.image ? (
          <Avatar
            src={formik.values.image ? formik.values.image.toString() : ""}
            alt="image"
            sx={{ width: 100, height: 100, marginBottom: "10px" }}
          />
        ) : "" }
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            color="secondary"
          >
            Subir Imagen
            <input
              hidden
              type="file"
              id="image"
              name="image"
              onChange={(event) => {
                formik.setFieldValue(
                  "image",
                  event.currentTarget.files ? event.currentTarget.files[0] : ""
                );
              }}
            />
          </Button>
        
        {formik.touched.image && formik.errors.image ? (
          <p>{formik.errors.image}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={
          formik.touched.serviceType && formik.errors.serviceType
            ? "invalid"
            : ""
        }
      >
        <label>Tipo de Servicio</label>
        <FormGroup row>
          {services &&
            services.map((service) => (
              <FormControlLabel
                key={service._id}
                control={
                  <Checkbox
                    name={`serviceType.${service._id}`}
                    onChange={formik.handleChange}
                    checked={formik.values.serviceType[service._id]}
                    color="default"
                  />
                }
                label={service.name}
              />
            ))}
        </FormGroup>
        {formik.touched.serviceType && formik.errors.serviceType ? (
          <p>{String(formik.errors.serviceType)}</p>
        ) : null}
      </InputContainer>
      <InputContainer
        cssClasses={
          formik.touched.hairSalons && formik.errors.hairSalons ? "invalid" : ""
        }
      >
        <label>Peluquerias</label>
        <FormGroup row>
          {hairSalonUsers &&
            hairSalonUsers.map((user) => (
              <FormControlLabel
                key={user._id}
                control={
                  <Checkbox
                    name={`hairSalons.${user._id}`}
                    onChange={formik.handleChange}
                    checked={formik.values.hairSalons[user._id]}
                    color="default"
                  />
                }
                label={user.firstName + " " + user.lastName}
              />
            ))}
        </FormGroup>
        {formik.touched.hairSalons && formik.errors.hairSalons ? (
          <p>{String(formik.errors.hairSalons)}</p>
        ) : null}
      </InputContainer>
      <Box
        display={"flex"}
        justifyContent="flex-end"
        mt={2}
        gap={2}
        flexDirection={isNonMobile ? "row" : "column"}
      >
        {formResponse && <p>{formResponse.message}</p>}
        {navigation.state === "submitting" && <p>Enviando...</p>}
        {isEditMode && professional.active && (
          <Button
            type="button"
            onClick={handleDelete}
            color="error"
            size="large"
            variant="contained"
          >
            Desactivar Profesional
          </Button>
        )}
        {isEditMode && !professional.active && (
          <Button
            type="button"
            onClick={handleActivate}
            color="secondary"
            size="large"
            variant="contained"
          >
            Activar Profesional
          </Button>
        )}
        <Button
          color="secondary"
          size="large"
          variant="contained"
          type="submit"
          disabled={navigation.state === "submitting"}
        >
          {isEditMode ? "Guardar" : "CREAR"}
        </Button>
      </Box>
    </form>
  );
};

export default CreateProfessionalForm;
