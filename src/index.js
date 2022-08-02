




addEventListener('fetch', event => {

  const { request } = event;

  console.log(request.method)

  event.respondWith(handleRequest(request))
// this script tells FetchEvent  worker  how to respond to any incoming fetch request.
// the Worker script then returns a response to the user.
})

async function handleRequest(request) 
// this function takes an event and context object as input and returns a string.
// the async function takes request provided as the parameter. 
// The Worker then receives HTTP requests and responds automatically.
{
  // Prints a plain text that says Hello World!

  console.log('the request method is: ' + request.method)

  return new Response('Hello World!', { 
    headers: { 'content-type': 'text/plain' },
  })
}