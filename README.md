# Docs

## API

### genToken

Allows clients to generate a new token for the user. Only clients with a valid `api_key` can access API.

Status codes:

- `200` - ok
- `400` - `api_key` not found (Bad Request)
- `403` - permission denied (Inactive `api_key`)
- `422` - validation errors

API returns the token. You need to verify the token using the secret key to get the payload.

[Example Node.js](https://www.npmjs.com/package/jsonwebtoken):

```js
const jwt = require('jsonwebtoken')

const decoded = jwt.verify(token, yourSecretKey)
```

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
