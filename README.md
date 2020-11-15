![Logo](https://bend.md/images/5e8730206d541c6309354d3e_image%20(4).png)

# Back-End Task

**Create a [node.js](https://nodejs.org) [web service](https://en.wikipedia.org/wiki/Web_service) for a blogging app with a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transferj) api that works with [JSON](https://www.json.org) data using [express](https://expressjs.com/) as a framework and [postgresql](https://www.postgresql.org/) as a database.**

Blogging can involve many things so, to keep this simple, the main focus is on **users**, **articles** created by **users** and **comments** posted by **users** on **articles**. The structures for these entities are irrelevant as long as they're usable and aren't hard to understand, in other words, you can define **users**, **articles** and **comments** however you want but make sure that it won't be too hard to understand how each of their properties contribute to form a blogging app that respects the requirements that are enumerated below. The same goes for endpoints.

### Requirements:

1. RESTfull web service working with JSON data in node.js using express and postgresql
1. two types of **users**: **bloggers** and **admins**
1. authentication with username and password, with sing-up and sign-in for **bloggers**, but only sign-in for **admins**
1. **bloggers** can create **articles**
1. **bloggers** can update and remove their **articles**
1. **bloggers** can publish(display) and unpublish(hide) their **articles**
1. **bloggers** can see all their **articles**
1. **bloggers** can see **articles** published by themselves and other **bloggers**
1. **bloggers** can post **comments** on **articles** they can see
1. **bloggers** can update and remove their **comments**
1. **bloggers** can see all **comments**
1. **admins** can do everything **bloggers** can do and more
1. **admins** can remove any published **article**
1. **admins** can remove any posted **comment**

### Bonus points for usage of:

1. [typescript](https://www.typescriptlang.org/)
1. [sequelize](https://sequelize.org/)
1. [jwt](https://jwt.io/)