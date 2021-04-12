import React, {useRef} from "react";
import {Alert, Button, Form} from "react-bootstrap";
import './Login.css'
import {useDispatch} from "react-redux";
import {updateLoginStatus} from "../practice/practiceSlice";
import {useHistory} from "react-router-dom";

export const Login = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    // const loginStatus = useSelector(selectLoginStatus)
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const handleLogin = (event) => {
        event.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value
        if (email === "admin@flashcard.com" && password === "password") {
            dispatch(updateLoginStatus({isLoggedIn: "true", email}))
            history.push("/")
        } else {
            alert("wrong credentials")
        }
    }

    return (
        <div className='login-container'>
            <h4>Welcome to FlashCard</h4>
            <Form className='login-form'>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" ref={emailRef}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={passwordRef}/>
                </Form.Group>
                <Alert variant={'warning'}>
                    this is a demo version, use admin@flashcard.com and 'password' to log in
                </Alert>
                <Button variant="primary" type="submit" onClick={handleLogin}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}
