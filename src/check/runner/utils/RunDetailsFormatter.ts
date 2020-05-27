import { stringify } from '../../../utils/stringify';
import { VerbosityLevel } from '../configuration/VerbosityLevel';
import { ExecutionStatus } from '../reporter/ExecutionStatus';
import { ExecutionTree } from '../reporter/ExecutionTree';
import { RunDetails } from '../reporter/RunDetails';
import { IProperty } from '../../property/Property';
import fc, { IAsyncProperty, Parameters } from '../../../fast-check';

/** @hidden */
function formatHints(hints: string[]): string {
  if (hints.length === 1) {
    return `Hint: ${hints[0]}`;
  }
  return hints.map((h, idx) => `Hint (${idx + 1}): ${h}`).join('\n');
}

/** @hidden */
function formatFailures<Ts>(failures: Ts[]): string {
  return `Encountered failures were:\n- ${failures.map(stringify).join('\n- ')}`;
}

/** @hidden */
function formatExecutionSummary<Ts>(executionTrees: ExecutionTree<Ts>[]): string {
  const summaryLines: string[] = [];
  const remainingTreesAndDepth: { depth: number; tree: ExecutionTree<Ts> }[] = [];
  for (const tree of executionTrees.reverse()) {
    remainingTreesAndDepth.push({ depth: 1, tree });
  }
  while (remainingTreesAndDepth.length !== 0) {
    const currentTreeAndDepth = remainingTreesAndDepth.pop();

    // format current tree according to its depth
    const currentTree = currentTreeAndDepth!.tree;
    const currentDepth = currentTreeAndDepth!.depth;
    const statusIcon =
      currentTree.status === ExecutionStatus.Success
        ? '\x1b[32m\u221A\x1b[0m'
        : currentTree.status === ExecutionStatus.Failure
        ? '\x1b[31m\xD7\x1b[0m'
        : '\x1b[33m!\x1b[0m';
    const leftPadding = Array(currentDepth).join('. ');
    summaryLines.push(`${leftPadding}${statusIcon} ${stringify(currentTree.value)}`);

    // push its children to the queue
    for (const tree of currentTree.children.reverse()) {
      remainingTreesAndDepth.push({ depth: currentDepth + 1, tree });
    }
  }
  return `Execution summary:\n${summaryLines.join('\n')}`;
}

/** @hidden */
function preFormatTooManySkipped<Ts>(out: RunDetails<Ts>) {
  const message = `Failed to run property, too many pre-condition failures encountered\n{ seed: ${out.seed} }\n\nRan ${
    out.numRuns
  } time(s)\nSkipped ${out.numSkips} time(s)`;
  let details: string | null = null;
  const hints = [
    'Try to reduce the number of rejected values by combining map, flatMap and built-in arbitraries',
    'Increase failure tolerance by setting maxSkipsPerRun to an higher value'
  ];

  if (out.verbose >= VerbosityLevel.VeryVerbose) {
    details = formatExecutionSummary(out.executionSummary);
  } else {
    hints.push(
      'Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status'
    );
  }

  return { message, details, hints };
}

/** @hidden */
function preFormatFailure<Ts>(out: RunDetails<Ts>) {
  const message = `Property failed after ${out.numRuns} tests\n{ seed: ${out.seed}, path: "${
    out.counterexamplePath
  }", endOnFailure: true }\nCounterexample: ${stringify(out.counterexample)}\nShrunk ${
    out.numShrinks
  } time(s)\nGot error: ${out.error}`;
  let details: string | null = null;
  const hints = [];

  if (out.verbose >= VerbosityLevel.VeryVerbose) {
    details = formatExecutionSummary(out.executionSummary);
  } else if (out.verbose === VerbosityLevel.Verbose) {
    details = formatFailures(out.failures);
  } else {
    hints.push('Enable verbose mode in order to have the list of all failing values encountered during the run');
  }

  return { message, details, hints };
}

/** @hidden */
function preFormatEarlyInterrupted<Ts>(out: RunDetails<Ts>) {
  const message = `Property interrupted after ${out.numRuns} tests\n{ seed: ${out.seed} }`;
  let details: string | null = null;
  const hints = [];

  if (out.verbose >= VerbosityLevel.VeryVerbose) {
    details = formatExecutionSummary(out.executionSummary);
  } else {
    hints.push(
      'Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status'
    );
  }

  return { message, details, hints };
}

/** @hidden */
function throwIfFailed<Ts>(out: RunDetails<Ts>) {
  if (!out.failed) return;

  // TODO Either extract some kind of formatRunDetails: string | undefined
  //      Or interpretRunDetails: {message, details, hint} | null
  //      Or as we started codeSnippetFor... but will it be enough for future usages? Create a file onto the file system (async)...

  // Then user could use something like https://codesandbox.io/s/wylx7lrrl7?file=/index.js:44-52
  // Or https://codesandbox.io/docs/importing#get-request to push failures onto their codesandbox if they want to

  const { message, details, hints } =
    out.counterexample == null
      ? out.interrupted
        ? preFormatEarlyInterrupted(out)
        : preFormatTooManySkipped(out)
      : preFormatFailure(out);

  let errorMessage = message;
  if (details != null) errorMessage += `\n\n${details}`;
  if (hints.length > 0) errorMessage += `\n\n${formatHints(hints)}`;
  throw new Error(errorMessage);
}

export { throwIfFailed };

// Manually playground

declare function fc_formatRunDetails<Ts>(out: RunDetails<Ts>): string | undefined;

// formatRunDetails: string | undefined
export async function customAssertA<Ts>(property: IAsyncProperty<Ts>, params?: Parameters<Ts>) {
  const out = await fc.check(property, params);

  if (!out.failed) return;

  const genericErrorMessage = fc_formatRunDetails(out);
  if (out.counterexample == null) throw new Error(genericErrorMessage);

  throw new Error(`${genericErrorMessage}\n\n${'await callMethod(out.counterexample)'}`);
}
export function buildCustomAssertB<Ts extends any[]>(property: IAsyncProperty<Ts>, params?: Parameters<Ts>) {
  return {
    run: async function customAssert(callMethod?: (...generatedValues: Ts) => Promise<string>) {
      const out = await fc.check(property, params);

      if (!out.failed) return;

      const genericErrorMessage = fc_formatRunDetails(out);
      if (!callMethod || out.counterexample == null) throw new Error(genericErrorMessage);

      throw new Error(`${genericErrorMessage}\n\n${await callMethod(...out.counterexample)}`);
    }
  };
}
export async function withCustomAssert<Ts extends any[]>(
  run: Promise<RunDetails<Ts>>,
  callMethod: (...generatedValues: Ts) => Promise<string>
) {
  const out = await run;
  if (!out.failed) return;

  const genericErrorMessage = fc_formatRunDetails(out);
  if (out.counterexample == null) throw new Error(genericErrorMessage);

  throw new Error(`${genericErrorMessage}\n\n${await callMethod(...out.counterexample)}`);
}
export async function withCustomAssertB<Ts extends any[]>(
  run: Promise<RunDetails<Ts>>,
  config: {
    onRunInterrupted: (...generatedValues: Ts) => Promise<string>;
    onRunFailed: (...generatedValues: Ts) => Promise<string>;
    onRunTooManySkip: (...generatedValues: Ts) => Promise<string>;
  }
) {
  const out = await run;
  if (!out.failed) return;

  const genericErrorMessage = fc_formatRunDetails(out);
  if (out.counterexample == null) throw new Error(genericErrorMessage);

  throw new Error(`${genericErrorMessage}\n\n${await config.onRunInterrupted(...out.counterexample)}`);
}
