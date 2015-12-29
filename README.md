#Lightwallet Keyserver

To run your own version of the keyserver just hit:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

##Usage

Very early MVP!

To send a keystore to the Keyserver:

```
POST /api/v0/keystore/<identifier>

{
  keystore: {
    <keystore.serialize() object>
  },
  token: <token to protect keystore>
}

```

To recover a keystore from the Keyserver:

```
Authorization: Bearer <token that proctect keystore>
GET /api/v0/keystore/<identifier>

```

## cURL test

Store a keystore

```
curl -i \
  -d '{ "keystore": { "encSeed": {}, "version": 1	}, "token": "055e97f1736b6041640451d90cc209c1"}' \
  -X POST https://keyserver-ajunge.herokuapp.com/api/v0/keystore/ajunge

```

Recover a keystore
```
curl -i  -H 'Authorization: Bearer 055e97f1736b6041640451d90cc209c1' \
  -X GET https://keyserver-ajunge.herokuapp.com/api/v0/keystore/ajunge
```



##Roadmap
- Add UI
