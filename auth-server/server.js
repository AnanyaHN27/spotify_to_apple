let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')
let app = express() 

let redirect_uri_login = 'http://localhost:8888/callback'
let client_id = 'c8ccb73336514ab6a17a759766269c7d'
let client_secret = 'b3eef7fd995b4fec8b22a032a43ff33b'

app.use(cors())

// redirects to spotify authorize method
app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-read-private user-read-email user-library-read',
      redirect_uri: redirect_uri_login
    }))
})

// use auth code to make request to the token endpoint
// response will give access token that we will redirect back to our react application 

app.get('/callback', function(req, res) {
    let code = req.query.code || null
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri_login,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(
            client_id + ':' + client_secret
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      var access_token = body.access_token
      let uri = process.env.FRONTEND_URI || 'http://localhost:3000/playlist'

      res.redirect(uri + '?access_token=' + access_token)
    })
  })


// Generate apple music token
const jwt = require('jsonwebtoken');
const fs = require('fs');

const private_key = fs.readFileSync('/Users/ananya/Documents/spotify_to_apple/auth-server/AuthKey_FSGQ46W9SU.p8').toString();
const team_id = '3UP26AZPP6'; 
const key_id = 'FSGQ46W9SU'; 
const token = jwt.sign({}, private_key, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: team_id,
  header: {
    alg: 'ES256',
    kid: key_id
  }
});

const token_key = '8457f780-ad29-4331-bbf5-9f7addca1a4c'
app.get('/token', function (req, res) {
  if(req.query.key === token_key){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({token: token}));
  }
});


let port = 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)