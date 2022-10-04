import React from "react";
import { NavLink } from "react-router-dom";

function NavItem({ content, href }) {
    return (
        <a className="text-lg nav-item nav-link text-white px-4">
            <NavLink
                className={({ isActive }) =>
                    isActive ? "text-green-500  text-decoration-none" : "text-white  text-decoration-none"
                }
                to={href}
            >
                {content}
            </NavLink>
        </a>
    );
}

export default  NavItem
