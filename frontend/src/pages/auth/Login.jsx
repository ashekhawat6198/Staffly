import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from "../../redux/slices/authSlice.js"
import { useNavigate, Link } from "react-router-dom"

const StatusCard = () => {
  const [time, setTime] = useState(new Date());
  const {user} =useSelector((state)=>state.auth)
  const navigate=useNavigate();
  useEffect(()=>{
       if(user){
        navigate("/")
       }
  },[user])

  useEffect(() => {
     const timer = setInterval(() => setTime(new Date()), 1000);
  // setInterval built in JS function that run on every x milliseconds 1000=1 sec so on every one second it runs 
  // setTime and upadates the time   
    return () => clearInterval(timer);
  }, []);

   // fomatting time and date nicely
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/50 text-xs font-['IBM_Plex_Mono'] tracking-wide">{dateStr}</span>
        <span className="text-white font-['IBM_Plex_Mono'] text-sm">{timeStr}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC857] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFC857]"></span>
        </span>
        <span className="text-white text-sm">Attendance tracked in real time</span>
      </div>

      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-white/50 text-xs font-['IBM_Plex_Mono']">
          <span>Check in</span>
          <span>Approve leave</span>
          <span>Run payroll</span>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen flex font-sans">

      {/* Left panel — brand + signature element */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#14171F] flex-col justify-between items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10 top-8 left-[-30px]">
          <span className="text-white font-['Space_Grotesk'] font-semibold text-2xl tracking-tight">Staffly</span>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <h1 className="text-white font-['Space_Grotesk'] font-medium text-4xl leading-tight max-w-md">
           "One place for your whole team's day."
          </h1>
          <p className="text-white/50 text-base max-w-sm">
            Attendance, leave, and payroll — tracked in real time, in one place.
          </p>
          <StatusCard />
        </div>

        <div className="relative z-10 text-white/30 text-xs font-['IBM_Plex_Mono']">
          © 2026 Staffly
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 bg-[#FAF9F6] flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <span className="text-[#14171F] font-['Space_Grotesk'] font-semibold text-2xl">Staffly</span>
          </div>

          <h2 className="font-['Space_Grotesk'] font-medium text-2xl text-[#14171F] mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">Enter your details to access your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#14171F] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F5DFF] focus:border-transparent transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#14171F] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F5DFF] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4F5DFF] text-white font-medium py-2.5 rounded-lg hover:bg-[#3D48CC] disabled:opacity-50 transition"
          >
            "Sign in"
          </button>

          <p className="text-sm text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#4F5DFF] font-medium hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login