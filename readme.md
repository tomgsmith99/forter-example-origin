
# Example origin for authentication through a CDN #

This project provides a front-end login form and a back-end authentication "service".

It was built to test a flow where a CDN performs a risk evaluation on an authentication request *after* sending the request to the authentication service but *before* responding to the client.

The specific flow that this was built for is:

front-end->Cloudflare->authn service->Cloudflare->Forter->Cloudflare->front-end 

The login form POSTs user credentials (and a Forter token) to the back end.

The back end authentication service responds with a 200 unless the username equals the USER_WRONG_PASSWORD value, in which case it returns a 401.

The password field is ignored.

The Cloudflare worker (with call out to Forter) designed to work in this flow is available here.

## Prerequisites ##

A Forter account

### NodeJS app ###

* Front end: the front end includes the Forter JavaScript snippet and a very basic login form that POSTs the user credentials and the Forter token to the back end.

* Back end: the back end represents the origin and user directory. 

## Setup: NodeJS app ##

Copy the `.env_example` file to `.env`

Enter the values from your Forter tenant.

Install the Node dependencies:

`npm install`

Start the app:

`node app.js`

Test the app locally:

You should be able to "log in" as any of the test users (the password field is ignored).

Look for results in the console network tab.

All users will result in a 200 response, except for Guy Pearce, who will return a 401.
