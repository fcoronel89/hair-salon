import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import CreateProfessionalForm from "../components/CreateProfessional/CreateProfessionalForm";
import {
  createProfessional,
  getProfessionalById,
  getServices,
  queryClient,
  updateProfessional,
} from "../utils/http";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import { Suspense } from "react";
import Loading from "../components/UI/Loading";
import SectionContainer from "../components/UI/SectionContainer";

interface LoaderData {
  data: Promise<
    [
      Awaited<ReturnType<typeof getServices>>,
      Awaited<ReturnType<typeof getProfessionalById>> | false
    ]
  >;
}

export const ProfessionalPage = () => {
  const { data } = useLoaderData() as LoaderData;
  return (
    <SectionContainer>
      <Suspense fallback={<Loading />}>
        <Await resolve={data.then((value) => value)}>
          {([services, professional]) => {
            return (
              <CreateProfessionalForm
                services={services}
                professional={professional}
              />
            );
          }}
        </Await>
      </Suspense>
    </SectionContainer>
  );
};

const checkAccessAndRedirect = () => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("admin");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
};

export const loader = () => {
  try {
    checkAccessAndRedirect();

    const data = Promise.all([getServices(), false]);
    return defer({ data });
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateLoader = ({ params } : { params?: { professionalId: string } }) => {
  try {
    if (!params) return;

    checkAccessAndRedirect();

    const professionalId = params.professionalId;

    const data = Promise.all([
      getServices(),
      getProfessionalById(professionalId),
    ]);

    return defer({ data });
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const action = async ({ request } : { request: Request }) => {
  try {
    checkAccessAndRedirect();

    const professionalData = await request.formData();
    const updatedProfessionalData = Object.fromEntries(professionalData) as any;
    updatedProfessionalData.serviceType = updatedProfessionalData.serviceType?.split(",");

    await createProfessional(updatedProfessionalData);
    queryClient.invalidateQueries({ queryKey: ["professionals"] });

    return { status: 200, message: "Profesional creado correctamente" };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateAction = async ({ request, params }: { request: Request; params?: { professionalId: string } }) => {
  try {
    if(!params) return;

    checkAccessAndRedirect();
    
    const professionalData = await request.formData();
    const updatedProfessionalData = Object.fromEntries(professionalData) as any;
    updatedProfessionalData.serviceType = updatedProfessionalData.serviceType?.split(",");
    const professionalId = params.professionalId;

    await updateProfessional(updatedProfessionalData, professionalId);
    queryClient.invalidateQueries({ queryKey: ["professionals"] });

    return { status: 200, message: "Profesional actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return error;
  }
};