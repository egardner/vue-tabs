import { InjectionKey } from "vue";
import { TabData } from './types';

export const TabsKey: InjectionKey<Record<string,TabData>> = Symbol( 'Tabs' );