//require('load-grunt-tasks')(grunt);

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);


	grunt.initConfig({
		concat : {
			js : {
				src: [
					"components/LayersViewer.js",
					"components/ContextMenu.js",
					"js/G.js",
					"js/utils/logger.js",
					"js/lib/alerts.js",
					"js/config.js",
					"js/components/Analyzer.js",
					"js/components/creator.js",
					"js/components/guiManager.js",
					"js/components/panelManager.js",
					"js/components/colorManager.js",
					"js/utils/GVector2f.js",
					"js/utils/utils.js",
					"js/components/menu.js",
					"js/components/slider.js",
					"js/components/chatViewer.js",
					"js/components/contextMenu.js",
					"js/components/fileManager.js",
					"js/components/optionManager.js",
					"js/components/input.js",
					"js/components/canvasManager.js",
					"js/utils/canvasHandler.js",
					"js/components/contentManager.js",
					"js/components/selectedObjects.js",
					"js/components/layer.js",
					"js/components/scene.js",
					"js/components/eventManager.js",
					"js/components/timeLine.js",
					"js/components/ConnectionManager.js",
					"js/components/projectManager.js",
					"js/components/paintManager.js",
					"js/listeners.js",
					"js/main.js",
					"js/objects/entity.js",
					"js/components/creatorViewer.js",
					"js/objects/text.js",
					"js/objects/table.js",
					"js/objects/class.js",
					"js/objects/polygon.js",
					"js/objects/join.js",
					"js/objects/rect.js",
					"js/objects/paint.js",
					"js/objects/line.js",
					"js/objects/arc.js",
					"js/objects/area.js",
					"js/objects/graph.js",
					"js/objects/imageObject.js",
					"js/objects/textArea.js",
					"js/objects/arrow.js",
					"js/utils/test.js",
					"js/components/sharer.js",
					"js/components/taskManager.js",
					"js/components/formManager.js"
				],
				dest: "build/scripts.min.js"
			},
			css : {
				src: [
					/*
					"css/alerts.css", 
					"css/form.css", 
					"css/chat.css", 
					"css/panel.css", 
					"css/styles.css",
					*/
					"css/Components.css",
					"css/Styles.css"
				],
				dest: "build/styles.css"
			}
		},
		watch: {
				js : {
					files : ["js/**/*.js"],
					tasks : ["concat:js"]
				},
				
				//css : {
				//	files : ["css/**/*.css"],
				//	tasks : ["concat:css"]
				//},
				sass : {
					files : ["components/Components.scss", "css/**/*.scss"],
					tasks : ["sass"]//netreba volať concat lebo sa zavola watch kvoli zmene css suboru
				}
		},
		sass: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					'css/Components.css': 'components/Components.scss',
					'css/Styles.css': 'css/styles.scss',
				}
			}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: ['babel-preset-es2015']
			},
			dist: {
				files: {
					'build/scripts.min.js': 'build/scripts.min.js'
				}
			}
		},
		uglify: {
			my_target: {
				files: {
					'build/scripts.min.js': ['build/scripts.min.js']
				}
			}
		}
	});

	require('time-grunt')(grunt);

	//TODO remove unused CSS
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', ["sass", "concat", "watch"]);
	grunt.registerTask('build', ["sass","concat", "babel", "uglify"]);
}