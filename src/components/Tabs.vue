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
					v-for="( tab, key ) in tabsData"
					:id="tab.id + '-label'"
					:aria-selected="tab.id === currentTabId"
					:aria-controls="tab.id"
					:class="getLabelClasses( tab.id )"
					class="vue-tabs__list__item"
					:key="key"
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

<script setup lang="ts">
import { TabData } from '../types';
import { TabsKey } from '../symbols';
import {
	computed,
	provide,
	reactive,
	useSlots,
	VNode
} from 'vue';

const props = defineProps<{
	initialActive?: string
}>();

// const emit = defineEmits( [ 'tabchange' ] );
const emit = defineEmits<{
	(e: 'tabchange', id: string): void
}>();

const contents = useSlots()?.default?.();
if ( !contents ) {
	throw new Error( `One or more <tab> components must be provided` );
}

/**
 * Reactive record for all tabs that have been provided in the default slot
 */
const tabsData = reactive( contents.reduce( ( map: Record<string, TabData>, item: VNode, currentIndex: number ) => {
	function isActive( item: VNode, currentIndex: number ) : boolean {
		const id = item?.props?.id;
		const initialActive = props.initialActive;
		return initialActive ? ( id === initialActive ) : ( currentIndex === 0 );
	}

	if ( item && item.props && item.props.id && item.props.label ) {
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
 * Reactive string ID of the active tab
 */
const currentTabId = computed( () => {
	return Object.values( tabsData ).find( ( tab ) => {
		return tab.isActive === true;
	} )?.id;
} );

/**
 * Reactive numerical index of the active tab
 */
const currentTabIndex = computed( () => {
	return Object.keys( tabsData ).findIndex( ( id ) => {
		// currentTabId is a reactive object so we need to check its "value"
		return id === currentTabId.value;
	} );
} );

/**
 * Set the target tab to active
 */
function select ( id: string ) {
	if ( tabsData[ id ].disabled ) return;

	Object.keys( tabsData ).forEach( id => { tabsData[ id ].isActive = false; });
	tabsData[ id ].isActive = true;
	emit( 'tabchange', id );
}

function getLabelClasses( id: string ) {
	return {
		'vue-tabs__list__item--current': id === currentTabId.value,
		'vue-tabs__list__item--disabled': tabsData[ id ].disabled,
	}
}

/**
 * Select the next tab in the markup, if one exists
 */
function next () {
	const ids = Object.keys( tabsData );
	const nextIndex = currentTabIndex.value + 1
	if ( ids[ nextIndex ] ) select( ids[ nextIndex ] );
}

/**
 * Select the previous tab in the markup, if one exists
 */
function prev () {
	const ids = Object.keys( tabsData );
	const prevIndex = currentTabIndex.value - 1
	if ( ids[ prevIndex ] ) select( ids[ prevIndex ] );
}

// Provide the tabsData object to the child Tab components
provide( TabsKey, tabsData );
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