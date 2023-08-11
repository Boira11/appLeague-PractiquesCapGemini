sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageBox, FilterOperator, Filter) {
        "use strict";

        return Controller.extend("appleagues.controller.Main", {
            onInit: function () {

                this.oRouter = this.getOwnerComponent().getRouter();

            },
            onPressObject: function (oEvent){
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

                var iID = oEvent.getSource().getSelectedItem().getBindingContext().getObject().idLeague;
                console.log("ID: ", iID);

                //la variable oRouter la hemos creado en el onInit
                this.oRouter.navTo("RouteDetail", {
                    league: iID                   
                });

                this.byId("idTableMain").removeSelections();
            },
        });
    });
