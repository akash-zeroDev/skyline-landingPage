import fs from 'fs';
import path from 'path';
import { launchBrowser } from './qa/browser-helper.mjs';
import { runGeometrySuite } from './qa/suite-geometry.mjs';
import { runMotionSuite } from './qa/suite-motion.mjs';
import { runResponsiveSuite } from './qa/suite-responsive.mjs';
import { runA11ySuite } from './qa/suite-a11y.mjs';
import { runPerfSuite } from './qa/suite-perf.mjs';
import { runBrowsersSuite } from './qa/suite-browsers.mjs';
import { runIntegrationSuite } from './qa/suite-integration.mjs';
import { runEdgeSuite } from './qa/suite-edge.mjs';

// CLI Argument parsing
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  if (match) return match.split('=')[1];
  const flag = args.indexOf(`--${name}`);
  if (flag !== -1 && args[flag + 1]) return args[flag + 1];
  return fallback;
};

const baseUrl = getArg('url', 'http://localhost:5173');
const suiteFilter = getArg('suite', 'all').toLowerCase();
const shotsDir = path.resolve(process.cwd(), 'qa-report/shots');
const reportDir = path.resolve(process.cwd(), 'qa-report');

if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

async function main() {
  console.log('================================================================');
  console.log('  SKYLINE DIGITAL MEDIA — "WHAT WE DO" RELEASE QA HARNESS       ');
  console.log('================================================================');
  console.log(`Target URL:  ${baseUrl}`);
  console.log(`Suites:      ${suiteFilter}`);
  console.log(`Timestamp:   ${new Date().toISOString()}`);
  console.log('----------------------------------------------------------------\n');

  let browser;
  try {
    browser = await launchBrowser();
  } catch (err) {
    console.error('Failed to launch browser:', err.message);
    process.exit(1);
  }

  const allResults = [];
  const suitesToRun = [];

  const shouldRun = (name) => suiteFilter === 'all' || suiteFilter.split(',').includes(name.toLowerCase());

  if (shouldRun('geometry')) suitesToRun.push({ name: 'GEOMETRY', fn: () => runGeometrySuite(browser, baseUrl) });
  if (shouldRun('motion')) suitesToRun.push({ name: 'MOTION', fn: () => runMotionSuite(browser, baseUrl, shotsDir) });
  if (shouldRun('responsive')) suitesToRun.push({ name: 'RESPONSIVE', fn: () => runResponsiveSuite(browser, baseUrl, shotsDir) });
  if (shouldRun('a11y')) suitesToRun.push({ name: 'A11Y', fn: () => runA11ySuite(browser, baseUrl) });
  if (shouldRun('perf')) suitesToRun.push({ name: 'PERF', fn: () => runPerfSuite(browser, baseUrl) });
  if (shouldRun('browsers')) suitesToRun.push({ name: 'BROWSERS', fn: () => runBrowsersSuite(browser, baseUrl, shotsDir) });
  if (shouldRun('integration')) suitesToRun.push({ name: 'INTEGRATION', fn: () => runIntegrationSuite(browser, baseUrl) });
  if (shouldRun('edge')) suitesToRun.push({ name: 'EDGE', fn: () => runEdgeSuite(browser, baseUrl, shotsDir) });

  for (const s of suitesToRun) {
    process.stdout.write(`Running [${s.name}] suite... `);
    const start = Date.now();
    try {
      const res = await s.fn();
      const dur = ((Date.now() - start) / 1000).toFixed(1);
      const passed = res.filter((r) => r.passed).length;
      const failed = res.length - passed;
      if (failed === 0) {
        console.log(`✓ PASS (${passed}/${res.length} in ${dur}s)`);
      } else {
        console.log(`✗ FAIL (${failed} failed, ${passed} passed in ${dur}s)`);
      }
      allResults.push(...res);
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      allResults.push({
        id: `${s.name}_FATAL_ERROR`,
        suite: s.name,
        measured: 'CRASH',
        threshold: 'SUCCESS',
        passed: false,
        details: err.stack || err.message,
      });
    }
  }

  await browser.close();

  // Generate Reports
  const total = allResults.length;
  const passedCount = allResults.filter((r) => r.passed).length;
  const failedCount = total - passedCount;
  const passRate = total > 0 ? ((passedCount / total) * 100).toFixed(1) : 0;

  console.log('\n----------------------------------------------------------------');
  console.log(`SUMMARY: ${passedCount}/${total} PASSED (${passRate}%) | ${failedCount} FAILED`);
  console.log('----------------------------------------------------------------\n');

  // JSON Report
  const jsonReport = {
    timestamp: new Date().toISOString(),
    baseUrl,
    suiteFilter,
    summary: { total, passed: passedCount, failed: failedCount, passRate: `${passRate}%` },
    results: allResults,
  };
  fs.writeFileSync(path.join(reportDir, 'report.json'), JSON.stringify(jsonReport, null, 2));

  // Markdown Report
  let md = `# Skyline Digital Media — "What We Do" Section Release QA Audit Report\n\n`;
  md += `**Generated**: ${new Date().toUTCString()}  \n`;
  md += `**Target URL**: \`${baseUrl}\`  \n`;
  md += `**Overall Status**: ${failedCount === 0 ? '🟢 **ALL CHECKS PASSED**' : `🔴 **${failedCount} FAILURES DETECTED**`} (${passedCount}/${total} checks passed, ${passRate}%)  \n\n`;

  md += `## How to Read This Report\n`;
  md += `- **Suite**: Logical test domain (\`GEOMETRY\`, \`MOTION\`, \`RESPONSIVE\`, \`A11Y\`, \`PERF\`, \`BROWSERS\`, \`INTEGRATION\`, \`EDGE\`).\n`;
  md += `- **Check ID**: Unique identifier corresponding to the automated acceptance criteria.\n`;
  md += `- **Measured**: Live sampled values extracted from the running DOM / animation timeline / rendered bounding boxes.\n`;
  md += `- **Threshold**: Strict tolerance limit defined by the design specifications and reference recording.\n`;
  md += `- **Status**: ✅ PASS if within threshold, ❌ FAIL if outside.\n\n`;

  md += `## Executive Summary\n\n`;
  md += `| Suite | Total Checks | Passed | Failed | Status |\n`;
  md += `| :--- | :---: | :---: | :---: | :---: |\n`;

  const suiteNames = ['GEOMETRY', 'MOTION', 'RESPONSIVE', 'A11Y', 'PERF', 'BROWSERS', 'INTEGRATION', 'EDGE'];
  suiteNames.forEach((sname) => {
    const subset = allResults.filter((r) => r.suite === sname);
    if (subset.length === 0) return;
    const p = subset.filter((r) => r.passed).length;
    const f = subset.length - p;
    md += `| **${sname}** | ${subset.length} | ${p} | ${f} | ${f === 0 ? '✅ PASS' : '❌ FAIL'} |\n`;
  });
  md += `| **TOTAL** | **${total}** | **${passedCount}** | **${failedCount}** | **${failedCount === 0 ? '✅ PASS' : '❌ FAIL'}** |\n\n`;

  if (failedCount > 0) {
    md += `## ❌ Failed Checks Requiring Remediation\n\n`;
    md += `| Suite | Check ID | Measured | Threshold | Remediation Details |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    allResults
      .filter((r) => !r.passed)
      .forEach((r) => {
        md += `| \`${r.suite}\` | \`${r.id}\` | \`${r.measured}\` | \`${r.threshold}\` | ${r.details || 'Out of tolerance'} |\n`;
      });
    md += `\n`;
  }

  md += `## Detailed Audit Results\n\n`;
  suiteNames.forEach((sname) => {
    const subset = allResults.filter((r) => r.suite === sname);
    if (subset.length === 0) return;
    md += `### Suite: ${sname}\n\n`;
    md += `| Check ID | Measured | Threshold | Result | Details |\n`;
    md += `| :--- | :--- | :--- | :---: | :--- |\n`;
    subset.forEach((r) => {
      const statusIcon = r.passed ? '✅' : '❌';
      md += `| \`${r.id}\` | \`${String(r.measured).replace(/\|/g, '\\|')}\` | \`${String(r.threshold).replace(/\|/g, '\\|')}\` | ${statusIcon} | ${String(r.details || '').replace(/\|/g, '\\|')} |\n`;
    });
    md += `\n`;
  });

  fs.writeFileSync(path.join(reportDir, 'report.md'), md);
  console.log(`Reports saved:`);
  console.log(`  - Markdown: qa-report/report.md`);
  console.log(`  - JSON:     qa-report/report.json`);
  console.log(`  - Shots:    qa-report/shots/\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
