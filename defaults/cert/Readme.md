# Cert Directory

This is only used if you are monitoring servers that have self-signed certificates.

Create a \*.pem file and insert your certs.

```text
-----BEGIN CERTIFICATE-----
BunchOfRandomCharactersMakingUpYouCert**************************
****...
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
BunchOfRandomCharactersMakingUpYouCert**************************
****...
-----END CERTIFICATE-----
```

Then rebuild the image/container.
