// eslint-disable-next-line import/no-extraneous-dependencies
import { createServer } from "miragejs";

// eslint-disable-next-line import/prefer-default-export
export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,

    routes() {
      this.post("/mock", (_schema, request) => {});
    },
  });

  return server;
}
