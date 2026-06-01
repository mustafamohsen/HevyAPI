import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const coverageDirectory = 'coverage';
const lcovPath = join(coverageDirectory, 'lcov.info');
const requiredPercent = 100;

const runCoverage = Bun.spawnSync({
  cmd: [
    'bun',
    'test',
    '--coverage',
    '--coverage-reporter=text',
    '--coverage-reporter=lcov',
    `--coverage-dir=${coverageDirectory}`,
  ],
  stdout: 'inherit',
  stderr: 'inherit',
});

if (runCoverage.exitCode !== 0) {
  process.exit(runCoverage.exitCode);
}

if (!existsSync(lcovPath)) {
  console.error(`Coverage report not found at ${lcovPath}`);
  process.exit(1);
}

interface CoverageRecord {
  file: string;
  foundLines: number;
  hitLines: number;
  foundFunctions: number;
  hitFunctions: number;
}

const parseCount = (line: string): number => {
  const value = Number.parseInt(line.split(':')[1] ?? '', 10);
  if (Number.isNaN(value)) {
    throw new Error(`Unable to parse coverage line: ${line}`);
  }
  return value;
};

const records = readFileSync(lcovPath, 'utf8')
  .split('end_of_record')
  .map((record) => record.trim())
  .filter(Boolean)
  .map((record): CoverageRecord => {
    const lines = record.split('\n');
    const sourceFile = lines.find((line) => line.startsWith('SF:'))?.slice(3);
    if (!sourceFile) {
      throw new Error(`Coverage record is missing a source file: ${record}`);
    }

    return {
      file: sourceFile,
      foundLines: parseCount(lines.find((line) => line.startsWith('LF:')) ?? 'LF:0'),
      hitLines: parseCount(lines.find((line) => line.startsWith('LH:')) ?? 'LH:0'),
      foundFunctions: parseCount(lines.find((line) => line.startsWith('FNF:')) ?? 'FNF:0'),
      hitFunctions: parseCount(lines.find((line) => line.startsWith('FNH:')) ?? 'FNH:0'),
    };
  })
  .filter((record) => record.file.startsWith('src/'));

if (records.length === 0) {
  console.error('Coverage report did not include any src/ records.');
  process.exit(1);
}

const totals = records.reduce(
  (acc, record) => ({
    foundLines: acc.foundLines + record.foundLines,
    hitLines: acc.hitLines + record.hitLines,
    foundFunctions: acc.foundFunctions + record.foundFunctions,
    hitFunctions: acc.hitFunctions + record.hitFunctions,
  }),
  { foundLines: 0, hitLines: 0, foundFunctions: 0, hitFunctions: 0 },
);

const lineCoverage = totals.foundLines === 0 ? 0 : (totals.hitLines / totals.foundLines) * 100;
const functionCoverage =
  totals.foundFunctions === 0 ? 0 : (totals.hitFunctions / totals.foundFunctions) * 100;

const uncoveredFiles = records.filter(
  (record) =>
    record.hitLines !== record.foundLines || record.hitFunctions !== record.foundFunctions,
);

if (
  lineCoverage !== requiredPercent ||
  functionCoverage !== requiredPercent ||
  uncoveredFiles.length > 0
) {
  console.error(
    `Source coverage must be ${requiredPercent}% lines and functions. Current: ${functionCoverage.toFixed(
      2,
    )}% funcs, ${lineCoverage.toFixed(2)}% lines.`,
  );

  for (const record of uncoveredFiles) {
    console.error(
      `${record.file}: ${record.hitFunctions}/${record.foundFunctions} funcs, ${record.hitLines}/${record.foundLines} lines`,
    );
  }

  process.exit(1);
}

console.log(
  `Source coverage verified: ${functionCoverage.toFixed(2)}% funcs, ${lineCoverage.toFixed(2)}% lines.`,
);
