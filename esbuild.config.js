const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Ensure output directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copyResources = () => {};

esbuild.build({
  entryPoints: ['./build/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  platform: 'node',
  target: 'node16',
  format: 'cjs',
  external: [],
  mainFields: ['main', 'module'],
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.cwd': 'process.cwd'
  },
  resolveExtensions: ['.ts', '.js', '.json'],
  alias: {
    src: path.resolve(__dirname, 'src')
  }
}).then(() => {
  copyResources();
}).catch(() => process.exit(1));