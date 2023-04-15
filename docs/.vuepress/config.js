import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import book from '../../book.json'
// import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
// import { resolve } from 'path'
// import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

export default defineUserConfig({
	lang: 'zh-CN',
	title: book.title,
	description: book.description,
	base: '/front-end-enjoy/',
	head: [],
	theme: defaultTheme({
		docsBranch: 'master',
		navbar: [
			{ text: '前端领域', link: '/front-end-basic/' },
			{ text: '前端的进击', link: '/front-end-addon/' },
			{ text: 'FAQ', link: '/faq' },
		],
		repo: 'JGRain/front-end-enjoy',
		sidebar: {
			'/front-end-basic/': [
				{
					title: '前端技能',
					collapsable: true,
					children: [
						'/front-end-basic/skill/research-and-design-process.md',
						'/front-end-basic/skill/design-and-manage-front-end-project.md',
						'/front-end-basic/skill/why-project-reviews-are-important.md',
						'/front-end-basic/skill/front-end-career-planning.md',
					],
				},
				{
					title: '前端性能优化',
					collapsable: true,
					children: [
						'/front-end-basic/performance/front-end-performance-optimization.md',
						'/front-end-basic/performance/front-end-performance-startup.md',
						'/front-end-basic/performance/front-end-performance-analyze.md',
						'/front-end-basic/performance/front-end-performance-render.md',
						'/front-end-basic/performance/front-end-performance-no-responding.md',
						'/front-end-basic/performance/front-end-performance-canvas.md',
						'/front-end-basic/performance/front-end-performance-container.md',
						'/front-end-basic/performance/front-end-performance-ssr.md',
						'/front-end-basic/performance/front-end-performance-optimization-project.md',
					],
				},
				{
					title: '前端架构',
					collapsable: true,
					children: [
						'/front-end-basic/deep-learning/front-end-engineering.md',
						'/front-end-basic/deep-learning/module-seperate.md',
						'/front-end-basic/deep-learning/trace-stash.md',
						'/front-end-basic/deep-learning/build-application.md',
						'/front-end-basic/deep-learning/reactive-programing.md',
						'/front-end-basic/deep-learning/vscode-event.md',
						'/front-end-basic/deep-learning/vscode-ipc.md',
						'/front-end-basic/deep-learning/online-doc-network.md',
						'/front-end-basic/deep-learning/monitor-and-report.md',
						'/front-end-basic/deep-learning/why-spreadsheet-app-excited.md',
						'/front-end-basic/deep-learning/task-runner-design.md',
						'/front-end-basic/deep-learning/network-design-responsibility-driven-design.md',
						'/front-end-basic/deep-learning/network-design-dependency-decoupling.md',
					],
				},
				{
					title: '前端深入理解',
					collapsable: true,
					children: [
						'/front-end-basic/understanding/operation-transform.md',
						'/front-end-basic/understanding/component-communication-with-data-model.md',
						'/front-end-basic/understanding/component-with-configuration.md',
						'/front-end-basic/understanding/component-with-itself.md',
						'/front-end-basic/understanding/app-component-isolation.md',
						'/front-end-basic/understanding/template-engine.md',
						'/front-end-basic/understanding/dialogue-abstraction.md',
						'/front-end-basic/understanding/data-driven-or-event-driven.md',
						'/front-end-basic/understanding/web-browser-render.md',
					],
				},
				{
					title: '前端入门',
					collapsable: true,
					children: [
						'/front-end-basic/front-end/front-end-1.md',
						'/front-end-basic/front-end/front-end-2.md',
						'/front-end-basic/front-end/front-end-3.md',
						'/front-end-basic/front-end/front-end-4.md',
						'/front-end-basic/front-end/front-end-5.md',
						'/front-end-basic/front-end/front-end-6.md',
						'/front-end-basic/front-end/front-end-7.md',
						'/front-end-basic/front-end/front-end-8.md',
						'/front-end-basic/front-end/front-end-9.md',
						'/front-end-basic/front-end/front-end-10.md',
					],
				},
			],
			'/front-end-addon/': [
				{
					title: '不止单线程',
					collapsable: true,
					children: [
						'/front-end-addon/more-than-single-thread/1-thread-and-progress.md',
						'/front-end-addon/more-than-single-thread/2-progress-and-io.md',
						'/front-end-addon/more-than-single-thread/3-interprocess-communication.md',
						'/front-end-addon/more-than-single-thread/4-network-progress-and-tcp-ip.md',
						'/front-end-addon/more-than-single-thread/5-http-and-websocket.md',
						'/front-end-addon/more-than-single-thread/6-socket-and-socket-io.md',
						'/front-end-addon/more-than-single-thread/7-node-js.md',
					],
				},
				{
					title: '简单算法之 js 实现',
					collapsable: true,
					children: [
						'/front-end-addon/simple-algorithm/1-bubble-sort.md',
						'/front-end-addon/simple-algorithm/2-counting-sort.md',
						'/front-end-addon/simple-algorithm/3-insertion-sort.md',
						'/front-end-addon/simple-algorithm/4-merge-sort.md',
						'/front-end-addon/simple-algorithm/5-quick-sort.md',
						'/front-end-addon/simple-algorithm/6-heap-sort.md',
						'/front-end-addon/simple-algorithm/7-quick-select.md',
						'/front-end-addon/simple-algorithm/8-find-maximum-subarray.md',
						'/front-end-addon/simple-algorithm/9-n-n-matrix.md',
					],
				},
				{
					title: '不止纯前端',
					collapsable: true,
					children: [
						'/front-end-addon/more-than-front-end/1-learning-database.md',
						'/front-end-addon/more-than-front-end/2-sql-and-nosql.md',
					],
				},
			],
		},
	}),
	plugins: [
		// googleAnalyticsPlugin({
		// 	id: 'G-6X03SBJR88',
		// }),
		// registerComponentsPlugin({
		// 	components: {
		// 		Adsense: resolve(__dirname, './components/adsense.vue'),
		// 	},
		// }),
	],
})
