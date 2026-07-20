import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import MainLayout from "../../components/layout/MainLayout";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [departments, setDepartments] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewDept, setShowNewDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");

  const [showNewPosition, setShowNewPosition] = useState(false);
  const [newPositionTitle, setNewPositionTitle] = useState("");

  const roleOptions =
    currentUser?.role === "admin"
      ? [
          { value: "employee", label: "Employee" },
          { value: "manager", label: "Manager" },
          { value: "hr", label: "HR" },
          { value: "admin", label: "Admin" },
        ]
      : [
          { value: "employee", label: "Employee" },
          { value: "manager", label: "Manager" },
        ];

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "employee",
    firstName: "",
    lastName: "",
    phone: "",
    employeeId: "",
    department: "",
    jobPosition: "",
    joiningDate: "",
    employmentType: "full-time",
    baseSalary: "",
  });

  useEffect(() => {
    axiosInstance.get("/departments").then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => {
    if (form.department) {
      axiosInstance
        .get(`/job-positions?department=${form.department}`)
        .then((res) => setJobPositions(res.data));
    } else {
      setJobPositions([]);
    }
  }, [form.department]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateDepartment = async () => {
    if (!newDeptName || !newDeptCode) return;
    try {
      const res = await axiosInstance.post("/departments", {
        name: newDeptName,
        code: newDeptCode,
      });
      setDepartments((prev) => [...prev, res.data]);
      setForm((prev) => ({ ...prev, department: res.data._id, jobPosition: "" }));
      setShowNewDept(false);
      setNewDeptName("");
      setNewDeptCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create department");
    }
  };

  const handleCreateJobPosition = async () => {
    if (!newPositionTitle || !form.department) return;
    try {
      const res = await axiosInstance.post("/job-positions", {
        title: newPositionTitle,
        department: form.department,
      });
      setJobPositions((prev) => [...prev, res.data]);
      setForm((prev) => ({ ...prev, jobPosition: res.data._id }));
      setShowNewPosition(false);
      setNewPositionTitle("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job position");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const res = await axiosInstance.post("/employees", payload);
      navigate(`/employees/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F5DFF] focus:border-transparent transition bg-white disabled:bg-gray-50 disabled:text-gray-400";
  const labelClass = "block text-sm font-medium text-[#14171F] mb-1.5";

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <h1 className="font-['Space_Grotesk'] font-medium text-2xl text-[#14171F] mb-1">
          Add employee
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          If this email is already registered, we'll link this profile to their existing account.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="name@company.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Password <span className="text-gray-400 font-normal">(leave blank if this email already has an account)</span>
            </label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Employee ID</label>
              <input name="employeeId" value={form.employeeId} onChange={handleChange} required placeholder="EMP001" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department</label>

              {!showNewDept ? (
                <>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewDept(true)}
                    className="text-[#4F5DFF] text-xs font-medium mt-1.5 hover:underline"
                  >
                    + Add new department
                  </button>
                </>
              ) : (
                <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <input
                    placeholder="Department name (e.g. Engineering)"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Code (e.g. ENG)"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateDepartment}
                      className="bg-[#4F5DFF] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#3D48CC]"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewDept(false);
                        setNewDeptName("");
                        setNewDeptCode("");
                      }}
                      className="text-gray-500 text-xs font-medium px-3 py-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Job position</label>

              {!showNewPosition ? (
                <>
                  <select
                    name="jobPosition"
                    value={form.jobPosition}
                    onChange={handleChange}
                    disabled={!form.department}
                    className={inputClass}
                  >
                    <option value="">
                      {form.department ? "Select position" : "Select a department first"}
                    </option>
                    {jobPositions.map((p) => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewPosition(true)}
                    disabled={!form.department}
                    className="text-[#4F5DFF] text-xs font-medium mt-1.5 hover:underline disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    + Add new position
                  </button>
                </>
              ) : (
                <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <input
                    placeholder="Position title (e.g. Software Engineer)"
                    value={newPositionTitle}
                    onChange={(e) => setNewPositionTitle(e.target.value)}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateJobPosition}
                      className="bg-[#4F5DFF] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#3D48CC]"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewPosition(false);
                        setNewPositionTitle("");
                      }}
                      className="text-gray-500 text-xs font-medium px-3 py-1.5 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date of joining</label>
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Employment type</label>
              <select name="employmentType" value={form.employmentType} onChange={handleChange} className={inputClass}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Base salary</label>
            <input type="number" name="baseSalary" value={form.baseSalary} onChange={handleChange} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4F5DFF] text-white font-medium px-5 py-2.5 rounded-lg hover:bg-[#3D48CC] disabled:opacity-50 transition"
            >
              {loading ? "Creating..." : "Create employee"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="text-gray-600 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddEmployee;