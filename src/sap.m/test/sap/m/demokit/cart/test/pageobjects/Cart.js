sap.ui.define([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/AggregationFilled',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/ui/test/matchers/Properties',
		'sap/ui/test/matchers/AggregationContainsPropertyEqual',
		'sap/ui/test/matchers/BindingPath',
		'sap/ui/test/matchers/Ancestor',
		'sap/ui/test/actions/Press'
	], function (Opa5, AggregationFilled, PropertyStrictEquals, Properties, AggregationContainsPropertyEqual, BindingPath, Ancestor, Press) {
		var CART_VIEW_NAME = "Cart";

		Opa5.createPageObjects({
			onTheCart : {

				actions : {

					iPressOnTheEditButton : function () {

						return this.waitFor({
							viewName : CART_VIEW_NAME,
							controlType : "sap.m.Button",
							matchers : new PropertyStrictEquals({name : "icon", value : "sap-icon://edit"}),
							actions : new Press(),
							errorMessage : "The edit button could not be pressed"
						});
					},

					iPressOnTheDeleteButton : function () {
						return this.waitFor({
							id : "entryList",
							viewName : CART_VIEW_NAME,
							matchers : new PropertyStrictEquals({name : "mode", value : "Delete"}),
							actions : function (oList) {
								oList.fireDelete({listItem : oList.getItems()[0]});
							},
							errorMessage : "The delete button could not be pressed"
						});
					},

					iPressOnTheAcceptButton : function () {
						return this.waitFor({
							viewName : CART_VIEW_NAME,
							controlType : "sap.m.Button",
							matchers : new PropertyStrictEquals({name : "icon", value : "sap-icon://accept"}),
							actions : new Press(),
							errorMessage : "The accept button could not be pressed"
						});
					},

					iPressOnSaveForLaterForTheFirstProduct : function () {
						return this.waitFor({
							controlType : "sap.m.ObjectAttribute",
							viewName : CART_VIEW_NAME,
							matchers : new BindingPath({path : "/cartEntries/HT-1254", modelName: "cartProducts"}),
							success: function (aObjectAttributes) {
								this.waitFor({
									controlType : "sap.m.Text",
									matchers: new Ancestor(aObjectAttributes[0], true),
									actions : new Press()
								});
							}
						});
					},
					iPressOnAddBackToBasketForTheFirstProduct : function () {
						return this.waitFor({
							controlType : "sap.m.ObjectAttribute",
							viewName : CART_VIEW_NAME,
							matchers : new BindingPath({path : "/savedForLaterEntries/HT-1254", modelName: "cartProducts"}),
							success: function (aObjectAttributes) {
								this.waitFor({
									controlType : "sap.m.Text",
									matchers: new Ancestor(aObjectAttributes[0], true),
									actions : new Press()
								});
							}
						});
					}
				},

				assertions : {

					iShouldSeeTheProductInMyCart : function () {
						return this.waitFor({
							id : "entryList",
							viewName : CART_VIEW_NAME,
							matchers : new AggregationFilled({name : "items"}),
							success : function () {
								Opa5.assert.ok(true, "The cart has entries");
							},
							errorMessage : "The cart does not contain any entries"
						});
					},

					iShouldNotSeeASaveForLaterFooter : function () {
						return this.waitFor({
							viewName : "Cart",
							id : "entryList",
							success : function (oList) {
								Opa5.assert.strictEqual("", oList.getFooterText(), "The footer is not visible");
							},
							errorMessage : "The footer is still visible"
						});
					},

					theEditButtonHelper  : function (bIsEnabled) {
						var sErrorMessage = "The edit button is enabled";
						var sSuccessMessage = "The edit button is disabled";
						if (bIsEnabled) {
							sErrorMessage = "The edit button is disabled";
							sSuccessMessage = "The edit button is enabled";
						}
						return this.waitFor({
							controlType : "sap.m.Button",
							autoWait: bIsEnabled,
							matchers : new Properties({
								icon : "sap-icon://edit",
								enabled: bIsEnabled
							}),
							success : function (aButtons) {
								Opa5.assert.strictEqual(
									aButtons[0].getEnabled(), bIsEnabled, sSuccessMessage
								);
							},
							errorMessage : sErrorMessage
						});
					},

					theEditButtonShouldBeDisabled : function () {
						return this.theEditButtonHelper(false);
					},

					theEditButtonShouldBeEnabled : function () {
						return this.theEditButtonHelper(true);
					},

					iShouldSeeTheDeleteButton : function () {
						return this.waitFor({
							controlType : "sap.m.List",
							matchers : new PropertyStrictEquals({name : "mode", value : "Delete"}),
							success : function (aLists) {
								Opa5.assert.ok(
									aLists[0],
									"The delete button was found"
								);
							},
							errorMessage : "The delete button was not found"
						});
					},

					iShouldNotSeeTheDeletedItemInTheCart : function () {
						return this.waitFor({
							id : "entryList",
							viewName : CART_VIEW_NAME,
							check : function (oList) {
								var bExist =  new AggregationContainsPropertyEqual({
									aggregationName : "items",
									propertyName : "title",
									propertyValue : "Flat S"
								}).isMatching(oList);
								return !bExist;
							},
							success : function (oList) {
								Opa5.assert.strictEqual(
									oList.getItems().length,
									0,
									"The cart does not contain our product"
								);
							},
							errorMessage : "The cart contains our product"
						});
					},

					iShouldBeTakenToTheCart : function () {
						return this.waitFor({
							id : "entryList",
							viewName : CART_VIEW_NAME,
							success : function (oList) {
								Opa5.assert.ok(
									oList,
									"The cart was found"
								);
							},
							errorMessage : "The cart was not found"
						});
					},

					iShouldSeeOneProductInMySaveForLaterList: function () {
						return this.waitFor({
							id : "saveForLaterList",
							viewName : CART_VIEW_NAME,
							success : function (oList) {
								Opa5.assert.strictEqual(oList.getItems().length, 1, "Product saved for later");
							}
						});
					}
				}

			}
		});

	}
);
