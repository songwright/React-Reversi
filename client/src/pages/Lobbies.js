import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "../components/Grid";
import Card from "../components/Card"
import CardHeader from "../components/CardHeader"
import CardBody from "../components/CardBody"
import API from "../utils/API"
import Avatar from '@material-ui/core/Avatar';

// Importing images
import profile_0 from "../img/profile_pics/profile_0.png"
import profile_1 from "../img/profile_pics/profile_1.png"
import profile_2 from "../img/profile_pics/profile_2.png"
import profile_3 from "../img/profile_pics/profile_3.png"
import profile_4 from "../img/profile_pics/profile_4.png"
import profile_5 from "../img/profile_pics/profile_5.png"
import profile_6 from "../img/profile_pics/profile_6.png"
import profile_7 from "../img/profile_pics/profile_7.png"
import profile_8 from "../img/profile_pics/profile_8.png"

const username = localStorage.getItem("username")

let profilePic = [
    profile_0,
    profile_1,
    profile_2,
    profile_3,
    profile_4,
    profile_5,
    profile_6,
    profile_7,
    profile_8,
]

const Lobbies = () => {
    const [state, setState] = useState({
        lobbies: []
    })

    useEffect(() => {
        API.getLobby().then(results => {
            if (results.data !== []) {
                setState({
                    lobbies: results.data
                })
            }
        })
    })



    return (
        <div>
            {state.lobbies.map(item => {
                return <h1>{item.name}</h1>
            })}
        </div>
    )
}

export default Lobbies;