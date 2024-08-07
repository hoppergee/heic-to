import * as esbuild from 'esbuild';
import fs from 'fs'

// Build heic-to.js

await esbuild.build({
  entryPoints: [
    'src/worker.js'
  ],
  bundle: true,
  minify: false,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/worker.js',
  external: ['fs', 'path']
});

const workerFileContent = fs.readFileSync('tmp/worker.js', 'utf8')

esbuild.build({
  entryPoints: [
    'src/index.js'
  ],
  bundle: true,
  minify: false,
  target: 'es6',
  platform: 'browser',
  outfile: 'dist/heic-to.js',
  format: 'esm',
  define: {
    WORKER_FILE_CONTENT: JSON.stringify(workerFileContent)
  }
});

// Build heic-to.min.js

await esbuild.build({
  entryPoints: [
    'src/worker.js'
  ],
  bundle: true,
  minify: true,
  target: 'es6',
  platform: 'browser',
  outfile: 'tmp/worker.min.js',
  external: ['fs', 'path']
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