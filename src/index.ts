#!/usr/bin/env  node

import meow from "meow"
import { clear_token, get_octokit } from "./github"
import { run_agent } from "./agent"

const cli = meow(`
    Usage
        $ viowet

    Options
        --logout, -l  Logout from github

    Examples
        $ viowet
        🤔 let's get thinking

        $ viowet --logout
        Logging out 👋
`, {
    importMeta: import.meta,
    autoHelp: true,
    autoVersion: true,
    flags: {
        logout: {
            type: "boolean",
            shortFlag: "l",
            default: false
        }
    }
})

if (cli.flags.logout) {
    console.log("Logging out 👋")
    clear_token()
    process.exit(0)
}

await run_agent()