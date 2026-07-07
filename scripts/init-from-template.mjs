#!/usr/bin/env node

import { initFromTemplate } from './lib/template-init/index.js';
import { GITHUB_REPO_MANIFEST } from './lib/template-init/manifests/github-repo.js';
import { printHelp } from './lib/template-init/parse-args.js';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  printHelp('github-repo-template');
  process.exit(0);
}

initFromTemplate({
  manifest: GITHUB_REPO_MANIFEST,
  includePackageName: false,
  includeBundler: true,
  defaultBundler: 'none',
  nextSteps: 'review git diff, then commit',
}).catch((error) => {
  console.error('❌ Init failed:', error.message);
  process.exit(1);
});
