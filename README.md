Devs: **Hamoudi, Toihid, Fizzah**

Twitter Clone – Backend

This is the backend for our Twitter Clone project.
Built with Node.js, Express, and MongoDB.

How to run:

- Open a terminal in the backend folder and run:
- npm install
- npm start

**\*\*Must Create an .env file with a valid Mongo URI string\*\***

The server will start on port 3000 by default.

How to run tests:

- We use Jest and MongoMemoryServer for all tests
- Run: npm test

CI / GitHub Actions:

- All tests run automatically on every push or pull request to the dev and main branches

Routes tested:

- Register
- Login
- Validate (token)
- Profile rendering
- Tweet functionality
- Follow actions

Notes:

- This is a school project
- Each team member works in their own branch
- All pull requests go to dev first, then to main when stable
