require('dotenv').config()

const express = require('express')

const nunjucks = require('nunjucks')

/*************************************************/

// let config = require('./config.json')

const ip_addresses = {
	APPROVE: '0.0.0.1',
	DECLINE: '0.0.0.2',
	VERIFICATION_REQUIRED: '0.0.0.4'
}

/*************************************************/

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

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
