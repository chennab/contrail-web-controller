/*
 * Copyright (c) 2017 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view',
    'knockback'
], function (_, ContrailView, Knockback) {
    var gridElId = '#' + ctwc.APPLICATION_POLICY_SET_GRID_ID,
        prefixId = ctwc.APPLICATION_POLICY_SET_PREFIX_ID,
        modalId = 'configure-' + prefixId,
        formId = '#' + modalId + '-form';

    var applicationPolicyEditView = ContrailView.extend({
        renderApplicationPolicy: function(options) {
            var editTemplate = contrail.getTemplate4Id(ctwl.TMPL_APPLICATION_POLICY_SET),
                editLayout = editTemplate({prefixId: prefixId, modalId: modalId}),
                self = this,disable = false;
                var mode = options.mode;
                if(mode === 'edit'){
                    disable = true;
                }
            cowu.createModal({'modalId': modalId, 'className': 'modal-1120',
                             'title': options['title'], 'body': editLayout,
                             'onSave': function () {
                self.model.addEditApplicationPolicy({
                    init: function () {
                        cowu.enableModalLoading(modalId);
                    },
                    success: function () {
                        options['callback']();
                        $("#" + modalId).modal('hide');
                    },
                    error: function (error) {
                        cowu.disableModalLoading(modalId, function () {
                            self.model.showErrorAttr(prefixId +
                                                     cowc.FORM_SUFFIX_ID,
                                                     error.responseText);
                        });
                    }
                }, options);
                // TODO: Release binding on successful configure
            }, 'onCancel': function () {
                Knockback.release(self.model, document.getElementById(modalId));
                kbValidation.unbind(self);
                $("#" + modalId).modal('hide');
            }});

            self.renderView4Config($("#" + modalId).find('#aps-button-container'),
                                   this.model,
                                   getApplicationPolicyViewConfig(), "",
                                   null, null, function() {
                    $("#" + modalId).find('.modal-footer').hide();
                    $("#review_address_groups").on('click', function() {
                        self.renderObject(options, 'address_groups');
                    });
                    $("#review_service_groups").on('click', function() {
                        self.renderObject(options, 'service_groups');
                    });
                    $("#review_visible_tag_for_project").on('click', function() {
                        self.renderObject(options, 'tag');
                    });
                    $("#aps-plus-icon").on('click', function(){
                        self.renderObject(options, 'addIcon');
                    })
                    $("#aps-back-button").on('click', function(){
                        $('#modal-landing-container').show();
                        $("#aps-gird-container").empty();
                        $('#aps-landing-container').hide();
                    });
                self.model.showErrorAttr(prefixId + cowc.FORM_SUFFIX_ID, false);
                Knockback.applyBindings(self.model, document.getElementById(modalId));
                kbValidation.bind(self);
            },null,false);
        },
        renderObject: function(options, objName){
            $('#modal-landing-container').hide();
            $('#aps-save-button').hide();
            $('#aps-landing-container').show();
            var placeHolder = $('#aps-gird-container');
            var viewConfig = options['viewConfig'];
            if(objName === 'address_groups'){
                this.renderView4Config(placeHolder, null, getAddressGroup(viewConfig));
            }else if(objName === 'service_groups'){
                this.renderView4Config(placeHolder, null, getServiceGroup(viewConfig));
            }else if(objName === 'tag'){
                this.renderView4Config(placeHolder, null, getTag(viewConfig));
            }else if(objName === 'addIcon'){
                $('#aps-overlay-container').hide();
                $('#aps-main-container').css('background', "white !important");
                this.renderView4Config($('#aps-main-container'), null, getApplicationPolicy(viewConfig));
            }
         }
    });
    function getAddressGroup(viewConfig){
        return {
            elementId:
                cowu.formatElementId([ctwc.APS_ADDRESS_GRP_LIST_VIEW_ID]),
            view: "addressGroupListView",
            app: cowc.APP_CONTRAIL_CONTROLLER,
            viewPathPrefix: "config/firewall/applicationpolicyset/project/addressgroups/ui/js/views/",
            viewConfig: $.extend(true, {}, viewConfig,
                                 {projectSelectedValueData: viewConfig.projectSelectedValueData})
        }
    }
    function getServiceGroup(viewConfig){
        return {
            elementId:
                cowu.formatElementId([ctwc.APS_SERVICE_GRP_LIST_VIEW_ID]),
            view: "serviceGrouptListView",
            app: cowc.APP_CONTRAIL_CONTROLLER,
            viewPathPrefix: "config/firewall/applicationpolicyset/project/servicegroup/ui/js/views/",
            viewConfig: $.extend(true, {}, viewConfig,
                                 {projectSelectedValueData: viewConfig.projectSelectedValueData})
        }
    }
    function getTag(viewConfig){
        return {
            elementId:
                cowu.formatElementId([ctwc.APS_TAG_LIST_VIEW_ID]),
            view: "tagListView",
            app: cowc.APP_CONTRAIL_CONTROLLER,
            viewPathPrefix: "config/firewall/applicationpolicyset/project/tag/ui/js/views/",
            viewConfig: $.extend(true, {}, viewConfig,
                                 {projectSelectedValueData: viewConfig.projectSelectedValueData})
        }
    }
    function getApplicationPolicy(viewConfig){
        return {
            elementId:
                cowu.formatElementId([ctwc.NEW_APPLICATION_POLICY_SET_LIST_VIEW_ID]),
            view: "newApplicationPolicyListView",
            app: cowc.APP_CONTRAIL_CONTROLLER,
            viewPathPrefix: "config/firewall/applicationpolicyset/project/newapplicationpolicy/ui/js/views/",
            viewConfig: $.extend(true, {}, viewConfig,
                                 {projectSelectedValueData: viewConfig.projectSelectedValueData})
        }
    }
    var getApplicationPolicyViewConfig = function () {
        return {
            elementId: ctwc.APPLICATION_POLICY_SET_PREFIX_ID,
            view: 'SectionView',
            title: "Application Policy Set",
           // active:false,
            viewConfig: {
                rows: [{
                        columns: [
                            {
                                elementId: 'review_address_groups',
                                view: "FormButtonView",
                                label: "Review Address Groups",
                                width:300,
                                viewConfig: {
                                    class: 'display-inline-block'
                                }
                            }
                         ]
                      },
                      {
                          columns: [
                              {
                                  elementId: 'review_service_groups',
                                  view: "FormButtonView",
                                  label: "Review Service Groups",
                                  width:300,
                                  viewConfig: {
                                      class: 'display-inline-block'
                                  }
                              }
                           ]
                        },{
                            columns: [
                                {
                                    elementId: 'review_visible_tag_for_project',
                                    view: "FormButtonView",
                                    label: "Review Visible Tag For Project",
                                    width:300,
                                    viewConfig: {
                                        class: 'display-inline-block'
                                    }
                                }
                             ]
                          }
                    ]
               }
          }
     };

    return applicationPolicyEditView;
});