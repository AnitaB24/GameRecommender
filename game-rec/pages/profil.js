import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useState} from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";
import {withAuthSync} from "../utils/auth";

const Profil = (props) => {

    const [userData, setUserData] = useState({
        nazivAnkete: ''
    })

    const token = props.token;

    const array = Object.values(props);
    array.pop();

    async function handleSubmit(event) {
        event.preventDefault()
        setUserData(Object.assign({}, userData, {error: ''}))

        const surveyName = userData.nazivAnkete;

        const response = await fetch("http://localhost:3000/delete-survey", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({"nazivAnkete": surveyName}),
        }).then(r => {
            alert("Uspesno brisanje!");
            window.location.reload(false);
        });
    }

    var src = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

    return (
        <div>
            <Header/>
            <div className="card card-cascade container rounded bg-white mt-5 mb-5 d-flex justify-content-center">
                <div className="row">
                    <div>
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img
                            className="rounded-circle mt-5" width="150px"
                            src={src} alt={""}/><span
                            className="text-black-50">{token}</span><span> </span></div>
                    </div>
                </div>
            </div>
            <div className={'card card-cascade container rounded bg-white mt-5 mb-5 d-flex justify-content-center'}
                 style={{maxWidth: '200px'}}>
                <p>Izaberite Vasu anketu:</p>
                <hr/>
                <div style={{padding: "5px"}}>
                    <select value={userData.nazivAnkete} style={{width: "100%"}}
                            onChange={event =>
                                setUserData(
                                    Object.assign({}, userData, {nazivAnkete: event.target.value})
                                )
                            }>
                        {array.map(type => {
                            return <option key={Math.random()}>{type}</option>
                        })}
                    </select>
                </div>
                <button onClick={handleSubmit}>Obrisite anketu</button>
            </div>
            <Footer/>
        </div>
    )
    // return(
    //     <div></div>
    // )
}
Profil.getInitialProps = async (ctx) => {
    const token = nextCookie(ctx);
    const apiUrl = "http://localhost:3000/get-user-by-username";

    const redirectOnError = () =>
        typeof window !== "undefined"
            ? Router.push("/prijava")
            : ctx.res.writeHead(302, {Location: "/prijava"}).end();

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({token}),
    });
    if (response.status === 200) {
        const response2 = await fetch("http://localhost:3000/get-user-surveys", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                username: token.token
            })
        });
        if (response2.status === 200) {
            return response2.json();
        }
    } else {
        return await redirectOnError();
    }
};
export default withAuthSync(Profil)