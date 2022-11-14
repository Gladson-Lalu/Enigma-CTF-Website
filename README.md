This is the website developed for the _Enigma CTF_, organized by the **Tinkerhub AEC** on our campus.

## About CTF

In computer security, **CTF** (Capture The Flag) is an exercise in deliberately hiding “flags” in vulnerable programs or websites. Typically, CTFs serve as an educational exercise to give participants experience in securing a machine, as well as to perform and respond to attacks similar to those seen in the real world. The machine enigma inspired the term “enigma”, a cipher device developed and used in the early to mid-twentieth century to protect commercial, diplomatic and military communications.

## How We Conducted It

We conducted the Enigma CTF to get newcomers and second-year students to know their campus and gain team experience by solving challenges. Several QR codes hid in unnoticeable places on campus. If they scan a QR code, they will receive a riddle, and once the riddle is answered correctly, places to visit next will be shown according to their current level. They have to complete all the challenges at one level to get promoted to the next level..

## [Live Site](https://enigmaaec.live)

## About The Technology

HTML, CSS, JavaScript and Bootstrap are used for the frontend development and Express and NodeJs are used for the backend of the website. MongoDB is used as the Database and Google spreadsheet is used to manage the user registration and the CTF questions.

#### Dependencies:

- bcrypt
- body-parser
- cookie-parser
- ejs
- express
- google-spreadsheet
- jsonwebtoken
- mongoose

#### Pages:

1.  Login
2.  Register
3.  Leaderboard
4.  About
5.  Instructions
6.  Question Page

## Install and Use:

```
git clone https://github.com/TinkerHub-AEC/CTF-Website.git
```

```
npm install .
```

#### Now you needed to do

- Setup a Mongodb database
- setup a Google spreadsheet for the registeration of participants (Registeration process can be done by google form)
- setup a Google spreadsheet to handle the questions(Since we setting up the google spreadsheet, we can add or modify the questions in googlesheet feasibly and refresh the question cache by '_/refreshQuestion_' route)
- Replace the config,js
- Add your Google Developer Autentication Key(Google Spreadsheet and Google Drive API Permission Required) in services folder

```
npm start
```
