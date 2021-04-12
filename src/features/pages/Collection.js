import React, {useEffect, useState} from "react";
import {Button, Image, OverlayTrigger, Popover} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    selectLoginStatus,
    selectQuestionNum,
    selectUploadedCollectionList,
    updateCollectionList,
    updateLoginStatus,
    updateQuizNum
} from "../practice/practiceSlice";
import axios from "axios";
import "./Collection.css"

export function Collection(props) {
    const dispatch = useDispatch()
    const [collectionList, setCollectionList] = useState([])
    const logInState = useSelector(selectLoginStatus)
    const questionNum = useSelector(selectQuestionNum)
    const uploadedCollection = useSelector(selectUploadedCollectionList)
    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">This is a demo version</Popover.Title>
            <Popover.Content>
                Registration is unavailable in this version
            </Popover.Content>
        </Popover>
    );

    const fetchCollection = async () => {
        let response = await axios.get("http://localhost:3000/collection.json")
        setCollectionList(response.data.collection)
        dispatch(updateCollectionList(response.data.collection))
    }

    const loginStateWidget = () => {
        console.log(logInState)
        if (logInState.isLoggedIn) {
            return <div className='sign-in-user'>{logInState.email}
                {/*<Button onClick={() => {*/}
                {/*    history.push('/add')*/}
                {/*}}>Import</Button>*/}
                <Button onClick={() => {
                    dispatch(updateLoginStatus({isLoggedIn: false, email: ""}))
                }}>Sign out</Button>
            </div>
        }
        return (<div className='login-widget'>
            <Link to='/login'><Button>Sign In</Button> </Link>
            <OverlayTrigger trigger="click" overlay={popover}>
                <Link to='#'><Button>Register</Button></Link>
            </OverlayTrigger>
        </div>)
    }

    useEffect(() => {
        fetchCollection()
    }, [])

    return (
        <div className='collection-container'>
            {loginStateWidget()}
            <div>
                <h2>All Collections</h2>
                <div>
                    <label className="form-label">Number of question per test :{questionNum} </label>
                    <input className='question-number-selector' type='range' min={1} max={20} step={1}
                           defaultValue={questionNum}
                           onChange={(e) => dispatch(updateQuizNum(e.target.value))}/>
                </div>
                <hr/>
                {
                    collectionList && [...collectionList, ...uploadedCollection].map((item, idx) => {
                            return (
                                <Link key={idx} to={'/practice/' + item.id} className='collection-item'>
                                    <div>
                                        <Image
                                            className='collection-image'
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Closed_Book_Icon.svg/1200px-Closed_Book_Icon.svg.png"
                                            roundedCircle/>
                                        <div className='collection-caption'><p>{item.name}</p></div>
                                    </div>
                                </Link>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}
