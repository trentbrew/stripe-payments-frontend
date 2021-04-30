//import { auth } from 'firebase';
//const API = 'https://stripe-server-apw6lsu5yq-uc.a.run.app';
const API = 'http://localhost:3333';
import firebase from 'firebase';

/**
 * A helper function to fetch data from your API.
 * It sets the Firebase auth token on the request.
 */
export async function fetchFromAPI(endpointURL, opts, noAuth) {
  const { method, body } = { method: 'POST', body: null, ...opts };

  var token = null;
  console.log('no auth? ', noAuth);
  console.log('auth object ', firebase.auth());

  if(noAuth) {
    console.log('setting stripe key as token');
    token = process.env.VUE_APP_STRIPE;
  } else {
    console.log('setting user id as token', firebase.auth().currentUser);
    const user = firebase.auth().currentUser;
    token = user && (await user.getIdToken());
  }

  console.log();
  console.log('TOKEN: ', token);
  console.log();

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}