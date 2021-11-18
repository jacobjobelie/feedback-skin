import { join, resolve } from 'path'
import build from '../../scripts/esbuild'

build(
  {
    bundle: true,
    sourcemap: false,
    external: ['dot-env-flow', 'mock-aws-s3', 'nock', 'aws-sdk'],
  },
  { entry: './src/**/*.ts', cwd: join(process.cwd(), '../..') },
)
