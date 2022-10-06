import React from "react";
import { NavLink } from "react-router-dom";

function NavItem({ content, href }) {
    return (
        <NavLink
            className={({ isActive }) =>
                isActive ? "text-lg nav-item nav-link text-white px-4 text-green-500 text-decoration-none"
                    : "text-lg nav-item nav-link text-white px-4 text-white text-decoration-none"
            }
            to={href}
        >
            {content}
        </NavLink>
    );
}

export default  NavItem
