/*global module*/
module.exports = function(grunt) {
  var prefix = require('./webapp/manifest.json')["sap.app"].id.replace(/\./g, "/");

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      prepare: ['dist/', 'tmp/'],
      cleanup: ['tmp/']
    },
    copy: {
        tmp: {
            files: [
                {
                    expand: true,
                    cwd: "webapp/",
                    src: ["*.*", "**/*.*"],
                    dest: "tmp/webapp/",
                },
                {
                    expand: true,
                    cwd: "",
                    src: ["neo-app.json"],
                    dest: "tmp/",
                }
            ]
        }
    },
    compress: {
      main: {
        options: {
          archive: 'dist/deployable.zip'
        },
        expand: true,
        cwd: 'tmp/',
        src: ['**/*'],
        dest: '/'
      }
    },
    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: 'webapp',
            prefix: prefix,
            src: [
              './**/*.js',
              './**/*.fragment.html',
              './**/*.fragment.json',
              './**/*.fragment.xml',
              './**/*.view.html',
              './**/*.view.json',
              './**/*.view.xml',
              './**/*.properties'
            ]
          },
          dest: 'tmp/webapp',
          compress: true
        },
        components: true
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-openui5');
  grunt.registerTask('default', ['clean:prepare', 'copy:tmp', 'openui5_preload', 'compress'/*, 'clean:cleanup'*/]);

};