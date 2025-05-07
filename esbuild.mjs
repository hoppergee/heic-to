import * as esbuild from 'esbuild';
import fs from 'fs'

fs.mkdirSync("tmp/src/csp", { recursive: true });

const copyAndReplace = (sourceFilePath, destinationFilePath, regexPattern, replacementText) => {
  const content = fs.readFileSync(sourceFilePath, 'utf-8');
  const modifiedContent = content.replace(regexPattern, replacementText);
  fs.writeFileSync(destinationFilePath, modifiedContent);
}

copyAndReplace("src/worker.js", "tmp/src/worker.js", /LIB_HEIF_PATH/, '"../../src/lib/libheif"')
copyAndReplace("src/worker.js", "tmp/src/csp/worker.js", /LIB_HEIF_PATH/, '"../../../src/lib/libheif-without-unsafe-eval"')

// ################
// Build heic-to.js
// ################

await esbuild.build({
  entryPoints: [
    'tmp/src/worker.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/worker.js',
  external: ['fs', 'path', 'crypto']
});

const workerFileContent = fs.readFileSync('tmp/worker.js', 'utf8')

esbuild.build({
  entryPoints: [
    'src/index.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'dist/heic-to.js',
  format: 'esm',
  define: {
    WORKER_FILE_CONTENT: JSON.stringify(workerFileContent)
  }
});

// ################
// Build heic-to.min.js
// ################

await esbuild.build({
  entryPoints: [
    'tmp/src/worker.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/worker.min.js',
  external: ['fs', 'path', 'crypto']
});

const workerFileMinifyContent = fs.readFileSync('tmp/worker.min.js', 'utf8')

esbuild.build({
  entryPoints: [
    'src/index.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'dist/heic-to.min.js',
  format: 'esm',
  define: {
    WORKER_FILE_CONTENT: JSON.stringify(workerFileMinifyContent)
  }
});

// ################
// Build csp/heic-to.js
// ################

await esbuild.build({
  entryPoints: [
    'tmp/src/csp/worker.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/csp/worker.js',
  external: ['fs', 'path', 'crypto'],
});

const cspWorkerFileContent = fs.readFileSync('tmp/csp/worker.js', 'utf8')

esbuild.build({
  entryPoints: [
    'src/index.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'dist/csp/heic-to.js',
  format: 'esm',
  define: {
    WORKER_FILE_CONTENT: JSON.stringify(cspWorkerFileContent)
  }
});

// ################
// Build csp/heic-to.min.js
// ################

await esbuild.build({
  entryPoints: [
    'tmp/src/csp/worker.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/csp/worker.min.js',
  external: ['fs', 'path', 'crypto']
});

const cspWorkerFileMinifyContent = fs.readFileSync('tmp/csp/worker.min.js', 'utf8')

esbuild.build({
  entryPoints: [
    'src/index.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'dist/csp/heic-to.min.js',
  format: 'esm',
  define: {
    WORKER_FILE_CONTENT: JSON.stringify(cspWorkerFileMinifyContent)
  }
});

// ################
// Build for iife/heic-to.js
// ################

await esbuild.build({
  entryPoints: [
    'tmp/src/worker.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/iife/worker.js',
  external: ['fs', 'path', 'crypto']
});

const iifeWorkerFileMinifyContent = fs.readFileSync('tmp/iife/worker.js', 'utf8')

// Produce an IIFE bundle
esbuild.build({
  entryPoints: [
    'src/iife.js'
  ],
  bundle: true,
  minify: false,
  target: 'es6',
  platform: 'browser',
  outfile: 'dist/iife/heic-to.js',
  format: 'iife',
  globalName: 'HeicTo',
  define: {
    WORKER_FILE_CONTENT: JSON.stringify(iifeWorkerFileMinifyContent)
  }
});
