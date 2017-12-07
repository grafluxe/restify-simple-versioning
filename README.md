# restify-simple-versioning

Easily add version support to your Restify APIs.

This Restify middleware adds API versioning via your URIs. The version format is the letter "v" followed by a number (e.g. v1) and is prepended to your route (`api/test` -> `v1/api/test`). If no version is added to the URI, the latest version will be used by default. Additionally, the header `API-Version` is included in each response.

Note, this module was tested on Restify 6.3.2.

## Usage

`npm i restify-simple-versioning`

No need to edit your routes. Simply add the pre-route `addVersionRoute` and API versioning will be supported automatically (see [example](#example)). You can then require `restify-simple-versioning` in any additional file and use the static variables to determine the requested version.

### Example

```javascript
let restify = require("restify"),
    versioner = require("restify-simple-versioning"),
    server = restify.createServer();

versioner.versions = [1, 2]; // If not set, version 1 will be added by default.

server.pre(versioner.addVersionRoute);

server.get("api/test", (req, res, next) => {
  if (versioner.currentVersion === 1) {
    res.send(200, "Version 1");
  } else {
    res.send(200, "Other versions");
  }
  next();
});
```

The above logic will add support for the following example routes:

```
https://www.site.com/v1/api/test

versioner.currentVersion = 1
versioner.uri = "v1"
```

```
https://www.site.com/v2/api/test

versioner.currentVersion = 2
versioner.uri = "v2"
```

```
https://www.site.com/api/test

versioner.currentVersion = 2
versioner.uri = ""
```

## Documentation

**versions** : `Array<Number>`

Gets/sets the available API versions. Defaults to `[1]` if not set.

***

**currentVersion** : `Number`

Gets the current API version.

***

**uri** : `String`

Gets the API version as seen in the URI. If no version is used in the URI, an empty string is returned.

***

**addVersionRoute** : `Function`

Adds version path support to your URI. The version format is the letter "v" followed by a number (e.g. v1). If no version is added to the URI, the latest version will be used by default. Additionally, the header `API-Version` is included in each response. Throws an `InvalidVersionError` (status 409) if the version you requested does not exist -- use the `VersionNotAllowed` event-listener to catch.


## License

Copyright (c) 2017 Leandro Silva (http://grafluxe.com)

Released under the MIT License.

See LICENSE.md for entire terms.
