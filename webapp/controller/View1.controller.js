sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, oDataModel, BusyIndicator, MessageBox, MessageToast, ResourceModel) {
	"use strict";

	return Controller.extend("GRBpostPack.controller.View1", {
		
		onInit: function(){
			var oView = this.getView();
			var i18nModel = new ResourceModel({
				bundleName: "GRBpostPack.i18n.i18n"
			});
			oView.setModel(i18nModel, "i18n");	
		},
		
		scanHU: function(evt) {
			if (evt.getSource.getValue !== '') {
				var oView = this.getView();
				var config = this.getOwnerComponent().getManifest();
				var sServiceUrl = config["sap.app"].dataSources.ZECOMBPOST_SRV.uri;
				var oData = new oDataModel(sServiceUrl, true);
				var query = "/StoreReceiptSet(Zinhalt='" + evt.getSource().getValue() + "',Action='2')";
				BusyIndicator.show();
				evt.getSource().setValue("");
				oData.read(query, null, null, true, function(response) {
						BusyIndicator.hide();
						if (response.Message === 'OK') {
							var msg = oView.getModel("i18n").getResourceBundle().getText("OrderFinalized");
							MessageToast.show(msg,{
								my: "center top",
								at: "center top"
							});
						} else {
							var path = $.sap.getModulePath("GRBpostPack", "/audio");
							var aud = new Audio(path + "/MOREINFO.png");
							aud.play();
							MessageBox.error(response.Message, {
								title: "Error"
							});
						}
					},
					function(error) {
						BusyIndicator.hide();
						var path = $.sap.getModulePath("GRBpostPack", "/audio");
						var aud = new Audio(path + "/MOREINFO.png");
						aud.play();
						MessageBox.error(JSON.parse(error.response.body).error.message.value, {
							title: "Error"
						});
					});
			}
		}
	});
});