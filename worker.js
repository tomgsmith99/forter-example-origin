/**
 * rawHtmlResponse returns HTML inputted directly
 * into the worker script
 * @param {string} html
 */
function rawHtmlResponse(html) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };
  return new Response(html, init);
}

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return 'a file';
  }
}

async function handleRequest(request) {
  const reqBody = await readRequestBody(request);
  const { url } = request;

  console.log("in the handleRequest func")

  const originalResponse = await fetch(request);

  console.log("the status is: " + originalResponse.status)

  // const retBody = `The request body sent in was ${reqBody}`;

  const body_json = JSON.parse(reqBody);

  // const originalResponse = await fetch(request);

  console.log("the status is: " + originalResponse.status)

  const retBody = `The username sent in was ${body_json.username}`;

  if (request.method === 'POST' && url.includes('login')) {


    if (originalResponse.status == 200) {
      let response = new Response(originalResponse.body, {
        status: 403,
        statusText: 'some message',
        headers: originalResponse.headers,
      });

      return response;

    }
  }
  else {
    return new Response(retBody);
  }
}

addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  console.log("the url is:")

  console.dir(url)

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