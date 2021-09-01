<template>
	<div class="vue-tabs">
		<div class="vue-tabs__header" role="tablist">
			<div 
				class="vue-tabs__header__list"
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
					class="vue-tabs__header__list__item"
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
			isActive: isActive( item, currentIndex )
		};
	}

	return map;
}, {} ) );

const currentTabId = computed( () => {
	return Object.values( tabsData ).find( ( tab ) => {
		return tab.isActive === true;
	} ).id;
} );

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
	Object.keys( tabsData ).forEach( id => { tabsData[ id ].isActive = false; });
	tabsData[ id ].isActive = true;
	emit( 'tabchange', id );
}

/**
 * Set the tab immediately after the currently active one as active
 */
function next () {
	const ids = Object.keys( tabsData );
	const nextIndex = currentTabIndex.value + 1

	if ( ids.indexOf( nextIndex ) > -1 ) {
		select( nextIndex );
	}
}

/**
 * Set the tab immediately before the currently active one as active
 */
function prev () {
	const ids = Object.keys( tabsData );
	const prevIndex = currentTabIndex.value - 1

	if ( ids.indexOf( prevIndex ) > -1 ) {
		select( prevIndex );
	}
}

// Provide the tabsData object to the child Tab components
provide( 'tabsData', tabsData );
</script>

<style>
</style>