import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useState} from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";
import {withAuthSync} from "../utils/auth";

const Igrice = (props) => {

    const [userData, setUserData] = useState({
        nazivAnkete: ''
    })

    const array = Object.values(props);
    array.pop();

    async function handleSubmit(event) {
        event.preventDefault()
        setUserData(Object.assign({}, userData, {error: ''}))

        const surveyName = userData.nazivAnkete;
        if(surveyName === '')
            return;
        const url = 'http://localhost:3000/get-recomended-games'

        async function postData(url = '') {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "username": props.token,
                    "nazivAnkete": surveyName,
                })
            })
            return response.json()
        }
        postData(url)
            .then(data => {
                console.log(data)
            });
    }

    return(
        <div>
            <Header/>
            <div className={'card card-cascade container rounded bg-white mt-5 mb-5 d-flex justify-content-center'} style={{maxWidth:'200px'}}>
                <p>Izaberite Vasu anketu:</p>
                <hr/>
                <div style={{padding: "5px"}}>
                <select value={userData.nazivAnkete} style={{width:"100%"}}
                        onChange={event =>
                            setUserData(
                                Object.assign({}, userData, {nazivAnkete: event.target.value})
                            )
                        }>
                    {array.map(type=>{
                        return <option key={Math.random()}>{type}</option>
                    })}
                </select>
                </div>
                <button onClick={handleSubmit}>Prikazati preporucene igrice</button>
            </div>
            <Footer/>
        </div>
    )
}
Igrice.getInitialProps = async (ctx) => {
    const token = nextCookie(ctx);
    const apiUrl = "http://localhost:3000/get-user-by-username";

    const redirectOnError = () =>
        typeof window !== "undefined"
            ? Router.push("/prijava")
            : ctx.res.writeHead(302, {Location: "/prijava"}).end();

    const response = await fetch(apiUrl, {
        method:'POST',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body:JSON.stringify({token}),
    });
    if (response.status === 200) {
        const response2 = await fetch("http://localhost:3000/get-user-surveys", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                username:token.token
            })
        });
        if(response2.status === 200)
        {
            return response2.json();
        }
    } else {
        return await redirectOnError();
    }
};
export default withAuthSync(Igrice)