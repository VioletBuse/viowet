import { Command } from "commander"

const serve = new Command();

serve.name("serve").description("Serve the main viowet api.").option('-p, --port <number>', 'the port to serve the api at', '8080')

export default serve
