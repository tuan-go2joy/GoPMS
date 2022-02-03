module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: {
          // Script parser for `<script>`
          js: 'espree',

          // Script parser for `<script lang="ts">`
          ts: '@typescript-eslint/parser',

          // Script parser for vue directives (e.g. `v-if=` or `:attribute=`)
          // and vue interpolations (e.g. `{{variable}}`).
          // If not specified, the parser determined by `<script lang ="...">` is used.
          '<template>': 'espree',
        },
      },
    },
  ],
  env: {
    // This allows defineProps and defineEmits vue macro from the no-undef eslint rule.
    'vue/setup-compiler-macros': true,

    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    //
    // Override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    //
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        // Allow following usage: `const { notUsing, ...using } = someObject;`
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        // Allow following usage: `interface IEmpty extends IParent {};`
        allowSingleExtends: true,
      },
    ],
    'vue/multi-word-component-names': ['off'],
  },
};
