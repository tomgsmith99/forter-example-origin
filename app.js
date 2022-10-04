require('dotenv').config()

const cors = require('cors')

const express = require('express')

const nunjucks = require('nunjucks')

/*************************************************/

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(cors())

nunjucks
    .configure('views', {
        autoescape: true,
        express: app,
        watch: true
    })

/*************************************************/

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`)
})

/*************************************************/

const username401 = "guy.pearce"

/*************************************************/

app.get('/favicon.ico', (req, res) => {
	res.sendStatus(200)
	return
})

app.get('/', (req, res) => {
	obj = {}
	res.render ('index.html', obj)
})

app.get('/login-1', (req, res) => {

	obj = {
		FORTER_EU: process.env.FORTER_EU,
		FORTER_SITE_ID: process.env.FORTER_SITE_ID,
		use_case: "login-1"
	}

	res.render ('login.html', obj)
})

// this endpoint mocks a user directory
// if username includes "guy.pearce" then we assume that the password is incorrect
// and return a 401
// else we assume that the password is correct and return a 200
app.post('/login', (req, res) => {

	console.log("this is the request body that was submitted:")

	console.dir(req.body)

	if (req.body.username.toLowerCase() == username401) {
		res.sendStatus(401)
	}
	else {
		res.sendStatus(200)
	}
})
