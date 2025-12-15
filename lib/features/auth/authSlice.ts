import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    company: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    company: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ company: any }>) => {
            state.company = action.payload.company;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        logout: (state) => {
            state.company = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;