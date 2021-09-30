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

<script setup lang="ts">
import { reactive, inject } from 'vue';
import { TabsKey } from '../symbols';

const props = defineProps<{
	label: string,
	id: string,
	disabled?: boolean
}>();

const tabsData = inject( TabsKey );
if ( !tabsData ) {
	throw new Error( 'Tab component must used inside a parent Tabs component' );
}

const tab = reactive( tabsData[ props.id ] );
</script>