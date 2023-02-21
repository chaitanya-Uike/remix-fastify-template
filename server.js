const fastify = require("fastify");
const { remixFastifyPlugin } = require("@mcansh/remix-fastify");
const path = require("path");
const db = require("./models");

const MODE = process.env.NODE_ENV;

async function start() {
  const app = fastify();

  await app.register(remixFastifyPlugin, {
    build: path.join(process.cwd(), "build/index.js"),
    mode: MODE,
    purgeRequireCacheInDevelopment: false,
  });

  const port = process.env.PORT ? Number(process.env.PORT) || 3000 : 3000;

  try {
    const address = await app.listen({ port, host: "0.0.0.0" });
    console.log(`[remix] app ready: ${address} `);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

db.sequelize
  .sync({ alter: true })
  .then(() => {
    start();
  })
  .catch((error) =>
    console.log("Error occurred while connecting to DB", error)
  );
