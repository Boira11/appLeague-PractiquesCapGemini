sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/core/Fragment',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, Fragment) {
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
            },

            onCloseDetailPress: function () {
                this.getView().getModel("appView").setProperty("/layout", "OneColumn"); 
                this.getOwnerComponent().getRouter().navTo("RouteMain");
            },

            onPressOpenCreateTeam: function(){

                var oView = this.getView();
                var oModel = this.getView().getModel();


                // create value help dialog

                if(!this._dialogCreateTeams){
                    this._dialogCreateTeams = Fragment.load({
                        id: oView.getId(),
                        name: "appleagues.view.fragments.CreateTeam",
                        controller: this
                    },

                    ).then(function(oCreateDialog){
                        oView.addDependent(oCreateDialog); // El addDependent es como unir el dialogo a su Vista ( siempre hay que hacerlo) al crear el fragmento
                        return oCreateDialog;

                    });
                }
                

                //open value help dialog
                this._dialogCreateTeams.then(function(oCreateDialog){
                    oCreateDialog.open();
                })

                

            },

            onPressCreateTeam: function () {


                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                //Creamos esta variable para tenerla para luego poder acceder al modelo y a la vista a traves del oModel
                var oModel = this.getView().getModel();

                // Creamos un objeto
                var oEntry = {};

                // los id los cogemos del input del fragmento

                var sName = this.getView().byId("idCreateTeam.name").getValue();
                var sCity = this.getView().byId("idCreateTeam.city").getValue();
                var sStadium = this.getView().byId("idCreateTeam.stadium").getValue();


                //lo que va despues de oEntry. es como lo hemos puesto en el MainView, fijarse bien en esto ya que si no esta igual petara
                oEntry.league_idLeague =  this.sObjectId;
                oEntry.name = sName;              
                oEntry.city = sCity; 
                oEntry.stadium = sStadium; 

                if(sName){
                    oModel.create("/Teams", oEntry, {
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

            // resetDialog: function () {
            //     this.getView().byId("idCreateLeague.Name").setValue("");
            //     this.getView().byId("idCreateLeague.Country").setValue("");
            //     this.getView().byId("idCreateLeague.Level").setValue("");
            //     this.getView().byId("idCreateLeague.President").setValue("");
            // },
    

            onCloseDialogCreateLeague: function () {
               // this.resetDialog();
    
                this._dialogCreateTeams.then(function(oCreateDialog){
                    oCreateDialog.close();
                });
            },

    

        });
    });
