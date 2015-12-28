#Lightwallet Keyserver

To run your own version of the keyserver just hit:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

##Usage

Very early MVP!

To send a keystore to the Keyserver:

```
POST /api/v0/keystore/<username>

{
  <keystore.serialize() object>
}

```

To recover a keystore from the Keyserver:

```
GET /api/v0/keystore/<username>

```

##Roadmap
- Add password
- Add UI
