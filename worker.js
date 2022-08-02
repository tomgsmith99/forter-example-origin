
async function handleRequest(request) {
  // const reqBody = await readRequestBody(request);
  const { url } = request;

  console.log("in the handleRequest func")

  if (request.method === 'POST' && url.includes('login')) {

    const originalResponse = await fetch(request);

    console.log("the status is: " + originalResponse.status)

    // return new Response();

    if (originalResponse.status == 200) {

      // call Forter here
      let response = new Response(originalResponse.body, {
        status: 403,
        statusText: 'some message',
        headers: originalResponse.headers,
      });

      return response;

    }
  }
  else {
    // const retBody = `The request body sent in was ${reqBody}`;

    const body_json = JSON.parse(reqBody);

    const retBody = `The username sent in was ${body_json.username}`;

    return new Response(retBody);
  }
}

addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  console.log("the url is:")

  console.log(url)

  if (request.method == "GET") {

    if (url == "https://f-test-cf.tomgsmith.com/login-1") {}
    else {
      return event.respondWith(new Response(`The request was a GET`));      
    }

  }

  else {

    if (request.method === 'POST') {

      console.log("the request method is POST")
      return event.respondWith(handleRequest(request));
    }
  }

});