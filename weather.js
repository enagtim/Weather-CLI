#!/usr/bin/env node
import { getArgs } from "./helpers/arg.js";
import { printHelp } from "./services/log.service.js";
const initCLI = () => {
  const args = getArgs(process.argv);
  if (args.h) {
    printHelp();
  }
  if (args.s) {
  }
  if (args.t) {
  }
};
initCLI();
