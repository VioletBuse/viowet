import { Command } from "commander";
import routes from "./routes";

const lighthouse = new Command();

lighthouse.name('lighthouse').description("Run the lighthouse api, which routes communications between the main process and the sandbox. Also optionally has the capability to spin up new sandbox workers.").option('-p, --port <number>', 'the port to serve the api at', '8080').action((options) => {
    const port = options.port;

    routes.listen(port, () => {
        console.log(`Alright I'll get them to talk to each other... just this once though hmph! Listening at http://127.0.0.1:${port}`)
    })
})

export default lighthouse
