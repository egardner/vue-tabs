<template>
	<div class="vue-tabs">
		<div class="vue-tabs__header">
			<div 
				class="vue-tabs__list"
				role="tablist"
				tabindex="0"
				:aria-activedescendant="currentTabId"
				@keydown.right="next"
				@keydown.down.prevent="next"
				@keydown.left="prev"
				@keydown.up.prevent="prev"
			>
				<div
					v-for="( tab, index ) in tabsData"
					:id="tab.id + '-label'"
					:aria-selected="tab.id === currentTabId"
					:aria-controls="tab.id"
					:class="getLabelClasses( tab.id )"
					class="vue-tabs__list__item"
					:key="index"
					role="tab"
					tabindex="-1"
					@click="select( tab.id )"
					@keyup.enter="select( tab.id )"
				>
					{{ tab.label }}
				</div>
			</div>
		</div>

		<div class="vue-tabs__content">
			<slot></slot>
		</div>

		<p>{{ currentTabIndex }}</p>
	</div>
</template>

<script setup>
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

import {
	computed,
	provide,
	reactive,
	useSlots
} from 'vue';

const props = defineProps( {
	/**
	 * Must match the id of one of the tabs. If this prop is not provided, the
	 * inital active tab will be the first one in the markup structure.
	 */
	initialActive: {
		type: String,
		required: false
	}
} );

const emit = defineEmits( [ 'tabchange' ] );

/**
 * Data that will be exposed to the template and injected into the child Tab
 * components so that they can determine their appearance and behavior. Slot
 * content is always an array (of vdom nodes), but we want to reduce this to a
 * single keyed object for easier access to specific tabs.
 *
 * @type {TabsData}
 */
const tabsData = reactive( useSlots().default().reduce( ( map, item, currentIndex ) => {
	function isActive( item, currentIndex ) {
		return props.initialActive ? 
			( item.props.id === props.initialActive ) : 
			( currentIndex === 0 );
	}

	if ( item.props && item.props.id && item.props.label ) {
		map[ item.props.id ] = {
			id: item.props.id,
			label: item.props.label,
			isActive: isActive( item, currentIndex ),
			disabled: item.props.disabled
		};
	}

	return map;
}, {} ) );

/**
 * Computed ref that returns a string
 */
const currentTabId = computed( () => {
	return Object.values( tabsData ).find( ( tab ) => {
		return tab.isActive === true;
	} ).id;
} );

/**
 * Computed ref that returns a number
 */
const currentTabIndex = computed( () => {
	return Object.keys( tabsData ).findIndex( ( id ) => {
		// currentTabId is a reactive object so we need to check its "value"
		return id === currentTabId.value;
	} );
} );

/**
 * @param {string} id
 * @emits tabchange
 */
function select ( id ) {
	if ( tabsData[ id ].disabled ) return;

	Object.keys( tabsData ).forEach( id => { tabsData[ id ].isActive = false; });
	tabsData[ id ].isActive = true;
	emit( 'tabchange', id );
}

/**
 * @param {string} id
 * @returns {Object.<string, boolean>} class object
 */
function getLabelClasses( id ) {
	return {
		'vue-tabs__list__item--current': id === currentTabId.value,
		'vue-tabs__list__item--disabled': tabsData[ id ].disabled,
	}
}

/**
 * Set the tab immediately after the currently active one as active
 */
function next () {
	const ids = Object.keys( tabsData );
	const nextIndex = currentTabIndex.value + 1
	if ( ids[ nextIndex ] ) select( ids[ nextIndex ] );
}

/**
 * Set the tab immediately before the currently active one as active
 */
function prev () {
	const ids = Object.keys( tabsData );
	const prevIndex = currentTabIndex.value - 1
	if ( ids[ prevIndex ] ) select( ids[ prevIndex ] );
}

// Provide the tabsData object to the child Tab components
provide( 'tabsData', tabsData );
</script>

<style lang="postcss">
@import 'wikimedia-ui-base/wikimedia-ui-base.css';

.vue-tabs {
	&__header {
		align-items: flex-end;
		box-shadow: inset 0 -1px 0 0 var(--border-color-base);
		display: flex;
		justify-content: space-between;
	}

	&__list {
		display: flex;

		&__item {
			cursor: pointer;
			font-weight: bold;
			padding: var(--padding-base);
			transition: ease-in-out color 100ms, ease-in-out box-shadow 100ms;
			white-space: nowrap;

			&:hover {
				box-shadow: inset 0 -2px 0 0 var(--color-primary--hover);
				color: var(--color-primary--hover);
			}

			&:active {
				box-shadow: inset 0 -2px 0 0 var(--color-primary--active);
				color: var(--color-primary--active);
			}

			&:focus {
				outline: 0;
			}

			&--current {
				box-shadow: inset 0 -2px 0 0 var(--color-primary);
				color: var(--color-primary);
			}

			&--disabled {
				color: var(--color-base--disabled);
				cursor: not-allowed;

				&:hover,
				&:active {
					box-shadow: unset;
					color: var(--color-base--disabled);
				}
			}
		}
	}

	&__content {
		padding: var(--padding-base);
	}
}

</style>