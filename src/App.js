import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Practice} from './features/practice/Practice';
import {Summary} from './features/practice/Summary'
import {Login} from "./features/pages/Login";
import {Collection} from "./features/pages/Collection";
import {Import} from "./features/pages/Import";

function App() {
    return (
        <div className='App'>
            <Router>
                <Switch>
                    <Route path="/practice/:id">
                        <Practice/>
                    </Route>
                    <Route path="/result">
                        <Summary/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/add">
                        <Import/>
                    </Route>
                    <Route path="/">
                        <Collection/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
