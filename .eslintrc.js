module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': ['eslint:recommended'],
    'parserOptions': {
        "ecmaVersion": 6,
        'sourceType': 'module',
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    'rules': {
        'indent': [
            'error',
            2
        ],
        'no-console': 'off',
        // 'linebreak-style': [
        //     'error',
        //     'unix'
        // ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        "arrow-body-style": [
            "error",
            "as-needed"
        ]
    }
};
