import React from "react"
import "./Summary.css"
import {useSelector} from "react-redux"
import {Button} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {selectFinalScore} from "./practiceSlice";


export const Summary = (props) => {
    const history = useHistory();
    const score = useSelector(selectFinalScore)

    const handleClick = () => {
        history.push("/practice");
    }
    return (
        <div className='result-container'>
            <h1>Congratulation! You've finished all questions.</h1>
            <h3>Your final score is </h3>
            <h1>{score}</h1>
            <Button onClick={handleClick}>Return</Button>
        </div>
    )
}

