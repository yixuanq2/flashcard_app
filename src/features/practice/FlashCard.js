import React, {useState} from 'react'
import Countdown from "react-countdown";
import {Button, Form} from "react-bootstrap";
import "./FlashCard.css";
import PropTypes from 'prop-types';

export function FlashCard(props) {
    const [frontSide, setFrontSide] = useState(true)
    const [checkedOptions, setCheckedOptions] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault()
        setFrontSide(false)
        const answer = new Set(props.question.answer)
        let counter = 0
        for (let item of checkedOptions) {
            item = Number.parseInt(item)
            if (answer.has(item)) {
                counter++
            } else {
                counter = 0
                props.getFailQuestion()
                return
            }
        }
        if (checkedOptions.length === 0) {
            props.getFailQuestion()
        } else {
            props.getCorrectQuestion()
            props.updateScore(counter / answer.size * 10)
        }

    }

    const handleTimerEnds = () => {
        setFrontSide(false)
        props.getFailQuestion()
    }

    const handleNext = (event) => {
        event.preventDefault()
        props.nextQuestion()
        setFrontSide(true)
        setCheckedOptions([])
    }

    const handleSelect = (event) => {
        const id = event.target.id
        if (event.target.checked) {
            setCheckedOptions([...checkedOptions, id])
        } else {
            setCheckedOptions(checkedOptions.filter(selected => selected !== id))
        }
    }

    const {question, options, answer, time} = props.question
    // if (!question) return (<div/>);

    return (
        <div className="flip-container">
            <div className={frontSide ? "" : "cardClicked"}>
                <div className="front">
                    <Countdown key={Date.now()} date={Date.now() + time * 100} onComplete={handleTimerEnds}/>
                    <div className='question-title'><h5>{question}</h5></div>
                    <Form className='optionList'>
                        {
                            options.map((option, idx) =>
                                <Form.Check id={idx + 1} key={idx} type={'checkbox'} label={option}
                                            onChange={handleSelect}
                                            checked={checkedOptions.includes((idx + 1) + '')}/>
                            )
                        }
                    </Form>
                    <Button variant="primary" type="submit" className='cardButton'
                            onClick={handleSubmit}>Submit</Button>
                </div>
                <div className="back">
                    <div className='question-title'><h5>{question}</h5></div>
                    <Form className='optionList'>
                        {
                            options.map((option, idx) =>
                                <Form.Check
                                    className={answer.includes(idx + 1) ? 'correct' : 'incorrect'}
                                    id={idx + 1} key={idx} type={'checkbox'} label={option}
                                    onChange={handleSelect}
                                    checked={checkedOptions.includes((idx + 1) + '')}
                                />
                            )
                        }

                    </Form>
                    <Button variant="primary" onClick={handleNext} className='cardButton'>Next</Button>
                </div>

            </div>
        </div>
    )

}

FlashCard.propTypes = {
    question: PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
        answer: PropTypes.array.isRequired,
        time: PropTypes.number.isRequired
    }),
    isLast: PropTypes.bool
}