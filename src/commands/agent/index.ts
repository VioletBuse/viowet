import { Command } from "commander";
import routes from "./routes";
import { migrate } from "../../db";

const agent = new Command();

agent
  .name("agent")
  .description("Serve the main viowet api and run the agent.")
  .option("-p, --port <number>", "the port to serve the api at", "8080")
  .action(async (options) => {
    await migrate();
    const port = options.port;

    routes.listen(port, () => {
      console.log(
        `Hi, I'm viowet, and I'm listening at http://127.0.0.1:${port}!`,
      );
    });
  });

export default agent;
