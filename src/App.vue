<template>
    <h1>Tabs demo</h1>

    <Tabs initial-active="foo" @tabchange="onTabChange">
        <Tab label="Foo" id="foo">
            <p>This tab is about Foo</p>
        </Tab>

        <Tab label="Bar" id="bar">
            <p>This tab is about Bar</p>
        </Tab>

        <Tab label="Baz" id="baz">
            <p>This tab is about Baz</p>
        </Tab>

        <Tab label="Quux" id="quux" :disabled="true">
            <p>This tab is about Quux</p>
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

<style lang="postcss">
@import 'wikimedia-ui-base/wikimedia-ui-base.css';

#app {
    font-family: var( --font-family-base );
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var( --color-base );
}
</style>
