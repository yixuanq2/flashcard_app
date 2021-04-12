import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    questionList: [],
    finalScore: 0,
    fetchedQuestionSet: -1,
    quizNum: 3,
    loginState: {
        isLoggedIn: false,
        email: ""
    },
    collectionList: [],
    uploadedCollection: {},
    uploadedCollectionInfo: []
}

export const fetchQuestions = createAsyncThunk(
    'practice/fetchByIdStatus',
    async (id) => {
        const response = await axios.get(`http://localhost:3000/question${id}.json`);
        // The value we return becomes the `fulfilled` action payload
        return {
            data: response.data,
            id
        };
    }
);

export const fetchCollections = createAsyncThunk(
    'practice/fetchCollections',
    async () => {
        const response = await axios.get("http://localhost:3000/collection.json");
        // The value we return becomes the `fulfilled` action payload
        return response.data.collection
    }
);

export const practiceSlice = createSlice({
    name: 'practice',
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            if (state.fetchedQuestionSet !== action.payload.id) {
                state.questionList = action.payload.data
                state.fetchedQuestionSet = action.payload.id
            }
            console.log(action.payload)
            console.log(state.questionList)
            console.log("this is a test")
        },
        updateFinalScore: (state, action) => {
            state.finalScore = Number.parseInt(action.payload)
        },
        updateQuestions: (state, action) => {
            state.questionList = action.payload
        },
        updateQuizNum: (state, action) => {
            state.quizNum = Number.parseInt(action.payload)
        },
        updateLoginStatus: (state, action) => {
            state.loginState = {
                isLoggedIn: (action.payload.isLoggedIn === "true"),
                email: action.payload.email
            }
        },
        addNewCollectionInfo: (state, action) => {
            const {id, name, question} = action.payload
            state.uploadedCollectionInfo.push({id, name})
            state.uploadedCollection[id] = question
        },
        updateQuestionsToUploadedCollection: (state, action) => {
            state.questionList = state.uploadedCollection[action.payload]
        },
        updateCollectionList: (state, action) => {
            state.collectionList = action.payload
        }
    },
    extraReducers: (builder => {
        builder
            .addCase(fetchQuestions.fulfilled, (state, action) => {

                if (state.fetchedQuestionSet !== action.payload.id) {
                    state.questionList = action.payload.data.data
                    state.fetchedQuestionSet = action.payload.id
                }

            })
            .addCase(fetchCollections.fulfilled, (state, action) => {
                state.collectionList = action.payload
            })
    })
})

export const {
    setQuestions,
    updateFinalScore,
    updateQuestions,
    updateQuizNum,
    updateLoginStatus,
    addNewCollectionInfo,
    updateQuestionsToUploadedCollection,
    updateCollectionList
} = practiceSlice.actions
export const selectAllQuestions = (state) => state.practice.questionList
export const selectQuestionNum = (state) => state.practice.quizNum
export const selectFinalScore = (state) => state.practice.finalScore
export const selectLoginStatus = (state) => state.practice.loginState
export const selectCollectionList = (state) => state.practice.collectionList
export const selectUploadedCollectionList = (state) => state.practice.uploadedCollectionInfo
export default practiceSlice.reducer
