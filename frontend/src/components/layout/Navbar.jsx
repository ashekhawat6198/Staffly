import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useState } from "react";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return(
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h2 className="text-base font-medium text-[#14171F] capitalize"> {user?.role}Panel</h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{user?.email}</span>
                <button onClick={()=>dispatch(logout())}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition">Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;