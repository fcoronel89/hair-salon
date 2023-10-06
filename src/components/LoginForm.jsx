import { Form } from "react-router-dom";
import classes from './LoginForm.module.css';

const LoginForm = () => {
  return (
    <section>
      <Form method="post" className={classes.form}>
        <h2>Ingresar</h2>
        <div className={classes['input-container']}>
          <label>Usuario</label>
          <input type="text" id="user" name="user" />
        </div>
        <div className={classes['input-container']}>
          <label>Contraseña</label>
          <input type="password" id="password" name="password" />
        </div>
        <div className={classes.actions}>
            <button type="submit">Ingresar</button>
        </div>
      </Form>
    </section>
  );
};

export default LoginForm;
