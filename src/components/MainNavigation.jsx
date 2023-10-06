import { Form, Link } from "react-router-dom";
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
    return <nav className={classes['main-navigation']}>
        <ul>
            <li><Link to='/'>Agenda</Link></li>
            <li> <Form action="/logout" method="POST">
                <button>Logout</button>
              </Form></li>
        </ul>
    </nav>
}

export default MainNavigation;