#!/usr/bin/env node

import "dotenv/config";
import "./db";
import { Command } from "commander";
import packageJson from "../package.json";
import agent from "./commands/agent/index";
import worker from "./commands/worker";
import lighthouse from "./commands/lighthouse";

const program = new Command();

program
  .name("viowet")
  .description(
    'Violet, the worlds greatest programmer :copium:, available as an ai to help you "improve" your code.',
  )
  .version(packageJson.version);

program.addCommand(agent);
program.addCommand(worker);
program.addCommand(lighthouse);

program.parse();
