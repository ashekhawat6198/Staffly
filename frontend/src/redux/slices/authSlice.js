import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"

export const loginUser=createAsyncThunk(
    "auth/login",
    async({email,password},{rejectWithValue})=>{
      try{
          const res=await axiosInstance.post("/auth/login",{email,password});
          localStorage.setItem("token",res.data.token);
          return res.data;          
         }catch(err){
           return rejectWithValue(err.response?.data?.message || "Login failed")
        }
    }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", { email, password, role });
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    } catch (err) {
      localStorage.removeItem("token");
      return rejectWithValue("Session expired");
    }
  }
);



const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error:null
    },
    
    reducers:{
        logout:(state)=>{
            localStorage.removeItem("token");
            state.user=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        // Login
        .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
       .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // Fetch current user (on app load / refresh)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;