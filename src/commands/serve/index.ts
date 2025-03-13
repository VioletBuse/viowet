import { Command } from "commander";
import routes from "./routes";
import { migrate } from "../../db";

const serve = new Command();

serve
  .name("serve")
  .description("Serve the main viowet api.")
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

export default serve;
