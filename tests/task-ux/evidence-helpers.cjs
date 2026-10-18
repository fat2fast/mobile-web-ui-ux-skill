const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

async function evidence(testInfo, page, checkId, records, details = {}) {
  const screenshot = testInfo.outputPath('state.png');
  await page.screenshot({ path: screenshot, fullPage: true });
  const root = path.resolve(process.env.TASK_UX_ARTIFACTS || testInfo.config.outputDir);
  const record = {
    schema_version: 1, check_id: checkId,
    sha: process.env.SHA || 'exploratory-uncommitted',
    run_id: process.env.RUN_ID || 'exploratory',
    viewport: page.viewportSize(), browser: { name: testInfo.project.name, version: page.context().browser()?.version() || 'unknown' }, state: details.state || 'representative-state-matrix',
    trigger: details.trigger || 'see per-row triggers', state_oracle: 'passed',
    criterion: details.criterion || 'WCAG 1.4.1 / 1.4.3 / 1.4.11 / 2.4.7',
    measurements: records, disposition: 'PASS', ...details,
    artifacts: [screenshot, ...(details.artifactFiles || [])].map(file => ({ kind: 'screenshot', relative_path: path.relative(root, file).split(path.sep).join('/'), sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') })),
  };
  delete record.artifactFiles;
  const destination = testInfo.outputPath('ux-evidence.json');
  fs.writeFileSync(destination, JSON.stringify(record, null, 2));
  await testInfo.attach('ux-evidence', { path: destination, contentType: 'application/json' });
}

module.exports = { evidence };
