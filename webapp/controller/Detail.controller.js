sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("appleagues.controller.Detail", {
            onInit: function () {

                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oViewModel = new JSONModel({
                    busy: false,
                    delay: 0
                });
                this.getOwnerComponent().getRouter().getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
                this.getView().setModel(oViewModel, "detailView");

            },
            _onObjectMatched: function (oEvent) {
                this.sObjectId = oEvent.getParameter("arguments").league;
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                this.getView().getModel().metadataLoaded().then(function () {
                    var sObjectPath = this.getView().getModel().createKey("Leagues", {
                        idLeague: this.sObjectId
                    });
                    this._bindView("/" + sObjectPath);
                    console.log("Id DETALLE: ", this.sObjectId)                   
                }.bind(this));
            },

            _bindView: function (sObjectPath) {
                // Set busy indicator during view binding
                var oViewModel = this.getView().getModel("detailView");
                oViewModel.setProperty("/busy", false);   
    
                this.getView().bindElement({
                    path: sObjectPath,
                    parameters: {
                        expand: "teams"
                    },
                    
                
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (odata) {
                            oViewModel.setProperty("/busy", true);
                        },
                        dataReceived: function (odata) {
                            oViewModel.setProperty("/busy", false);
                        }
                    }

                });
                
            },
            _onBindingChange: function () {
                var oView = this.getView(),
                    oElementBinding = oView.getElementBinding();
                if (!oElementBinding.getBoundContext()) {
                    this.getOwnerComponent().getRouter().getTargets().display("detailObjectNotFound");
                    return;
                }
                var sPath = oElementBinding.getPath(),
                    oObject = oView.getModel().getObject(sPath);
    
                this.oSemanticObject = oObject.type;              
            }

    

        });
    });
