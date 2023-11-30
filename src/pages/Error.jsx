import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import classes from './Error.module.css';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <MainNavigation />
      <main className={classes.container}>
        <h1>Error ocurred!</h1>
        <p>{error?.message}</p>
      </main>
    </>
  );
};

export default ErrorPage;
