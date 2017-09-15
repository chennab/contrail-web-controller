/*
 * Copyright (c) 2017 Juniper Networks, Inc. All rights reserved.
 */

define([
    'underscore',
    'contrail-view',
    'knockback'
], function (_, ContrailView, Knockback) {
    var newApplicationPolicyEditView = ContrailView.extend({
        renderApplicationPolicy: function(options) {

            var self = this,disable = false;
            var mode = options.mode, headerText;
            if(mode === 'edit'){
                disable = true;
                headerText = 'Edit Application Policy Sets';
            }else if(mode === 'add'){
                headerText = 'Create Application Policy Sets';
            }else{
                headerText = 'Delete Application Policy Sets';
            }
            var viewConfig = options.viewConfig;
            $('#aps-overlay-container').show();
            $("#aps-gird-container").empty();
            $('#aps-save-button').show();
            self.setErrorContainer(headerText);
            if(mode === 'delete'){
                $('#aps-save-button').text('Confirm');
                var deleteContainer = $('<div style="padding-top:30px;"></div>');
                var deletText = $('<span style="padding-left:300px;">Are you sure you want to delete ?</span>');
                deleteContainer.append(deletText);
                $('#gird-details-container').append(deleteContainer);
                //back method
                $("#aps-back-button").off('click').on('click', function(){
                    $('#aps-save-button').hide();
                    Knockback.ko.cleanNode($("#aps-gird-container")[0]);
                    $("#aps-gird-container").empty();
                    self.renderView4Config($("#aps-gird-container"), null, getAddressGroup(viewConfig));
                    $('#aps-save-button').text('Save');
                });
                
                // save method
                $("#aps-save-button").off('click').on('click', function(){
                    self.model.deleteAddressGroup(options['selectedGridData'],{
                        success: function () {
                            $('#aps-save-button').text('Save');
                            $('#aps-save-button').hide();
                            Knockback.ko.cleanNode($("#aps-gird-container")[0]);
                            $("#aps-gird-container").empty();
                            self.renderView4Config($("#aps-gird-container"), null, getAddressGroup(viewConfig));
                        },
                        error: function (error) {
                            $("#grid-details-error-container").text('');
                            $("#grid-details-error-container").text(error.responseText);
                            $(".aps-details-error-container").show();
                        }
                    });
                });
            }else{
                $("#aps-back-button").text('Cancel');
                $("#aps-back-button").off('click').on('click', function(){
                    $("#aps-gird-container").empty();
                    //self.renderView4Config($("#aps-gird-container"), null, getAddressGroup(viewConfig));
                    $('#aps-save-button').text('Save');
                    $('#aps-overlay-container').hide();
                });
                /*self.renderView4Config($('#gird-details-container'),
                        this.model,
                        getAddressGroupViewConfig(disable),
                        "addressGroupValidation",
                        null, null, function() {
                             $("#aps-back-button").off('click').on('click', function(){
                                 $('#aps-save-button').hide();
                                 Knockback.ko.cleanNode($("#aps-gird-container")[0]);
                                 $("#aps-gird-container").empty();
                                 self.renderView4Config($("#aps-gird-container"), null, getAddressGroup(viewConfig));
                             });
                             $("#aps-save-button").off('click').on('click', function(){
                                 self.model.addEditAddressGroup({
                                     success: function () {
                                         $('#aps-save-button').hide();
                                         Knockback.ko.cleanNode($("#aps-gird-container")[0]);
                                         $("#aps-gird-container").empty();
                                         self.renderView4Config($("#aps-gird-container"), null, getAddressGroup(viewConfig));
                                     },
                                     error: function (error) {
                                         $("#grid-details-error-container").text('');
                                         $("#grid-details-error-container").text(error.responseText);
                                         $(".aps-details-error-container").show();
                                     }
                                 }, options);
                             });
                             Knockback.applyBindings(self.model,
                                                     document.getElementById('aps-gird-container'));
                             kbValidation.bind(self, {collection:
                                               self.model.model().attributes.subnetCollection});
                },null,true);*/
            }
        },
        setErrorContainer : function(headerText){
            $('#aps-gird-container').append($('<h6></h6>').text(headerText).addClass('aps-details-header'));
            var errorHolder = $('<div></div>').addClass('alert-error clearfix aps-details-error-container');
            var errorSpan = $('<span>Error : </span>').addClass('error-font-weight');
            var errorText = $('<span id="grid-details-error-container"></span>');
            errorHolder.append(errorSpan);
            errorHolder.append(errorText);
            $('#aps-gird-container').append(errorHolder);
            $('#aps-gird-container').append($('<div id = "gird-details-container"></div>'));
        }
    });
    return newApplicationPolicyEditView;
});