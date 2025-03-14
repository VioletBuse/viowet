#!/usr/bin/env node

import "dotenv/config";
import "./db";
import { Command } from "commander";
import agent from "./commands/agent/index";
import worker from "./commands/worker";
import lighthouse from "./commands/lighthouse";
import { cli_version } from "./util/version";

const program = new Command();

program
  .name("viowet")
  .description(
    'Violet, the worlds greatest programmer :copium:, available as an ai to help you "improve" your code.',
  )
  .version(cli_version);

program.addCommand(agent);
program.addCommand(worker);
program.addCommand(lighthouse);

program.parse();
