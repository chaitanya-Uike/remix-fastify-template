const fastify = require("fastify");
const { remixFastifyPlugin } = require("@mcansh/remix-fastify");
const { sequelize } = require("./models/index.server");
const path = require("path");

async function start() {
  const app = fastify();

  await app.register(remixFastifyPlugin, {
    build: path.join(process.cwd(), "build/index.js"),
  });

  const port = process.env.PORT || 3000;

  const address = await app.listen({ port, host: "0.0.0.0" });
  console.log(`💿 [Remix] app ready: ${address}`);
}

sequelize
  .sync()
  .then(() => {
    start();
  })
  .catch((error) => {
    console.log("Something went wrong!", error);
  });
