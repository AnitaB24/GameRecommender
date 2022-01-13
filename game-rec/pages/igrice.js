import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";
import {withAuthSync} from "../utils/auth";

const Igrice = (props) => {

    return(
        <div>
            <Header/>
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
        return await response.json();
    } else {
        return await redirectOnError();
    }
};
export default withAuthSync(Igrice)