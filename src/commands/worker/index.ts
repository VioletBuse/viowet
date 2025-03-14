import { Command } from "commander";
import routes from "./routes/http";
import { createServer } from "http";
import { register_websocket_server } from "./routes/websockets";

const worker = new Command();

worker
  .name("worker")
  .description("Run the worker api to let the main ai manage this sandbox.")
  .option("-p, --port <number>", "the port to serve the api at", "8080")
  .action(async (options) => {
    const port = options.port;

    const server = createServer(routes)
    register_websocket_server(server)

    server.listen(port, function () {
      console.log(
        `Ufff. Alright, fine.... I'll get to work. Listening at http://127.0.0.1:${port} :(`,
      );
    })
  });

export default worker;
