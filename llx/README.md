# Docs

## Public APIs

### genToken

`/api/genToken/:source`.

source can be one of:

- telegram
- whatsapp
- viber

Allows clients to generate a new token for the user. Only clients with a valid `api_key` can access API.

Status codes:

- `200` - ok
- `400` - `api_key` not found (Bad Request)
- `403` - permission denied (Inactive `api_key`)
- `422` - validation errors (or unknown source)

API returns the `JWT`. You need to verify the `JWT` using the secret key to get the payload.

[Example Node.js](https://www.npmjs.com/package/jsonwebtoken):

```js
const jwt = require('jsonwebtoken')

const decoded = jwt.verify(token, yourSecretKey)
```

The resulting `JWT` contains `token` and `sources` (telegram). Each source contains:

- `webUrl` - link to web application source (telegram may not be available in Russia)
- `appUrl` - link to open application (desktop, mobile)
- `qr` - with link to open desktop/mobile application

### checkAuth

Returns the status of the user with the given token. Only clients with a valid `api_key` can access API.

Status codes:

- `200` - ok
- `400` - `api_key` not found (Bad Request)
- `403` - permission denied (Inactive `api_key`)
- `422` - validation errors

API returns the token. You need to verify the token using the secret key to get the payload.

Token contains:

- `status` - user status
- `message` - status/error message
- `payload` - null or user info (if authenticated)

Status contains one of:

- `error` - User with the given token is not found
- `waiting` - User is not authenticated yet (need to try later)
- `ok` - User authenticated
- `expired` - Token expired
- `serverError`

## Private APIs

### login

Used by bots to authenticate users by token. Bots should send an `access_token` in the header.

Status codes:

- `200` - true. User Authenticated Successfully
- `400` - `access_token` not found (Bad Request)
- `403` - permission denied (Inactive `access_token`)
- `422` - validation errors

API returns true if user authenticated successfully. Returns code error with message if user has not been authenticated
