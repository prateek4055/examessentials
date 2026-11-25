import fs from 'node:fs';
import ts from 'typescript';

// Execute our own data-only module after removing TypeScript types. Regex parsing
// loses template literals, apostrophes, arrays and the actual pricing function.
export async function loadPosterData() {
  const source = fs.readFileSync(new URL('../src/apps/medposterhub/data/posters.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
