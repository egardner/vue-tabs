<template>
	<div 
		class="vue-tab"
		v-show="tab.isActive"
	>
		<slot></slot>
	</div>
</template>

<script setup>
import { reactive, inject } from 'vue';

// Tab instances must have a label and an id; the latter must be unique
// but there is no way to validate for that here; we may want to enforce
// uniqueness at the level of the parent.
const props = defineProps( {
	label: {
		type: String,
		required: true
	},

	id: {
		type: String,
		required: true
	},

	disabled: {
		type: Boolean,
		default: false
	}
} );

// The data for the current tab represented by this component instance
const tab = reactive( inject( 'tabsData' )[ props.id ] );
</script>

<style>
</style>