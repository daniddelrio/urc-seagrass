# URC Seagrass Project

[Website Link](http://maps.mangroveecology.com/)

The URC Seagrass website aims to display data gathered about Oyon Bay, Masinloc in a visually appealing and interactive form, with hopes of raising awareness to the general public. It highlights specific sites within the bay where researchers gathered data for certain parameters. The website makes it easy for researchers and maintainers to add and edit data per year, while also providing an avenue for other users to contribute their own data which will be subject to approval from an administrator.

## Front-end (`/client`)
- ReactJS
- LeafletJS and Mapbox for interactive map integration

## Back-end (`/server`)
- Node + ExpressJS
- MongoDB for GeoJSON Database Storage (through Mongoose)

Both the `client` and `server` need `.env` files to run.
