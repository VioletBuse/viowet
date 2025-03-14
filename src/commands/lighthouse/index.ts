import { Command } from "commander";
import { createServer } from "http";
import routes from "./routes/http";
import { migrate } from "../../db";
import { register_websocket_server } from "./routes/websockets";

const lighthouse = new Command();

lighthouse
  .name("lighthouse")
  .description(
    "Run the lighthouse api, which routes communications between the main process and the sandbox. Also optionally has the capability to spin up new sandbox workers.",
  )
  .option("-p, --port <number>", "the port to serve the api at", "8080")
  .action(async (options) => {
    await migrate();
    const port = options.port;

    const server = createServer(routes);
    register_websocket_server(server)

    server.listen(port, function () {
      console.log(
        `Alright I'll get them to talk to each other... just this once though hmph! Listening at http://127.0.0.1:${port}`,
      );
    })
  });

export default lighthouse;
