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

### JSDoc Type Definitions

For now the code is in plain JS. But some type hinting can be provided by
using `@type` and `@typedef` tags in JSDoc; VSCode will pick these up automatically,
even across different files in the workspace.

Definitions can be written like this:

```js
/**
 * Data for a single tab
 *
 * @typedef {Object} TabData
 * @property {string} id
 * @property {string} label
 * @property {boolean} isActive
 * @property {boolean} disabled
 */

/**
 * Map containing all data for all tabs, keyed by tab id.
 *
 * @typedef {Object.<string, TabData>} TabsData
 */

// ...

/**
 * @type {TabsData}
 */
const tabsData = getTabsData();
```
