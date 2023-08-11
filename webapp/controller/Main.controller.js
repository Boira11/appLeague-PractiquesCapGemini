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

            onPressCreateLeague: function () {


                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                //Creamos esta variable para tenerla para luego poder acceder al modelo y a la vista a traves del oModel
                var oModel = this.getView().getModel();

                // Creamos un objeto
                var oEntry = {};

                // los id los cogemos del input del fragmento

                var sName = this.getView().byId("idCreateLeague.Name").getValue();
                var sCountry = this.getView().byId("idCreateLeague.Country").getValue();
                var sLevel = this.getView().byId("idCreateLeague.Level").getValue();
                var sPresident = this.getView().byId("idCreateLeague.President").getValue();

                //lo que va despues de oEntry. es como lo hemos puesto en el MainView, fijarse bien en esto ya que si no esta igual petara
                oEntry.name = sName;              
                oEntry.country = sCountry; 
                oEntry.level = sLevel; 
                oEntry.president = sPresident; 


                if(sName && sCountry && sLevel){
                    oModel.create("/Leagues", oEntry, {
                        succes:function(oData){
                            oModel.refresh();
                            
                            MessageBox.succes(oResourceBundle.getText("message.successCreateUni"));
                            onCloseDialogCreateLeague();
                        }.bind(this),
                        error: function(oError){
                            MessageBox.error(oResourceBundle.getText("message.errorCreateUni"), {
                        
                            });
                        }
                    });

                }else{
                    MessageBox.warning(oResourceBundle.getText("message.fieldsRequired"));
                }           
            },

            resetDialog: function () {
                this.getView().byId("idCreateLeague.Name").setValue("");
                this.getView().byId("idCreateLeague.Country").setValue("");
                this.getView().byId("idCreateLeague.Level").setValue("");
                this.getView().byId("idCreateLeague.President").setValue("");
            },
    

            onCloseDialogCreateLeague: function () {
                this.resetDialog();
    
                this._dialogCreateLeagues.then(function(oCreateDialog){
                    oCreateDialog.close();
                });
            },

        });
    });
