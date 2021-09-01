<template>
    <h1>Tabs demo</h1>

    <Tabs initial-active="foo" @tabchange="onTabChange">
        <Tab label="Foo" id="foo">
            <p>This tab is about Foo</p>
        </Tab>

        <Tab label="Bar" id="bar">
            <p>This tab is about Bar</p>
        </Tab>
    </Tabs>
</template>

<script setup>
import Tabs from './components/Tabs.vue';
import Tab from './components/Tab.vue';

const onTabChange = ( id ) => {
    console.log( `tab changed to ${ id }` );
};
</script>

<style>
#app {
    font-family: var( --font-family-base );
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var( --color-base );
}
</style>
