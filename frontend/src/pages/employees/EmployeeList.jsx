import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import MainLayout from "../../components/layout/MainLayout";

const statusStyles = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  terminated: "bg-red-50 text-red-700",
};

const EmployeeList = () => {
  const { user } = useSelector((state) => state.auth);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canManage = user?.role === "admin" || user?.role === "hr";

  useEffect(() => {
    axiosInstance
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => setError("Couldn't load employees."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Space_Grotesk'] font-medium text-2xl text-[#14171F]">
            Employees
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {employees.length} {employees.length === 1 ? "person" : "people"} across the company
          </p>
        </div>

        {canManage && (
          <Link
            to="/employees/new"
            className="bg-[#4F5DFF] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#3D48CC] transition"
          >
            + Add employee
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading employees...</p>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : employees.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-gray-500 text-sm">No employees yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-5 py-3 font-medium text-gray-500">Name</th>
                <th className="px-5 py-3 font-medium text-gray-500">Employee ID</th>
                <th className="px-5 py-3 font-medium text-gray-500">Department</th>
                <th className="px-5 py-3 font-medium text-gray-500">Position</th>
                <th className="px-5 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3">
                    <Link
                      to={`/employees/${emp._id}`}
                      className="text-[#14171F] font-medium hover:text-[#4F5DFF]"
                    >
                      {emp.firstName} {emp.lastName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-['IBM_Plex_Mono'] text-xs">
                    {emp.employeeId}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {emp.department?.name || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {emp.jobPosition?.title || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        statusStyles[emp.status] || statusStyles.active
                      }`}
                    >
                      {emp.status || "active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
};

export default EmployeeList;