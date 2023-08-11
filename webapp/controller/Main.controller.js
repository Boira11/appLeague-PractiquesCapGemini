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

            onPressOpenCreateLeague: function(){

                var oView = this.getView();
                var oModel = this.getView().getModel();


                // create value help dialog

                if(!this._dialogCreateLeagues){
                    this._dialogCreateLeagues = Fragment.load({
                        id: oView.getId(),
                        name: "appleagues.view.fragments.CreateLeague",
                        controller: this
                    },

                    ).then(function(oCreateDialog){
                        oView.addDependent(oCreateDialog); // El addDependent es como unir el dialogo a su Vista ( siempre hay que hacerlo) al crear el fragmento
                        return oCreateDialog;

                    });
                }
                

                //open value help dialog
                this._dialogCreateLeagues.then(function(oCreateDialog){
                    oCreateDialog.open();
                })

                

            },

        });
    });
