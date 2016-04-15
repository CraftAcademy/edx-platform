;(function (define) {
    'use strict';

    define(['backbone',
            'jquery',
            'underscore',
            'gettext',
            'text!../../../templates/learner_dashboard/program_card.underscore',
            'picturefill'
           ],
         function(
             Backbone,
             $,
             _,
             gettext,
             programCardTpl,
             picturefill
         ) {
            return Backbone.View.extend({

                className: 'program-card',

                tpl: _.template(programCardTpl),

                initialize: function(data) {
                    this.progressCollection = data.context.progressCollection; 
                    this.progressModel = this.progressCollection.findWhere({
                        programId: this.model.get('id')
                    });
                    this.render();
                },

                render: function() {
                    var data = $.extend({}, this.model.toJSON(), this.getProgramProgress());

                    this.$el.html(this.tpl(data));
                    this.postRender();
                },

                postRender: function() {
                    if(navigator.userAgent.indexOf('MSIE') !== -1 ||
                        navigator.appVersion.indexOf('Trident/') > 0){
                        /* Microsoft Internet Explorer detected in. */
                        window.setTimeout( function() {
                            this.reLoadBannerImage();
                        }.bind(this), 100);
                    }
                },

                getProgramProgress: function() {
                    var progress = this.progressModel.toJSON();
                    
                    progress.total_courses = progress.completed + progress.in_progress + progress.not_started;

                    return {
                        progress: progress
                    };
                },

                // Defer loading the rest of the page to limit FOUC
                reLoadBannerImage: function() {
                    var $img = this.$('.program_card .banner-image'),
                        imgSrcAttr = $img ? $img.attr('src') : {};
                    
                    if (!imgSrcAttr || imgSrcAttr.length < 0) {
                        try{
                            this.reEvaluatePicture();
                        }catch(err){
                            //Swallow the error here
                        }
                    }
                },

                reEvaluatePicture: function(){
                    picturefill({
                        reevaluate: true
                    });
                }
            });
        }
    );
}).call(this, define || RequireJS.define);
