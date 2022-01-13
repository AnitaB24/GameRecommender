import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useState} from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";
import {withAuthSync} from "../utils/auth";

const Anketa = (props) => {

    const [userData, setUserData] = useState({
        surveyName: '',
        pol: 'Muski',
        gamePlayDays: '1-3',
        gamerType: 'Casual',
        platform: 'PC/Mac',
        power15: 1,
        backstory15: 1,
        trophies15: 1,
        missions15: 1,
        oneup15: 1,
        pretend15: 1,
        hardgame15: 1,
        armory15: 1,
        sport15: 1,
        reflex15: 1,
        vs15: 1

    })

    async function handleSubmit(event) {
        event.preventDefault()
        setUserData(Object.assign({}, userData, {error: ''}))

        const surveyName = userData.surveyName;

        if(surveyName === '')
        {
            alert('Niste pravilno popunili anketu!')
            return;
        }
        const pol = userData.pol;
        const gamePlayDays = userData.gamePlayDays;
        const gamerType = userData.gamerType;
        const platform = userData.platform;
        const power15 = userData.power15;
        const backstory15 = userData.backstory15;
        const trophies15 = userData.trophies15;
        const missions15 = userData.missions15;
        const oneup15 = userData.oneup15;
        const pretend15 = userData.pretend15;
        const hardgame15 = userData.hardgame15;
        const armory15 = userData.armory15;
        const sport15 = userData.sport15;
        const reflex15 = userData.reflex15;
        const vs15 = userData.vs15;
        const url = 'http://localhost:3000/set-survey'
        const url_conn = 'http://localhost:3000/set-survey-connection';

        var minValue = 0;
        var maxValue = 0;
        var avgValue = 0;

        if (pol === 'Muski') {
            minValue += 2
            maxValue += 20
        } else if (pol === 'Zenski') {
            minValue += 1.5
            maxValue += 15
        } else {
            minValue += 1
            maxValue += 10
        }
        if (gamePlayDays === '1-3') {
            minValue += 2
            maxValue += 20
        } else if (gamePlayDays === '4-5') {
            minValue += 1.5
            maxValue += 15
        } else {
            minValue += 1
            maxValue += 10
        }
        if (gamerType === 'Casual') {
            minValue += 2
            maxValue += 20
        } else if (gameType === 'Midlevel') {
            minValue += 1.5
            maxValue += 15
        } else {
            minValue += 1
            maxValue += 10
        }
        if (platform === 'PC/Mac') {
            minValue += 2
            maxValue += 20
        } else if (platform === 'Handheld/Mobile') {
            minValue += 1.5
            maxValue += 15
        } else if (platform === 'Console') {
            minValue += 1
            maxValue += 10
        } else {
            minValue += 0.5
            maxValue += 5
        }
        minValue += power15 + backstory15 + trophies15 + missions15 + oneup15 + pretend15 + hardgame15 + armory15 + sport15 + reflex15 + vs15;
        maxValue += (power15 + backstory15 + trophies15 + missions15 + oneup15 + pretend15 + hardgame15 + armory15 + sport15 + reflex15 + vs15) * 4;
        avgValue = (minValue + maxValue) / 2;

        async function postData(url = '') {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "naziv": surveyName,
                    "gVrednost": maxValue,
                    "dVrednost": minValue,
                    "avgVrednost": avgValue
                })
            })
            return response
        }

        postData(url)
            .then(async data => {
                const response = await fetch(url_conn, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        "username": props.token,
                        "nazivAnkete": surveyName,
                    })
                }).then(async data => {
                    const response = await fetch("http://localhost:3000/get-all-type-of-games", {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                    }).then(data => {
                        return data.json();
                    })
                    response.map(async game => {
                        if (game.gVal.low >= maxValue && game.dVal.low <= minValue) {
                            await fetch("http://localhost:3000/set-recomended-category", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                                body: JSON.stringify({
                                    "nazivTipa": game.naziv,
                                    "nazivAnkete": surveyName,
                                    "precizno": 70
                                })
                            })
                        }
                    })
                })
            })
    }

    return (
        <div>
            <Header/>
            <div className="d-flex justify-content-center" style={{marginTop: "10px"}}>
                <div className="card card-cascade" style={{textAlign: "center"}}>

                    <div className="card-body card-body-cascade text-center">

                        <input type="text" className="form-control" placeholder="Unesite naziv ankete"
                               value={userData.surveyName}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {surveyName: event.target.value})
                                   )
                               }
                               required/>
                        <hr/>
                        <i className="fas fa-poll-h fa-3x blue-text mb-2"/>
                        <p className="font-weight-normal">Popunite anketu</p>
                        <p>Na osnovu rezultata cemo Vam preporuciti igrice
                        </p>
                    </div>
                    <hr/>
                    <div className="form-group col" style={{padding: "5px"}}>
                        <label>Unesite Vas pol</label>
                        <select className="form-control" required
                                value={userData.pol}
                                onChange={event =>
                                    setUserData(
                                        Object.assign({}, userData, {pol: event.target.value})
                                    )
                                }
                        >
                            <option>Muski</option>
                            <option>Zenski</option>
                            <option>Drugo</option>
                        </select>
                    </div>
                    <div className="form-group col" style={{padding: "5px"}}>
                        <label>Koliko dana u nedelji igrate igrice vise od sat vremena</label>
                        <select className="form-control" required
                                value={userData.gamePlayDays}
                                onChange={event =>
                                    setUserData(
                                        Object.assign({}, userData, {gamePlayDays: event.target.value})
                                    )
                                }
                        >
                            <option>1-3</option>
                            <option>4-5</option>
                            <option>6-7</option>
                        </select>
                    </div>
                    <div className="form-group col" style={{padding: "5px"}}>
                        <label>Za kakvog se gejmera smatrate</label>
                        <select className="form-control" required
                                value={userData.gamerType}
                                onChange={event =>
                                    setUserData(
                                        Object.assign({}, userData, {gamerType: event.target.value})
                                    )
                                }
                        >
                            <option>Casual</option>
                            <option>Midlevel</option>
                            <option>Hardcore</option>
                        </select>
                    </div>
                    <div className="form-group col" style={{padding: "5px"}}>
                        <label>Koju platformu preferirate</label>
                        <select className="form-control" required
                                value={userData.platform}
                                onChange={event =>
                                    setUserData(
                                        Object.assign({}, userData, {platform: event.target.value})
                                    )
                                }
                        >
                            <option>PC/Mac</option>
                            <option>Handheld/Mobile</option>
                            <option>Console</option>
                            <option>VR</option>
                        </select>
                    </div>
                    <hr/>
                    <p>Na sledeca pitanja odgovorite 1-5 koliko Vam je bitno</p>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Da postanete sto mocniji/a u igrici</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.power15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {power15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Da karakteri u igrice imaju dobre backstory-je i personality-je</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.backstory15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {backstory15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Da dobijete sva moguca priznanja i trofeje u igri</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.trophies15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {trophies15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Da predjete sve moguce misije u igrici</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.missions15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {missions15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Da budete sto mocniji u odnosu na druge igrace</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.oneup15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {oneup15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <hr/>
                    <p>Na sledeca pitanja odgovorite 1-5 koliko cesto</p>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Se pretvarate da ste karakter iz igrice</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.pretend15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {pretend15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Uzimate sto teze misije</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.hardgame15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {hardgame15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <hr/>
                    <p>Na sledeca pitanja odgovorite 1-5 koliko uzivate u</p>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Oruzja i eksplozije</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.armory15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {armory15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Sport</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.sport15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {sport15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Igrama koje zahtevaju dosta brze reakcije i reflekse</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.reflex15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {reflex15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <div className="col form-group" style={{padding: "5px"}}>
                        <label>Igrama protiv drugih igraca</label>
                        <input type="number" min={1} max={5} className="form-control" placeholder=""
                               value={userData.vs15}
                               onChange={event =>
                                   setUserData(
                                       Object.assign({}, userData, {vs15: event.target.value})
                                   )
                               }
                               required/>
                    </div>
                    <hr/>
                    <div className="survey-footer clearfix d-flex justify-content-center">
                        <a onClick={handleSubmit} type="button"
                           className="btn btn-primary waves-effect waves-light ml-3 mb-3">Popunjeno
                            <i className="fa fa-paper-plane ml-1"/>
                        </a>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

Anketa.getInitialProps = async (ctx) => {
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
        return await response.json();
    } else {
        return await redirectOnError();
    }
};
export default withAuthSync(Anketa)