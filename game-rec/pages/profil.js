import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";
import {withAuthSync} from "../utils/auth";

const Profil = (props) => {
    const {
        ime,
        prezime,
        username
    } = props.body;

    var src = "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg";

    return (
        <div>
            <Header/>
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5"><img
                            className="rounded-circle mt-5" width="150px"
                            src={src} alt={""}/><span
                            className="font-weight-bold">{ime} {prezime}</span><span
                            className="text-black-50">{username}</span><span> </span></div>
                    </div>
                </div>
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
        method:'POST',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body:JSON.stringify({token}),
    });
    if (response.status === 200) {
        return await response.json();
    } else {
        return await redirectOnError();
    }
};
export default withAuthSync(Profil)