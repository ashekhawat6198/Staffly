import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
      <p className="text-gray-600">Role: {user?.role}</p>
      <button
        onClick={() => dispatch(logout())}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;