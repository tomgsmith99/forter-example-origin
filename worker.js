
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */

async function readRequestBody(request) {

  const { headers } = request

  const contentType = headers.get('content-type') || ''

  if (contentType.includes('application/json')) {

    let the_body = JSON.stringify(await request.json())

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

    the_body = JSON.stringify(body)

    return JSON.stringify(body);
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return 'a file';
  }
}

async function get_ip(username, ip_address) {

  if (username.includes('approve') || username.includes('lois.lane')) {
    return '0.0.0.1'
  }
  else if (username.includes('decline') || username.includes('lex.luthor')) {
    return '0.0.0.2'
  }
  else if (username.includes('verify') || username.includes('clark.kent')) {
    return '0.0.0.3'
  }
  else {
    return ip_address
  }
}

async function handleRequest(request) {

  const reqBody = await readRequestBody(request)

  const { url } = request

  const body_obj = JSON.parse(reqBody)

  const username = body_obj.username

  const modifiedRequest = new Request(url, {
    body: reqBody,
    headers: request.headers,
    method: request.method,
    redirect: request.redirect
  })

  // check the user's credentials against the user directory
  const credsResponse = await fetch(modifiedRequest)

  // if the user directory says the credentials are good
  // then call Forter, else send response (usually 401) to client 
  if (credsResponse.status == 200) {

    const user_id = "e520-ba9a-367-60b" // this should come from the user directory

    const ip_address = await get_ip(username, request.headers.get('CF-Connecting-IP'))

    var myHeaders = new Headers()
    myHeaders.append("api-version", FORTER_API_VERSION)
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append("Authorization", "Basic " + FORTER_KEY_ENCODED)

    var raw = JSON.stringify({
      "accountId": user_id,
      "connectionInformation": {
        "customerIP": ip_address,
        "userAgent": request.headers.get('user-agent')
      },
      "loginMethodType": "PASSWORD",
      "loginStatus": "SUCCESS",
      "eventTime": Date.now()
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    const forter_url = 'https://' + FORTER_SITE_ID + '.api.forter-secure.com/v2/accounts/login/' + user_id

    const forter_response = await fetch(forter_url, requestOptions)

    const forter_response_obj = await forter_response.json()

    console.log("the forter decision is: " + JSON.stringify(forter_response_obj))

    if (forter_response_obj.forterDecision == "DECLINE") {
      return new Response('', { status: 401 })
    }
    else {
      return new Response(forter_response)      
    }
  }
  else {
    return new Response(credsResponse.body, {
      status: credsResponse.status
    })    
  }
}

addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  if (request.method === 'POST') {
    return event.respondWith(handleRequest(request));
  }

});
