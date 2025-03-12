#!/usr/bin/env node

import "dotenv/config"
import {Command} from "commander"
import packageJson from "../package.json"
import serve from "./commands/serve/index";

const program = new Command();

program
    .name('viowet')
    .description('Violet, the worlds greatest programmer :copium:, available as an ai to help you "improve" your code.')
    .version(packageJson.version)

program.addCommand(serve)

program.parse()
