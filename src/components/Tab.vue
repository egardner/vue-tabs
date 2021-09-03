<template>
	<div 
		v-show="tab.isActive"
		:id="id"
		:aria-hidden="!tab.isActive"
		:aria-labelledby="`${id}-label`"
		class="vue-tab"
		role="tabpanel"
	>
		<slot></slot>
	</div>
</template>

<script setup>
// @ts-check

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

/**
 * @type {import("../types").TabData}
 */
const tab = reactive( inject( 'tabsData' )[ props.id ] );
</script>

<style>
</style>