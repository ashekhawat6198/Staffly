import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { label: "Dashboard", path: "/", roles: ["admin", "hr", "manager", "employee"] },
    { label: "Employees", path: "/employees", roles: ["admin", "hr", "manager"] },
    { label: "Departments", path: "/departments", roles: ["admin", "hr"] },
    { label: "Attendance", path: "/attendance", roles: ["admin", "hr", "manager", "employee"] },
    { label: "Leaves", path: "/leaves", roles: ["admin", "hr", "manager", "employee"] },
    { label: "Payroll", path: "/payroll", roles: ["admin", "hr", "employee"] },
    { label: "Candidates", path: "/candidates", roles: ["admin", "hr"] },
    { label: "My Profile", path: "/profile", roles: ["admin", "hr", "manager", "employee"] },
  ];

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-[#14171F] text-white  flex flex-col">
      <div className="p-6 text-xl font-['Space_Grotesk'] font-semibold border-b border-white/10">
        Staffly
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm transition ${
                isActive ? "bg-[#4F5DFF] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;