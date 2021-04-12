import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import 'bootstrap/dist/css/bootstrap.css'
import {
    fetchQuestions,
    selectAllQuestions,
    selectCollectionList,
    selectQuestionNum,
    updateFinalScore,
    updateQuestions,
    updateQuestionsToUploadedCollection
} from "./practiceSlice";
import {Redirect, useParams} from "react-router-dom";
import {ProgressBar} from "react-bootstrap";
import Countdown from "react-countdown";
import './Practice.css';
import {FlashCard} from "./FlashCard";
import {getRandomArr} from "../../helper";


export function Practice() {
    const allQuestions = useSelector(selectAllQuestions)
    const questionNum = useSelector(selectQuestionNum)
    const storeCollections = useSelector(selectCollectionList)
    const dispatch = useDispatch()
    const {id} = useParams()


    const [curIndex, setCurIndex] = useState(0)
    const [questionList, setQuestionList] = useState([])
    const [finalScore, setFinalScore] = useState(0)
    const [testStartTime, setTestStartTime] = useState(0)
    const [isLast, setIsLast] = useState(false)

    const getFailQuestion = () => {
        let obj = questionList[curIndex]
        let {correct_count, level} = obj
        if (correct_count === 0 && level > 1) {
            level -= 1
        } else if (correct_count > 0) {
            correct_count -= 1
        }
        obj = {...obj, level: level, correct_count: correct_count}
        const arr = questionList.map(item => {
            if (item.id === obj.id) {
                return obj
            } else {
                return item
            }
        })
        setQuestionList(arr)
    }
    const getCorrectQuestion = () => {
        let obj = questionList[curIndex]
        let {correct_count, level} = obj
        const levelCounts = [1, 2, 4, 8, 16]
        if (correct_count + 1 === levelCounts[level - 1]) {
            level = Math.min(level + 1, 5)
        } else {
            correct_count += 1
        }
        obj = {...obj, level: level, correct_count: correct_count}
        const arr = questionList.map(item => {
            if (item.id === obj.id) {
                return obj
            } else {
                return item
            }
        })
        setQuestionList(arr)
    }
    const updateScore = (value) => {
        const score = finalScore
        setFinalScore(score + value)
    }
    const resetQuestionList = () => {
        let questionByLevel = [
            allQuestions.filter((item) => item.level === 1),
            allQuestions.filter((item) => item.level === 2),
            allQuestions.filter((item) => item.level === 3),
            allQuestions.filter((item) => item.level === 4),
            allQuestions.filter((item) => item.level === 5)
        ]
        let selected = []
        let selectCount = [16 / 31, 8 / 31, 4 / 31, 2 / 31, 1 / 31].map((r, idx) => Math.min(Math.floor(questionNum * r), questionByLevel[idx].length))
        let firstSelection = selectCount.reduce((accumulator, value) => accumulator + value, 0)
        if (firstSelection < questionNum) {
            let remaining = questionNum - firstSelection
            selectCount = selectCount.map((c, idx) => {
                if (questionByLevel[idx].length > c && remaining > 0) {
                    const count = questionByLevel[idx].length - c >= remaining ? c + remaining : questionByLevel[idx].length
                    remaining -= count - c
                    return count
                }
                return c
            })
        }
        for (let i = 0; i < questionByLevel.length; i++) {
            selected.push(...getRandomArr(questionByLevel[i], selectCount[i]))
        }
        setQuestionList(selected)
        setCurIndex(0)
        setTestStartTime(Date.now)
    }
    const endPractice = () => {
        setIsLast(true)
        dispatch(updateFinalScore(finalScore))
        let map = new Map()
        for (let item of questionList) {
            map.set(item.id, item)
        }
        let i
        let arr = allQuestions.slice(0)
        for (i = 0; i < arr.length; i++) {
            let obj = arr[i]
            if (map.has(obj.id)) {
                arr[i] = map.get(obj.id)
            }
        }
        dispatch(updateQuestions(arr))
    }
    const nextQuestion = () => {
        if (questionList == null || curIndex === questionList.length - 1) {
            endPractice()
        } else {
            setCurIndex(curIndex + 1)
        }
    }

    const fetchQuestionFromServer = () => {
        const storeCollectionId = storeCollections.map(i => i.id + '')
        console.log(storeCollectionId)
        if (storeCollectionId.includes(id)) {
            dispatch(fetchQuestions(id))
        } else {
            console.log("using uploaded")
            dispatch(updateQuestionsToUploadedCollection(id))
        }
        resetQuestionList()
    }

    useEffect(() => {
            fetchQuestionFromServer()
        },
        [allQuestions]
    )


    if (isLast) {
        return (
            <Redirect to={'/result'}/>
        )
    }
    if (questionList.length === 0) return (<div/>)
    return (
        <div className='attempt-container'>
            <ProgressBar now={curIndex} max={questionList.length}/>
            <Countdown key={1} className='practice-timeout' date={testStartTime + 120000}
                       onComplete={endPractice}/>
            <FlashCard
                question={questionList[curIndex]} isLast={false}
                getFailQuestion={getFailQuestion} getCorrectQuestion={getCorrectQuestion}
                updateScore={updateScore} nextQuestion={nextQuestion}/>

        </div>)

}
