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
