import {configureStore} from '@reduxjs/toolkit';
import practiceReducer from '../features/practice/practiceSlice'

export const store = configureStore({
    reducer: {
        practice: practiceReducer,

    },
});
