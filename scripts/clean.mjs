#!/usr/bin/env node
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const distPath = resolve("dist");
rmSync(distPath, { recursive: true, force: true });
