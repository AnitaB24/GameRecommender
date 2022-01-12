import Header from '../components/Header';
import Footer from '../components/Footer';
import {login} from '../utils/auth';
import React, {useState} from 'react'

export function Prijava() {

    const [userData, setUserData] = useState({username: '', sifra: '', error: ''})

    async function handleSubmit(event) {
        event.preventDefault()
        setUserData(Object.assign({}, userData, {error: ''}))

        const username = userData.username;
        const url = 'http://localhost:3000/get-user'

        const response = await fetch(url, {
            method: 'POST',
            headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            body: JSON.stringify({username}),
        })
        if (response.status === 200) {
            console.log('Login success.')
            const {token} = {'token':username};
            await login({token})
        } else {
            alert('Neuspesno logovanje.')
            let error = new Error(response.statusText)
            error.message = JSON.stringify(response)
        }

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
                                <h4 className="card-title mt-2">Prijava</h4>
                            </header>
                            <article className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label>Korisnicko ime</label>
                                            <input id="inputLogin" type="text"
                                                   className="form-control"
                                                   placeholder="" required
                                                   value={userData.username}
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
                                            <input id="inputPasswordLogin" type="password" className="form-control"
                                                   placeholder="" required value={userData.sifra}
                                                   onChange={event =>
                                                       setUserData(
                                                           Object.assign({}, userData, {sifra: event.target.value})
                                                       )
                                                   }/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group">
                                        <button id="loginBtn" type="submit"
                                                className="btn btn-primary btn-block"> Prijavi se
                                        </button>
                                    </div>
                                    {userData.error && <p className="error">Error: {userData.error}</p>}
                                </form>
                            </article>
                            <div className="border-top card-body text-center">Nemas nalog? <a href='/registracija'>Registruj
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

export default Prijava