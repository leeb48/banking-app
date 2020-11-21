<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
    <img src="plaid-logo.png" alt="Logo" width="200" height="80">

  <h3 align="center">Bank Spending Tracker</h3>

  <p align="center">
    A personal spending tracker built with plaid
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

Link to working demo here

Click below to see a video of the app.
[![Link to demo](http://img.youtube.com/vi/YMFq5zJW_OA/0.jpg)](https://www.youtube.com/watch?v=YMFq5zJW_OA&ab_channel=BongLee)

A personal banking app built with MERN stack along with TypeScript. The Banking App provides a way for users to log into multiple banks from a single dashboard. Users can view their transaction history as well as a graphical breakdown of thieir spending patterns for all of their accounts. Furthermore the Banking App provides a way for users to set budgets on their accounts to help promote a better spending habit. The robust Plaid API ensures that everything is secure and safe.

### Built With

- [NodeJS](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Material-UI](https://material-ui.com/)
- [Plaid](https://plaid.com/)
- [JWT](https://jwt.io/)
- [Kubernetes](https://kubernetes.io/) (For Development Only)
- [Skaffold](https://skaffold.dev/) (For Development Only)

<!-- GETTING STARTED -->

## Getting Started

- Required environment variables

```sh
JWT_KEY=
PLAID_CLIENT_ID=
PLAID_SECRET=
MONGO_ATLAS=
```

JWT_KEY can be any string. PLAID_CLIENT_ID and PLAID_SECRET can be obtained through https://plaid.com/. For testing in sandbox you can use the ones provided at https://dashboard.plaid.com/overview/sandbox. Running the app in sandbox mode populates the app with sample test data.

### Setting up Plaid Client

- Plaid Client's environment must be set to either 'sandbox' or 'development' depending on which type of 'PLAID_SECRET' was used.

Edit the file located at _backend/src/plaid/services/plaidClient.ts_

**For sandbox mode**

In sandbox mode you can use the following username and password to log in to any bank account.
**username**: user_good
**password**: pass_good

```typescript
const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID!,
  secret: process.env.PLAID_SECRET!,
  env: plaid.environments.sandbox
  options: {
    version: "2019-05-29",
  },
});
```

**For development mode**

```typescript
const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID!,
  secret: process.env.PLAID_SECRET!,
  env: plaid.environments.development
  options: {
    version: "2019-05-29",
  },
});
```

### Setting up Mongo DB

To run the app in your local machine you must have MongoDB setup with MongoDB Atlas. The MONGO_ATLAS environment variable must be set with approriate information. Please visit https://medium.com/@sergio13prez/connecting-to-mongodb-atlas-d1381f184369 to learn more about how to set up MongoDB Atlas.

The below environment variable must be set in order to connect to MongoDB.

```sh
MONGO_ATLAS="mongodb+srv://<username>:<password>@<your-cluster-url>/<collection-name>?retryWrites=true&w=majority"
```

### (option 1) Running the app with Docker Compose

After setting up the .env file in the project directory run the command **docker-compose up --build** inside the project directory.

### (option 2) Running the app with npm

To run the application locally using npm you need to move the .env file to the _backend_ directory. The .env filr for this method needs an additional _NODE_ENV_ variable set to 'production'.

```sh
JWT_KEY=
PLAID_CLIENT_ID=
PLAID_SECRET=
NODE_ENV=production
MONGO_ATLAS="mongodb+srv://<username>:<password>@<your-cluster-url>/<collection-name>?retryWrites=true&w=majority"
```

To allow react development server to send requests to Express server you need to add a proxy in the _package.json_ file in the client directory. Right after the last entry in the client's _package.json_ file add **"proxy":"http://localhost:8000"** so that it looks like below.

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@date-io/date-fns": "^1.3.13",
    "@date-io/moment": "^1.3.13",
    "@material-ui/core": "^4.11.0",
    "@material-ui/icons": "^4.9.1",
    "@material-ui/lab": "^4.0.0-alpha.56",
    "@material-ui/pickers": "^3.2.10",
    "@material-ui/styles": "^4.10.0",
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.5.0",
    "@testing-library/user-event": "^7.2.1",
    "@types/jest": "^24.9.1",
    "@types/node": "^12.12.69",
    "@types/react": "^16.9.53",
    "@types/react-dom": "^16.9.8",
    "@types/react-router-dom": "^5.1.6",
    "@types/uuid": "^8.3.0",
    "axios": "^0.20.0",
    "canvasjs-react-charts": "^1.0.5",
    "date-fns": "^2.16.1",
    "material-table": "^1.69.1",
    "moment": "^2.29.1",
    "react": "^17.0.0",
    "react-dom": "^17.0.0",
    "react-moment": "^1.0.0",
    "react-plaid-link": "^3.0.0",
    "react-router-dom": "^5.2.0",
    "react-scripts": "3.4.4",
    "typescript": "^3.7.5",
    "uuid": "^8.3.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:8000"
}
```

From the root project directory run the following commands to start the app.

```sh
cd client && npm start
```

Open up a second terminal and run the command.

```sh
cd backend && npm start
```

### Testing

To run automated tests you must install _devDependencies_ in the backend directory. Testing should only be done in Plaid's sandbox mode. Make sure the Plaid environment is set to sandbox and the PLAID_CLIENT_ID and PLAID_SECRET. Automated tests are only currently written for backend Express routes.

<!-- ROADMAP -->

## Contact

Bong Lee - bongsoolee91@gmail.com

Project Link: [https://github.com/leeb48/banking-app](https://github.com/leeb48/banking-app)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Img Shields](https://shields.io)
- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Pages](https://pages.github.com)
- [Animate.css](https://daneden.github.io/animate.css)
- [Loaders.css](https://connoratherton.com/loaders)
- [Slick Carousel](https://kenwheeler.github.io/slick)
- [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
- [Sticky Kit](http://leafo.net/sticky-kit)
- [JVectorMap](http://jvectormap.com)
- [Font Awesome](https://fontawesome.com)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
