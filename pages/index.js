import React, { useState } from 'react';
import Head from 'next/head';
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/captioned.css";
import styles from '../styles/Home.module.css';

function sendEmail(email) {
  const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${localStorage.user}`;
  window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

function Animal({ data }) {
  if (!data) return <p>Loading</p>;
  const { header, content, img } = data;
  return (
    <div>
      <h1 style={{ color: 'white', position: "absolute", zIndex: 4, top: '30%', left: '40%' }}>{header}</h1>
      <h2 style={{ color: 'white', textAlign: "center", top: '50%', left: '25%', position: "absolute", zIndex: 4 }}>{content}</h2>
      <img style={{ position: "fixed", zIndex: 3, left: 0, top: 0, width: "100%", height: "100%" }} alt="Питомец" src={img} />
    </div>
  );
}

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    fetch('/animals.json')
      .then(response => response.json())
      .then(data => setAnimals(data));
  }, []);

  function handleLogin() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email] && users[email].password === password) {
      setCurrentUser(users[email]);
      setShowModal(false);
      setEmail('');
      setPassword('');
    } else {
      alert("Неверные данные");
    }
  }

  function handleRegister() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (!users[email]) {
      users[email] = { name, surname, password };
      localStorage.setItem('users', JSON.stringify(users));
      alert("Регистрация успешна");
      setShowRegister(false);
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
      setShowModal(true);
    } else {
      alert("Пользователь уже существует");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Petto</title>
        <meta name="description" content="Социальная сеть для питомцев" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>{currentUser ? `${currentUser.name} ${currentUser.surname}` : 'Petto'}</h1>
        {!currentUser && <button onClick={() => setShowModal(true)}>Войти</button>}
        {!currentUser && <button onClick={() => setShowRegister(true)}>Регистрация</button>}
        <AwesomeSlider style={{ "--slider-height-percentage": "100%" }}>
          {animals.map((data, i) => (
            <div key={i} style={{ zIndex: 2 }} onClick={() => sendEmail(data?.email)}>
              <Animal data={data} />
            </div>
          ))}
        </AwesomeSlider>
      </main>

      {(showModal || showRegister) && (
        <div className={styles.modalOverlay} onClick={() => { setShowModal(false); setShowRegister(false); setEmail(''); setPassword(''); setName(''); setSurname(''); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            borderRadius: "10px",
            zIndex: 1000
          }}>
            {showModal && !showRegister && (
              <>
                <h2>Вход</h2>
                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Войти</button>
              </>
            )}
            {showRegister && (
              <>
                <h2>Регистрация</h2>
                <input type="text" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
                <input type="text" placeholder="Фамилия" value={surname} onChange={e => setSurname(e.target.value)} />
                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={handleRegister}>Зарегистрироваться</button>
              </>
            )}
            <button onClick={() => { setShowModal(false); setShowRegister(false); setEmail(''); setPassword(''); setName(''); setSurname(''); }}>Закрыть</button>
          </div>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999
          }}></div>
        </div>
      )}

      <footer className={styles.footer}>Petto, (c) 2022</footer>
    </div>
  );
}
