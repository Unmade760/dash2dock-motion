// Development only, not part of the extension. Run it with `make lint`.
//
// Trailing underscores mark deliberately unused destructured values, which is
// the convention the shell's own sources use.

export default [
    {
        files: ['*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ARGV: 'readonly',
                TextDecoder: 'readonly',
                TextEncoder: 'readonly',
                _: 'readonly',
                clearInterval: 'readonly',
                clearTimeout: 'readonly',
                console: 'readonly',
                global: 'readonly',
                imports: 'readonly',
                log: 'readonly',
                logError: 'readonly',
                print: 'readonly',
                printerr: 'readonly',
                setInterval: 'readonly',
                setTimeout: 'readonly',
            },
        },
        rules: {
            curly: ['error', 'multi-or-nest', 'consistent'],
            eqeqeq: ['error', 'smart'],
            semi: ['error', 'always'],
            'no-cond-assign': ['error', 'except-parens'],
            'no-constant-condition': 'error',
            'no-dupe-class-members': 'error',
            'no-dupe-keys': 'error',
            'no-empty': ['error', {allowEmptyCatch: true}],
            'no-fallthrough': 'error',
            'no-invalid-this': 'error',
            'no-prototype-builtins': 'off',
            'no-redeclare': 'error',
            'no-self-assign': 'error',
            'no-undef': 'error',
            'no-unreachable': 'error',
            'no-unused-vars': ['error', {args: 'none', varsIgnorePattern: '^_|_$'}],
            'no-var': 'error',
            'prefer-const': 'error',
        },
    },
];
