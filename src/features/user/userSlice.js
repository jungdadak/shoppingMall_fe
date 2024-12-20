import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
	"user/loginWithEmail",
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const response = await api.post("/auth/login", { email, password });
			//로그인페이지에서 처리
			sessionStorage.setItem("token", response.data.token);
			return response.data;
		} catch (error) {
			//실패시 생긴 에러를 reducer에 저장
			return rejectWithValue(error.error);
		}
	}
);

export const loginWithGoogle = createAsyncThunk(
	"user/loginWithGoogle",
	async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {
	sessionStorage.removeItem("token");
	dispatch(initialCart());
	dispatch({ type: "user/logout" });
};
export const registerUser = createAsyncThunk(
	"user/registerUser",
	async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
		try {
			const response = await api.post("/user", { email, name, password });
			// 성공 메세지, 로그인페이지 redirect
			dispatch(showToastMessage({ message: "회원가입 성공!", status: "success" }));
			navigate("/login");

			return response.data.data;
		} catch (error) {
			//실패 토스트 메시지 , 에러 저장
			dispatch(showToastMessage({ message: "회원가입 실패!", status: "error" }));
			return rejectWithValue(error.error);
		}
	}
);

export const loginWithToken = createAsyncThunk(
	"user/loginWithToken",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/user/me");
			return response.data;
		} catch (error) {
			return rejectWithValue(error.error);
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		user: null,
		loading: false,
		loginError: null,
		registrationError: null,
		success: false,
	},
	reducers: {
		clearErrors: (state) => {
			state.loginError = null;
			state.registrationError = null;
		},
		logout: (state) => {
			state.user = null;
			state.loading = false;
			state.loginError = null;
			state.registrationError = null;
			state.success = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.loading = false;
				state.registrationError = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.registrationError = action.payload;
			})
			.addCase(loginWithEmail.pending, (state) => {
				state.loading = true;
			})
			.addCase(loginWithEmail.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.loginError = null;
			})
			.addCase(loginWithEmail.rejected, (state, action) => {
				state.loading = false;
				state.loginError = action.payload;
			})
			.addCase(loginWithToken.fulfilled, (state, action) => {
				state.user = action.payload.user;
			});
	},
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
