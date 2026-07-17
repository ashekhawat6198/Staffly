import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 bg-gray-50 flex-1 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;