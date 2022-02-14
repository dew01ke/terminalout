import typescript from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

export default [
    {
        input: 'src/index.ts',
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: true,
            preserveModules: true,
            preserveModulesRoot: 'src'
        },
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                transpileOnly: true
            }),
            renameNodeModules('external_modules'),
        ],
    }
];
