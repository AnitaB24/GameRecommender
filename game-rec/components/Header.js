const Header = () => {
    return (
        <header className='p-3 bg-dark text-white'>
            <div className='container'>
                <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>
                    <a
                        href='/'
                        className='d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none'
                    >
                        <img /*src={'/images/logo.jpg'}*/ alt={""}/>
                    </a>

                    <ul className='nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0'>
                        <li>
                            <a href='/' className='nav-link px-2 text-secondary'>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href='/igrice' className='nav-link px-2 text-white'>
                                Igrice
                            </a>
                        </li>
                        <li>
                            <a href='/anketa' className='nav-link px-2 text-white'>
                                Anketa
                            </a>
                        </li>

                    </ul>

                    <div className='text-end'>
                        <a href={'/profil'}>
                            <button type='button' className='btn btn-outline-light me-2'>
                                Profil
                            </button>
                        </a>
                        <a href={'/prijava'}>
                            <button type='button' className='btn btn-outline-light me-2'>
                                Prijava
                            </button>
                        </a>
                        <a href={'/registracija'}>
                            <button type='button' className='btn btn-warning'>
                                Registracija
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;