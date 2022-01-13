import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import Footer from "../components/Footer";
import fetch from "isomorphic-unfetch";

export default function Home(props) {
    const array = Object.values(props)
    return (
        <div className={styles.container}>
            <Header/>
            <div className="container mb-4">
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col"/>
                                    <th scope="col">Igrica</th>
                                    <th scope="col"/>
                                    <th scope="col" className="text-center"/>
                                    <th scope="col" className="text-right"/>
                                    <th scope="col" className="text-right">Sajt igrice</th>
                                </tr>
                                </thead>
                                <tbody>
                                {array.map((game, ind) => {
                                    return (
                                        <tr key={ind}>
                                            <td><img style={{width: "100px", height: "70px"}} src={game.slika} alt={""}/></td>
                                            <td>{game.naziv}</td>
                                            <td/>
                                            <td/>
                                            <td className="text-right"/>
                                            <td className="text-right">
                                                <a href={game.link} target={"_blank"}>
                                                    <button className="btn btn-sm btn-danger"><i
                                                        className="fa fa-trash"/>Saznaj jos
                                                    </button>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
Home.getInitialProps = async () => {
    const apiUrl = "http://localhost:3000/get-all-games";

    const response = await fetch(apiUrl, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
    });
    if (response.status === 200) {
        return await response.json();
    }
};
