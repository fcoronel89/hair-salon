import { ReactElement } from "react";
import { NavLink } from "react-router-dom";

const CustomLink = ({
  to,
  title,
  icon,
  ...props
}: {
  to: string;
  title: string;
  icon: ReactElement;
}) => {
  return (
    <li className="ps-menuitem-root">
      <NavLink
        to={to}
        {...props}
        className={({ isActive }) =>
          isActive ? "ps-menu-button ps-active" : "ps-menu-button"
        }
        end
      >
        <span className="ps-menu-icon">
          <svg width="24" height="24">
            {icon}
          </svg>{" "}
        </span>
        <span className="ps-menu-label">{title}</span>
      </NavLink>
    </li>
  );
};

export default CustomLink;
