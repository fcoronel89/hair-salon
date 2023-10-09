import classes from './NotFound.module.css';
const NotFoundPage = () => {
    return <div className={classes['errors-container']}>
        <h1>404 Pagina no encontrada</h1>
        <p>La pagina que tratas de acceder no existe</p>
    </div>
}

export default NotFoundPage;