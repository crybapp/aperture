![Cryb OSS](.github/cryb.png "Cryb OSS Logo")

_**Aperture** - Video/audio forwarding_

![GitHub contributors](https://img.shields.io/github/contributors/crybapp/aperture) ![GitHub](https://img.shields.io/github/license/crybapp/aperture)

## Docs
* [Info](#info)
    * [Status](#status)
* [Codebase](#codebase)
    * [Folder Structure](#folder-structure)
    * [First time setup](#first-time-setup)
        * [Installation](#installation)
    * [Running the app locally](#running-the-app-locally)
        * [Background services](#background-services)
        * [Starting @cryb/aperture](#starting-@cryb/aperture)
* [Questions / Issues](#questions-/-issues)

## Info
`@cryb/aperture` is the microservice used to forward video and audio streams from `@cryb/portal` onto clients.

The `ffmpeg` command in `@cryb/portal` streams over TCP using the MPEGTS standard. 

The HTTP endpoint used contains a parameter that contains a token that is signed on `@cryb/portal` which is used to route the stream onto WebSocket clients connected to the microservices' WebSocket instance.

### Status
`@cryb/aperture` has been actively developed internally since September 2019, and is now open source as of October 2019.

## Codebase
The codebase for `@cryb/aperture` is written in JavaScript, utilising Node.js. The WebSocket API uses the `ws` module. MongoDB is also used as the primary database.

### Folder Structure
```
cryb/aperture/
└─── src # The core source code
```

### First time setup
First, clone the `@cryb/aperture` repository locally:

```
git clone https://github.com/crybapp/aperture.git
```

#### Installation
The following services need to be installed for `@cryb/aperture` to function:

* MongoDB

We recommend that you run the following services alongside `@cryb/aperture`, but it's not required.
* `@cryb/api`
* `@cryb/portal`

You also need to install the required dependencies, by running either:

```
npm install
```
or
```
yarn
```

Ensure that `.env-example` is either copied and renamed to `.env`, or is simply renamed to `.env`.

In this file, you'll need to supply the environment the app is running in under `NODE_ENV`, the key used to decrypt incoming requests over HTTP and WS, and the URI for MongoDB.

### Running the app locally

#### Background Services
Make sure that you have installed MongoDB, and that it is running on port 27017.

The command to start MongoDB is `mongod`.

#### Starting @cryb/aperture
To run `@cryb/aperture` in development mode, run either:

```
npm start
```
or
```
yarn start
```

## Questions / Issues

If you have an issues with `@cryb/aperture`, please either open a GitHub issue, or contact a maintainer.
