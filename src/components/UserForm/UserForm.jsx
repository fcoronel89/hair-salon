import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";
import { object } from "yup";

import { isRequired, isNumber, isDate, isDNI } from "../../utils/validation";
import { updateUser } from "../../utils/http";
import { getCombinedDateTime } from "../../utils/helpers";
import { useCallback, useMemo } from "react";

import InputContainer from "../UI/InputContainer";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const validationSchema = object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  phone: isNumber("Ingresar Telefono"),
  dni: isDNI("Ingresar DNI"),
  birthDate: isDate("La fecha no puede ser en el futuro"),
});

const getDefaultValues = (user, isEditMode) =>
  isEditMode
    ? user
    : {
        email: user ? user.email : "",
        firstName: "",
        lastName: "",
        birthDate: "",
        phone: "",
        dni: "",
        userType: "seller",
        active: true,
      };

const UserForm = ({ user, adminEditing }) => {
  const navigate = useNavigate();
  const formResponse = useActionData();
  const isEditMode = useMemo(() => !!user && user.firstName, [user]);
  const submit = useSubmit();
  const navigation = useNavigation();

  user.birthDate = useMemo(
    () =>
      isEditMode
        ? getCombinedDateTime(user.birthDate, "0:00")
            .toISOString()
            .split("T")[0]
        : "",
    [user.birthDate, isEditMode]
  );

  const defaultValues = useMemo(
    () => getDefaultValues(user, isEditMode),
    [user, isEditMode]
  );

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      submit(
        { ...values, id: user?._id, googleId: user?.googleId },
        {
          action: "/crear-usuario",
          method: "PUT",
        }
      );
    },
  });

  const handleUpdateStatus = useCallback(
    async (activeStatus) => {
      const response = await updateUser(user?._id, {
        ...user,
        active: activeStatus,
      });

      if (response) {
        navigate("/usuarios");
      }
    },
    [user, navigate]
  );

  const handleDelete = () => handleUpdateStatus(false);
  const handleActivate = () => handleUpdateStatus(true);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>{isEditMode ? "Editar Usuario" : "Crear Usuario"}</h2>
        <>
          <InputContainer>
            <TextField
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              disabled={true}
              variant="filled"
              label="Email *"
            />
          </InputContainer>
          <h2>Completar datos adicionales</h2>
          <InputContainer
            cssClasses={
              formik.touched.firstName && formik.errors.firstName
                ? "invalid"
                : ""
            }
          >
            <TextField
              type="text"
              id="firstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              variant="filled"
              label="Nombre *"
              error={
                formik.touched.firstName && formik.errors.firstName
                  ? true
                  : false
              }
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
              value={formik.values.lastName}
              onChange={formik.handleChange}
              variant="filled"
              label="Apellido *"
              error={
                formik.touched.lastName && formik.errors.lastName ? true : false
              }
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <p>{formik.errors.lastName}</p>
            ) : null}
          </InputContainer>

          <InputContainer
            cssClasses={
              formik.touched.birthDate && formik.errors.birthDate
                ? "invalid"
                : ""
            }
          >
            <TextField
              type="date"
              id="birthDate"
              name="birthDate"
              value={formik.values.birthDate}
              onChange={formik.handleChange}
              variant="filled"
              label="Fecha de nacimiento "
              error={
                formik.touched.birthDate && formik.errors.birthDate
                  ? true
                  : false
              }
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
              variant="filled"
              label="Teléfono *"
              error={formik.touched.phone && formik.errors.phone ? true : false}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p>{formik.errors.phone}</p>
            ) : null}
          </InputContainer>
          <InputContainer
            cssClasses={
              formik.touched.dni && formik.errors.dni ? "invalid" : ""
            }
          >
            <TextField
              type="text"
              id="dni"
              name="dni"
              value={formik.values.dni}
              onChange={formik.handleChange}
              variant="filled"
              label="Dni *"
              error={formik.touched.dni && formik.errors.dni ? true : false}
            />
            {formik.touched.dni && formik.errors.dni ? (
              <p>{formik.errors.dni}</p>
            ) : null}
          </InputContainer>
          {formik.values.userType === "admin" ? (
            <input
              type="hidden"
              name="userType"
              value={formik.values.userType}
            />
          ) : (
            <InputContainer>
              <FormControl variant="filled">
                <InputLabel id="userType">Tipo de usuario</InputLabel>
                <Select
                  labelId="userType"
                  id="userType"
                  name="userType"
                  value={formik.values.userType}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="seller">Vendedor</MenuItem>
                  <MenuItem value="hairsalon">Peluqueria</MenuItem>
                </Select>
              </FormControl>
            </InputContainer>
          )}
          <Box display="flex" justifyContent="flex-end" mt={2} gap={2} flexDirection={{ xs: "column", sm: "row" }}>
            <input type="hidden" name="active" value={formik.values.active} />
            {formResponse && <p>{formResponse.message}</p>}
            {navigation.state === "submitting" && <p>Enviando...</p>}
            {isEditMode && adminEditing && (
              <Button
                type="button"
                variant="contained"
                size="large"
                color={user.active ? "error" : "secondary"}
                onClick={user.active ? handleDelete : handleActivate}
              >
                {user.active ? "Desactivar Usuario" : "Activar Usuario"}
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="secondary"
              disabled={navigation.state === "submitting"}
            >
              {isEditMode ? "Guardar" : "CREAR"}
            </Button>
          </Box>
        </>
    </form>
  );
};

export default UserForm;
