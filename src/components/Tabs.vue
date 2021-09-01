<template>
	<div class="vue-tabs">
		<div class="vue-tabs__header" role="tablist">
			<div 
				v-for="( tab, index ) in tabsData" 
				:key="index"
				role="tab"
				@click="onClick( tab.id )"
				:style="{ fontWeight: tab.isActive ? 'bold' : 'normal' }"
			>
				{{ tab.label }}
			</div>
		</div>

		<div class="vue-tabs__content">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
import { reactive, provide, useSlots } from 'vue';

// Define an optional "initialActive" prop, which must match the id of one of
// the tabs. If this is not given, the initial active tab will be the first one.
const props = defineProps( {
	initialActive: {
		type: String,
		required: false
	}
} );

// Define the events that the component emits; in this case, a "tabchange"
// event.
const emit = defineEmits( [ 'tabchange' ] );

// Construct the "tabs" data that will be exposed to the template and injected
// to the child Tab components so that they can determine their appearance and
// behavior. Slot content is always an array (of vdom nodes), but we want to
// reduce this to a single keyed object for easier access to specific tabs.
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

// Handle click events and emit a "tabchange" event
const onClick = ( id ) => {
	Object.keys( tabsData ).forEach( id => { tabsData[ id ].isActive = false; } );
	tabsData[ id ].isActive = true;
	emit( 'tabchange', id );
}

// Provide the tabsData object to the child Tab components
provide( 'tabsData', tabsData );
</script>

<style>
</style>