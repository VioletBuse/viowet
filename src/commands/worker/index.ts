import { Command } from "commander";
import routes from "./routes";
import { migrate } from "../../db";

const worker = new Command();

worker
    .name("worker")
    .description("Run the worker api to let the main ai manage this sandbox.")
    .option('-p, --port <number>', 'the port to serve the api at', '8080')
    .action(async (options) => {
        await migrate();

        const port = options.port

        routes.listen(port, () => {
            console.log(`Ufff. Alright, fine.... I'll get to work. Listening at http://127.0.0.1:${port} :(`)
        })
    })

export default worker