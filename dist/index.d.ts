import postcss from 'postcss';
import { PluginOptions } from './contracts';
import { FontGrabber } from './font-grabber';
declare function makeInstance(options: PluginOptions | undefined): FontGrabber;
declare const plugin: postcss.Plugin<PluginOptions>;
export { makeInstance, plugin as postcssFontGrabber, };
export default plugin;
