#!/usr/bin/env  node

import { auth_commands, clear_token, get_octokit, is_logged_in } from "./github"
import { CLI, Command } from "cliffy"
import packagejson from "../package.json"
import { run_agent_command } from "./agent";

export const cli = new CLI({ quietBlank: true })
    .setDelimiter("🚀 viowet > ")
    .setName("viowet")
    .setVersion(packagejson.version)
    .setInfo(packagejson.description);

const exit_command: Command = {
    description: "Exit the CLI",
    action() {
        process.exit(0)
    }
}



cli.addCommand(".exit", exit_command)
    .addCommand("auth", auth_commands(cli))
    .addCommand("agent", run_agent_command())

cli.show()