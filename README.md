# food_delivery_backend

food_delivery_backend provides REST API to fetch data for Food Delivery website

# Table of contents

- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [API](#api)
  - [Account](#account)
    - [Register](#register)
    - [Login](#login)

## Quick Start

### Requirements

Development environment: NodeJs, MySQL

### Installation

- Run

```
$ git clone git@github.com:baonguyen120301/Food_delivery_backend.git
$ cd Food_delivery_backend
$ yarn

$ yarn start

Or deamon

$ yarn dev

```

- Before request any API, you need to create database named food_delivery and then run this API to create tables

```
url: /init

example: localhost:5000/init

des: Create tables in database

```

## API

### Account

#### Register

```
url: /account/register

example: localhost:5000/account/register
method: POST

des: register new account, add info of account into database

successResponse:
{
    message: "Register successfully"
}

if error:
{
    error: "any error will show here"
}

```

#### Login

```
url: /account/login

example: localhost:5000/account/login
method: POST

des: compare input value and value in database by email

successResponse:
{
    message: "Login successfully"
}

if error:
{
    error: "any error will show here"
}

```
