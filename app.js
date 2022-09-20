require('dotenv').config()

const express = require('express')

const nunjucks = require('nunjucks')

/*************************************************/

const ip_addresses = {
	APPROVE: '0.0.0.1',
	DECLINE: '0.0.0.2',
	VERIFICATION_REQUIRED: '0.0.0.4'
}

/*************************************************/

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

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

app.post('/login', (req, res) => {

	console.log(typeof req.body)

	console.log("this is the request body that was submitted:")

	console.dir(req.body)

	if (req.body.username == "guy.pearce") {
		res.sendStatus(401)
	}
	else {
		res.sendStatus(200)
	}

	console.log("the username is: " + req.body.username)
})

