import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import MainLayout from "../components/layout/MainLayout";

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <p className="text-2xl font-semibold text-[#14171F]">{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/stats")
      .then((res) => setStats(res.data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const isAdminOrHr = user?.role === "admin" || user?.role === "hr";

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-[#14171F] mb-1">
        Welcome back{user?.email ? `, ${user.email}` : ""}
      </h1>
      <p className="text-gray-500 mb-6 capitalize">{user?.role} dashboard</p>

      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : !stats ? (
        <p className="text-gray-500">Couldn't load dashboard stats.</p>
      ) : isAdminOrHr ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Employees" value={stats.totalEmployees} />
          <StatCard label="Pending Leave Requests" value={stats.pendingLeaves} />
          <StatCard label="Checked In Today" value={stats.todayAttendance} />
          <StatCard label="Departments" value={stats.totalDepartments} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Checked In Today" value={stats.checkedInToday ? "true" : "false"} />
          <StatCard label="Checked Out Today" value={stats.checkedOutToday ? "true" : "false"} />
          <StatCard label="My Pending Leaves" value={stats.myPendingLeaves} />
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;