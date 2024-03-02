import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useFormik } from "formik";

import { updateUser } from "../../utils/http";
import { getCombinedDateTimeFormated } from "../../utils/helpers";
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
import User from "../../models/user";
import {
  getDefaultValues,
  processFormData,
  validationSchema,
} from "./formData";

const UserForm = ({
  user,
  adminEditing,
  hairSalonUsers,
}: {
  user: User;
  adminEditing: boolean;
  hairSalonUsers: User[];
}) => {
  const navigate = useNavigate();
  const formResponse = useActionData() as { message: string };
  const isEditMode: boolean = useMemo(() => !!user?.firstName, [user]);
  const submit = useSubmit();
  const navigation = useNavigation();

  const getHairSalonsByNeighbourhood = (
    neighbourhood: string,
    hairSalonUserSelected: string
  ) => {
    const hairSalonsFiltered =
      hairSalonUsers &&
      hairSalonUsers.filter((user) => user.neighbourhood === neighbourhood);
    hairSalonUserSelected =
      hairSalonsFiltered && (hairSalonsFiltered[0]?._id as string);
    return (
      hairSalonsFiltered &&
      hairSalonsFiltered.map((hairSalon) => (
        <MenuItem key={hairSalon._id} value={hairSalon._id}>
          {hairSalon.firstName} {hairSalon.lastName}
        </MenuItem>
      ))
    );
  };

  const formik = useFormik({
    initialValues: getDefaultValues(
      {
        ...user,
        birthDate: user?.birthDate
          ? getCombinedDateTimeFormated(user.birthDate)
          : "",
        hairSalonId: user.hairSalonId || hairSalonUsers[0]._id
      },
      isEditMode
    ),
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = processFormData(values, isEditMode, user);

      submit(formData, {
        action: "/crear-usuario",
        method: "PUT",
      });
    },
  });

  const handleUpdateStatus = useCallback(
    async (activeStatus: boolean) => {
      if (!user || !user._id) {
        return;
      }
      await updateUser(user._id, {
        ...user,
        active: activeStatus,
      });

      navigate("/usuarios");
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
            formik.touched.firstName && formik.errors.firstName ? "invalid" : ""
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
              formik.touched.firstName && formik.errors.firstName ? true : false
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
            formik.touched.birthDate && formik.errors.birthDate ? "invalid" : ""
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
              formik.touched.birthDate && formik.errors.birthDate ? true : false
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
          cssClasses={formik.touched.dni && formik.errors.dni ? "invalid" : ""}
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
          <input type="hidden" name="userType" value={formik.values.userType} />
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
                disabled={adminEditing || !isEditMode ? false : true}
              >
                <MenuItem value="seller">Vendedor</MenuItem>
                <MenuItem value="recepcionist">Recepcionista</MenuItem>
                <MenuItem value="hairsalon">Peluqueria</MenuItem>
              </Select>
            </FormControl>
          </InputContainer>
        )}
        {(formik.values.userType === "hairsalon" ||
          formik.values.userType === "recepcionist") && (
          <InputContainer>
            <FormControl variant="filled">
              <InputLabel id="neighbourhood">Zona</InputLabel>
              <Select
                labelId="neighbourhood"
                id="neighbourhood"
                name="neighbourhood"
                value={formik.values.neighbourhood}
                onChange={formik.handleChange}
              >
                <MenuItem value="devoto">Devoto</MenuItem>
                <MenuItem value="ballester">Ballester</MenuItem>
                <MenuItem value="villaadelina">Villa Adelina</MenuItem>
              </Select>
            </FormControl>
          </InputContainer>
        )}
        {formik.values.userType === "recepcionist" && (
          <InputContainer>
            <FormControl variant="filled">
              <InputLabel id="hairSalonId">Peluqueria</InputLabel>
              <Select
                labelId="hairSalonId"
                name="hairSalonId"
                value={formik.values.hairSalonId}
                onChange={formik.handleChange}
              >
                {getHairSalonsByNeighbourhood(
                  formik.values.neighbourhood,
                  formik.values.hairSalonId
                )}
              </Select>
            </FormControl>
          </InputContainer>
        )}
        <Box
          display="flex"
          justifyContent="flex-end"
          mt={2}
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <input
            type="hidden"
            name="active"
            value={formik.values.active ? "true" : "false"}
          />
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
