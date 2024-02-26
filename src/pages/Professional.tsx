import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import CreateProfessionalForm from "../components/CreateProfessional/CreateProfessionalForm";
import {
  createProfessional,
  getProfessionalById,
  getServices,
  queryClient,
  updateProfessional,
  getHairSalonUsers,
} from "../utils/http";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import { Suspense } from "react";
import Loading from "../components/UI/Loading";
import SectionContainer from "../components/UI/SectionContainer";

interface LoaderData {
  data: Promise<
    [
      Awaited<ReturnType<typeof getServices>>,
      Awaited<ReturnType<typeof getProfessionalById>> | false,
      Awaited<ReturnType<typeof getHairSalonUsers>>
    ]
  >;
}

export const ProfessionalPage = () => {
  const { data } = useLoaderData() as LoaderData;
  return (
    <SectionContainer>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.then((value) => value)}>
          {([services, hairSalonUsers, professional]) => {
            return (
              <CreateProfessionalForm
                services={services}
                professional={professional}
                hairSalonUsers={hairSalonUsers}
              />
            );
          }}
        </Await>
      </Suspense>
    </SectionContainer>
  );
};

const redirectToLoginPageIfUnauthorized = (requiredRole: string) => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess(requiredRole);
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
};

export const loader = async () => {
  try {
    redirectToLoginPageIfUnauthorized("admin");

    const data = Promise.all([getServices(), getHairSalonUsers(), false]);
    return defer({ data });
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateLoader = async ({
  params,
}: {
  params?: { professionalId: string };
}) => {
  try {
    if (!params) return;

    redirectToLoginPageIfUnauthorized("admin");

    const professionalId = params.professionalId;

    const data = Promise.all([
      getServices(),
      getHairSalonUsers(),
      getProfessionalById(professionalId),
    ]);

    return defer({ data });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const processFormData = (formData: FormData) => {
  const dataObject = Object.fromEntries(formData) as any;
  dataObject.serviceType = dataObject.serviceType?.split(",");
  dataObject.hairSalons = dataObject.hairSalons?.split(",");
  return dataObject;
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const professionalFormData = processFormData(formData);

    await createProfessional(professionalFormData);
    queryClient.invalidateQueries({ queryKey: ["professionals"] });

    return { status: 200, message: "Profesional creado correctamente" };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateAction = async ({
  request,
  params,
}: {
  request: Request;
  params?: { professionalId: string };
}) => {
  try {
    if (!params) return;

    const formData = await request.formData();
    const updatedProfessionalData = processFormData(formData);
    const professionalId = params.professionalId;

    await updateProfessional(updatedProfessionalData, professionalId);
    queryClient.invalidateQueries({ queryKey: ["professionals"] });

    return { status: 200, message: "Profesional actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return error;
  }
};
