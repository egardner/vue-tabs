# Vue-Tabs Demo Component

This repo is an experiment in how to develop UI components with Vue 3 and Vite.
Other technologies like PostCSS and Typescript may also come into play.

## Usage

```sh
# install the dependencies
yarn install

# run the dev server
yarn run dev

# build static files
yarn run build
```

## Other Notes

### PostCSS

PostCSS is being used to transpile certain future CSS features (custom
properties, nested rulesets) into backwards-compatible code.

Vite can support PostCSS automatically, but a series of plugins are needed
for the transformations. They are defined and configured in `postcss.config.js`.

This allows Vue SFCs to include style tags like this:

```html
<style lang="postcss">
@import 'wikimedia-ui-base/wikimedia-ui-base.css';
.vue-tabs {
	&__header {
		align-items: flex-end;
		box-shadow: inset 0 -1px 0 0 var(--border-color-base);
		display: flex;
		justify-content: space-between;
	}
}
</style>
```

If other features are needed (like `@apply`), just add the appropriate plugin.

### Script Setup

Components are written using the Composition API and `<script setup>`, which is
Vue3's recommended way of doing things when you are using both SFCs and the new
API: https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

All variables in the top-level scope are visible to the template; there is no
need to define a function that returns them. Some compiler macros are also
available here (`defineProps`, `defineEmits`, etc.); these don't need to be
imported and are transformed at compile-time into equivalent code; they aren't
available at runtime.

### Type definitions for JavaScript

It is possible to use TypeScript types in [plain JavaScript
projects](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html);
this code will attempt to demonstrate an approach to doing this.

A TypeScript definitions file lives at `src/types.d.ts`. This file exports
some interfaces as in a standard TS project:

```typescript
export interface TabData {
	id: string,
	label: string,
	isActive: boolean,
	disabled: boolean
}
```

Inside the JavaScript Vue components, it is possible to get type hinting in
VSCode (and likely many other editors) by "importing" these types in JSDoc `@type`
tags:

```js
/**
 * @type {import("../types").TabData}
 */
const tab = reactive( inject( 'tabsData' )[ props.id ] );
```

Finally, for an extra level of type-checking, add a `// @ts-check` comment at the top
of the file (or the script tag of a Vue SFC).

With that line added, a properly-configured error will flag a line like:

```js
const bar = tab.bar

// => "Property 'bar' does not exist on type 'TabData'."
```

Since these features come from the editor itself, there is no need to add a TypeScript
dependency to `package.json` unless additional functionality is needed.

### Build Configuration

This demo uses Vite's [Library Mode](https://vitejs.dev/guide/build.html#library-mode)
feature to generate files for distribution. This feature allows easy generation
of bundles in multiple formats (UMD, ESM, CJS, IIFE). An alternate `src/lib.js`
entry point has been provided that exports only the components themselves, not any
of the demo scaffolding or the public `index.html` file.

* Tree-shaking happens by default (any unused code will be eliminated from build)
* Vue component templates are compiled into render functions
* CSS is compiled into a separate stand-alone file that only includes component
  style rules and inlined variables that were used (see CSS next config for
  details)
* Vue.js itself has been externalized and will not be included in the build.

Here's what gets generated currently:

```
dist/vue-tabs.style.css		0.74 KiB / brotli: 0.25 KiB
dist/vue-tabs.es.js		2.24 KiB / brotli: 0.96 KiB
dist/vue-tabs.cjs.js		2.43 KiB / brotli: 0.93 KiB
```














