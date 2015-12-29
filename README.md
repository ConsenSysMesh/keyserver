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
curl -i -X POST -d '{
	"keystore": {
		"encSeed": {
			"encStr": "U2FsdGVkX1/HbLvOwMvD+C01eOI2UY4PzFdq8B1931lyxTcolPkYyHnjTl1AJ2W9HK1TA3bnER1D9skJ5SiZcZbMmMydPmuAWVwKYrgwQmnuQWvUDbgjjcY2jI8RqLFK",
			"iv": "84ae48f16b492febe4865d9ea385aa7a",
			"salt": "c76cbbcec0cbc3f8"
		},
		"keyHash": "6d36b0a23fd8cc6c03c668b8c722765a4a883f7a0bf7d126e9189972343c09c31557472a9f30eb32939b542a9a31feb69a0c454f2470cc492e529a12551b5316",
		"salt": {
			"words": [-1122870160, -1604362614, -1697030692, -1450221161],
			"sigBytes": 16
		},
		"ksData": {
			"m/0'/0'/0'": {
				"info": {
					"curve": "secp256k1",
					"purpose": "sign"
				},
				"encHdPathPriv": {
					"encStr": "U2FsdGVkX1/DNt7Irr5pG4TUOAfZ3JGuGu7tqdMUTqYn7BCo24+7N65/HWIV8Zoh6HVUjvu42d2oDO8W4RTpsF2/JWZWlsSnwQvDlaZh/frX0khvj3mmf5903Q5eHHiVnO2z4kFhYic+CfEYS3GMcvXMeoKe9ezDD4W/grTig04=",
					"iv": "31cad11413f33859f3c9d571ccbe786e",
					"salt": "c336dec8aebe691b"
				},
				"hdIndex": 0,
				"encPrivKeys": {},
				"addresses": []
			}
		},
		"version": 1
	},
	"token": "055e97f1736b6041640451d90cc209c1"
}' https://keyserver-ajunge.herokuapp.com/api/v0/keystore/ajunge

```

Recover a keystore
```
curl -i  -H 'Authorization: Bearer 055e97f1736b6041640451d90cc209c1' \
  -X GET https://keyserver-ajunge.herokuapp.com/api/v0/keystore/ajunge
```



##Roadmap
- Add UI
