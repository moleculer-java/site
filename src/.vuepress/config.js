module.exports = {

	theme: '@vuepress/theme-default',
	title: 'Moleculer',
	description: 'Build hybrid microservices: call Java from Node.js and Node.js from Java over one Moleculer cluster.',
	base: '/site/',
	dest: '../docs',

    plugins: [
		[
			'tabs'
		],
		[
			'@vuepress/back-to-top'
		],
        [
            '@vuepress/google-analytics', {'ga': 'UA-156080046-1'}
        ],
		[
			'vuepress-plugin-medium-zoom',
			{
				selector: '.zoom',
				delay: 1000,
				options: {
					margin: 24,
					scrollOffset: 0
				}
			}
		],
        [
            'robots',
            {
                host: "https://moleculer-java.github.io/site",
                disallowAll: false,
                allowAll: true,
                sitemap: "/sitemap.xml",
                policies: [
                    {
                        userAgent: '*'
                    }
                ]
            }
        ],
        [
            'sitemap',
            {
                hostname: 'https://moleculer-java.github.io/site',
                exclude: ['/404.html']
            }
        ]
    ],
	head: [
		['link', { rel: 'icon', href: 'favicon.ico'}]
	],
	themeConfig: {
		logo: 'logo.png',
		repo: 'https://github.com/moleculer-java/moleculer-java',
		repoLabel: 'GitHub',
		docsRepo:  'moleculer-java/site',
		docsDir:   'src',
		editLinks: true,
		editLinkText: 'Edit this page on GitHub',
		lastUpdated:  'Last Updated',		
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Documentation', link: 'interop-overview' },
			{ text: 'Donate', link: 'https://www.patreon.com/berkesa' }
		],
		sidebar: [
			{
				title: 'Java ↔ Node.js Interop',
				sidebarDepth: 2,
				children: [
					['interop-overview',     'Overview — the two doors'],
					['interop-setup',        'Setup — one cluster'],
					['quickstart',           'Quick start'],
					['call-java-from-node',  'Call Java from Node.js'],
					['call-node-from-java',  'Call Node.js from Java'],
					['interop-data-types',   'Data types & features']
				]
			},
			{
				title: 'Getting started',
				sidebarDepth: 2,
				children: [
					['introduction', 'Introduction'],
					['concepts',     'Moleculer concepts']
				]
			},
			{
				title: 'Core reference (Java)',
				sidebarDepth: 1,
				children: [
					['broker',            'Service Broker'],
					['services',          'Services'],
					['lifecycle',         'Lifecycle'],
					['actions',           'Actions'],
					['middlewares',       'Middlewares'],
					['caching',           'Caching'],
					['events',            'Events'],
					['internal-services', 'Internal Services'],
					['logging',           'Logging'],
					['runner',            'Runner'],
					['tasks',             'Background processes'],
					['performance-tips',  'Performance tips']
				]
			},
			{
				title: 'Clustering reference',
				sidebarDepth: 1,
				children: [
					['transporters',    'Transporters'],
					['serializers',     'Serializers'],
					['balancing',       'Load balancing'],
					['fault-tolerance', 'Fault tolerance']
				]
			},
			{
				title: 'Java modules (optional)',
				sidebarDepth: 1,
				children: [
					['moleculer-web',  'Web API Gateway'],
					['moleculer-repl', 'Moleculer REPL'],
					['mongo-client',   'MongoDB client'],
					['http-client',    'HTTP client'],
					['jmx-service',    'JMX Service']
				]
			}
		]
	}
}