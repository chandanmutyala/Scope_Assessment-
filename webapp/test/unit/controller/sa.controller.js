/*global QUnit*/

sap.ui.define([
	"scope-assessment/controller/sa.controller"
], function (Controller) {
	"use strict";

	QUnit.module("sa Controller");

	QUnit.test("I should test the sa controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
