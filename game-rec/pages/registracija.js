import Header from '../components/Header';
import Footer from '../components/Footer';
import {useState} from "react";
import Router from "next/router";

function Registracija() {

    const [userData, setUserData] = useState({
        ime: '',
        prezime: '',
        username: '',
        email: '',
        sifra: '',
        sifraProvera: ''
    })

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    async function handleSubmit(event) {
        event.preventDefault()
        setUserData(Object.assign({}, userData, {error: ''}))

        const ime = userData.ime;
        const prezime = userData.prezime;
        const username = userData.username;
        const email = userData.email;
        const sifra = userData.sifra;
        const sifraProvera = userData.sifraProvera;
        const url = 'http://localhost:3000/set-user'

        if (ime === '' || prezime === '' || username === '' || email === '' || sifra === '' || sifraProvera === '') {
            alert("Niste popunili sva neophodna polja!");
            return;
        }

        if (!validateEmail(email)) {
            alert("Unesite validan mejl!");
            return;
        }

        if (sifra !== sifraProvera) {
            alert("Niste uneli isti password!");
            return;
        }

        async function postData(url = '') {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "ime": ime,
                    "prezime": prezime,
                    "username": username,
                    "email": email,
                    "sifra": sifra
                })
            })
            return response
        }

        postData(url)
            .then(data => {
                Router.push("/prijava");
            });
    }

    return (
        <main className='d-flex flex-column min-vh-100'>
            <Header/>
            <br/>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <header className="card-header">
                                <h4 className="card-title mt-2">Registracija</h4>
                            </header>
                            <article className="card-body">
                                <form>
                                    <h5 className="card-title mt-4"> Licni podaci </h5>
                                    <hr/>
                                    <div className="form-row">
                                        <div className="col form-group">
                                            <label>Ime </label>
                                            <input id="inputName" type="text" className="form-control" placeholder=""
                                                   required value={userData.ime}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {ime: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                        <div className="col form-group">
                                            <label>Prezime</label>
                                            <input id="inputLastName" type="text" className="form-control"
                                                   placeholder=" " required value={userData.prezime}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {prezime: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label>Email adresa</label>
                                            <input id="inputEmailOne" type="email" className="form-control"
                                                   placeholder="" required value={userData.email}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {email: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                    </div>
                                    <h5 className="card-title mt-4"> Podaci za prijavu </h5>
                                    <hr/>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label>Korisnicko ime</label>
                                            <input id="inputUserName" type="text" className="form-control"
                                                   placeholder="" required value={userData.username}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {username: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label>Sifra</label>
                                            <input id="inputPasswordOne" type="password" className="form-control"
                                                   placeholder="" required value={userData.sifra}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {sifra: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label>Ponovi sifru</label>
                                            <input id="inputPasswordTwo" type="password" className="form-control"
                                                   placeholder="" required value={userData.sifraProvera}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {sifraProvera: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group">
                                        <button id="registerBtn" type="submit"
                                                className="btn btn-primary btn-block" onClick={handleSubmit}> Registruj
                                            se
                                        </button>
                                    </div>
                                    <br/>
                                    <small className="text-muted">Klikom na `Registruj se` dugme, potvrdjujes da
                                        prihvatas
                                        nase <br/> <a href=""> Uslove koriscenja. </a> </small>
                                </form>
                            </article>
                            <div className="border-top card-body text-center">Vec imas nalog? <a href="/prijava">Prijavi
                                se</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    );
}

export default Registracija