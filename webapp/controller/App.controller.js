sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";
  
      return BaseController.extend("appleagues.controller.App", {
        onInit() {
          var oViewModel = new JSONModel({
            busy : true,
            delay : 0,
            layout : "OneColumn",
            previousLayout : "",
            actionButtonsInfo : {
              midColumn : {
              fullScreen: false
              }
            }
          });
          this.getView().setModel(oViewModel, "appView");

        }
      });
    }
  );
  