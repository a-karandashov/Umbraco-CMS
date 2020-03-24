﻿(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name Umbraco.Editors.FileUploadController
     * @function
     *
     * @description
     * The controller for the file upload property editor.
     *
    */
    function fileUploadController($scope, fileManager) {
        
        $scope.fileChanged = onFileChanged;
        //declare a special method which will be called whenever the value has changed from the server
        $scope.model.onValueChanged = onValueChanged;

        /**
         * Called when the file selection value changes
         * @param {any} value
         */
        function onFileChanged(value) {
            $scope.model.value = value;
        }

        /**
         * called whenever the value has changed from the server
         * @param {any} newVal
         * @param {any} oldVal
         */
        function onValueChanged(newVal, oldVal) {
            //clear current uploaded files
            fileManager.setFiles({
                propertyAlias: $scope.model.alias,
                culture: $scope.model.culture,
                files: []
            });
        }
        
    };

    angular.module("umbraco")
        .controller('Umbraco.PropertyEditors.FileUploadController', fileUploadController)
        .run(function (mediaHelper, umbRequestHelper, assetsService) {
            if (mediaHelper && mediaHelper.registerFileResolver) {
                // NOTE: The 'entity' can be either a normal media entity or an "entity" returned from the entityResource
                // they contain different data structures so if we need to query against it we need to be aware of this.
                mediaHelper.registerFileResolver("Umbraco.UploadField", function (property, entity, thumbnail) {
                    if (thumbnail) {
                        if (mediaHelper.detectIfImageByExtension(property.value)) {

                            // Get default big thumbnail from image processor
                            return mediaHelper.getProcessedImageUrl(property.value,
                                {
                                    animationprocessmode: "first",
                                    cacheBusterValue: moment(entity.updateDate).format("YYYYMMDDHHmmss"),
                                    width: 500
                                })
                                .then(function (url) {
                                    return url;
                                });
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return property.value;
                    }
                });

            }
        });


})();
