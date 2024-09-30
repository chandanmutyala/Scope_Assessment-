sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/m/Token"
], function (Controller, JSONModel, Filter, FilterOperator, ValueHelpDialog, Token) {
    "use strict";

    return Controller.extend("scopeassessment.controller.sa", {

        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("./model/data.json");
            this.getView().setModel(oModel, "countryModel");
            this.aSelectedScopeIds = [];  
        
           // Listen to changes in the MultiInput tokens (added or removed)
    var oMultiInput = this.byId("scopeIdMultiInput");
    oMultiInput.attachTokenUpdate(this._onTokenUpdate, this);
        },
        
        _onTokenUpdate: function (oEvent) {
            var oMultiInput = oEvent.getSource();
            var aRemovedTokens = oEvent.getParameter("removedTokens");
            var aAddedTokens = oEvent.getParameter("addedTokens");
        
            // Check if the MultiInput source is valid
            if (!oMultiInput) {
                console.error("MultiInput source is not valid.");
                return;
            }
        
            // Handle removed tokens
            if (aRemovedTokens) {
                aRemovedTokens.forEach(function(oToken) {
                    var sRemovedKey = oToken.getKey();
                    var iIndex = this.aSelectedScopeIds.indexOf(sRemovedKey);
                    if (iIndex > -1) {
                        this.aSelectedScopeIds.splice(iIndex, 1);
                    }
                }, this);
            }
        
            // Handle added tokens
            if (aAddedTokens) {
                aAddedTokens.forEach(function(oToken) {
                    var sAddedKey = oToken.getKey();
                    if (this.aSelectedScopeIds.indexOf(sAddedKey) === -1) {
                        this.aSelectedScopeIds.push(sAddedKey);
                    }
                }, this);
            }
        
            console.log("Updated Selected Scope IDs Array:", this.aSelectedScopeIds);  // Log for debugging
        
            // Immediately apply filters based on the updated aSelectedScopeIds
            this._applyCombinedFilters();
        },
        
        
        onValueHelpRequest: function () {
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = new sap.m.SelectDialog({
                    title: "Select Scope ID",
                    multiSelect: true,
                    items: {
                        path: '/ScopeItems',
                        template: new sap.m.StandardListItem({
                            title: "{ScopeItemID}",
                            description: "{ScopeItemDescription}"
                        })
                    },
                    confirm: this._handleValueHelpClose.bind(this),
                    cancel: this._handleValueHelpClose.bind(this)
                });
                this.getView().addDependent(this._oValueHelpDialog);
            }
            
            this._oValueHelpDialog.open();
        },
        
        _handleValueHelpClose: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems");
            var oMultiInput = this.byId("scopeIdMultiInput");
        
            // Clear the previous selections
            this.aSelectedScopeIds = [];
            oMultiInput.removeAllTokens();
        
            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    var sScopeItemID = oItem.getTitle();
        
                    oMultiInput.addToken(new sap.m.Token({
                        key: sScopeItemID,
                        text: sScopeItemID
                    }));
        
                    this.aSelectedScopeIds.push(sScopeItemID);
                }, this);
            }
        
            // Apply combined filters whenever the Scope ID is changed
            this._applyCombinedFilters();
        },
        
        onComboBoxSelectionChange: function () {
            // Call the combined filter function when any of the ComboBox selections change
            this._applyCombinedFilters();
        },
        
        _applyCombinedFilters: function () {
            var aFilters = [];
        
           // Create filters based on selected scope IDs
           if (this.aSelectedScopeIds.length > 0) {
            var aScopeFilters = this.aSelectedScopeIds.map(function (sScopeItemID) {
                return new sap.ui.model.Filter("ScopeItemID", sap.ui.model.FilterOperator.EQ, sScopeItemID);
            });
    
            // Combine scope filters with OR logic
            var oScopeIDFilter = new sap.ui.model.Filter({
                filters: aScopeFilters,
                and: false  // Use OR condition for Scope IDs
            });
    
            aFilters.push(oScopeIDFilter);
        }
        
            // Step 2: Add Description Filters
            var oDescComboBox = this.byId("descriptionComboBox");
            var aSelectedDesc = oDescComboBox.getSelectedKeys();
            if (aSelectedDesc.length > 0) {
                var aDescFilters = aSelectedDesc.map(function (sKey) {
                    return new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.EQ, sKey);
                });
        
                var oDescFilter = new sap.ui.model.Filter({
                    filters: aDescFilters,
                    and: false  // OR operator for multiple Descriptions
                });
        
                aFilters.push(oDescFilter);
            }
        
            // Step 3: Add LOB Filters
            var oLOBComboBox = this.byId("lobComboBox");
            var aSelectedLOBs = oLOBComboBox.getSelectedKeys();
            if (aSelectedLOBs.length > 0) {
                var aLOBFilters = aSelectedLOBs.map(function (sKey) {
                    return new sap.ui.model.Filter("LOB", sap.ui.model.FilterOperator.EQ, sKey);
                });
        
                var oLOBFilter = new sap.ui.model.Filter({
                    filters: aLOBFilters,
                    and: false  // OR operator for multiple LOBs
                });
        
                aFilters.push(oLOBFilter);
            }
        
            // Step 4: Add Business Area Filters
            var oBusinessAreaComboBox = this.byId("businessAreaComboBox");
            var aSelectedBusinessAreas = oBusinessAreaComboBox.getSelectedKeys();
            if (aSelectedBusinessAreas.length > 0) {
                var aBusinessAreaFilters = aSelectedBusinessAreas.map(function (sKey) {
                    return new sap.ui.model.Filter("BusinessArea", sap.ui.model.FilterOperator.EQ, sKey);
                });
        
                var oBusinessAreaFilter = new sap.ui.model.Filter({
                    filters: aBusinessAreaFilters,
                    and: false  // OR operator for multiple Business Areas
                });
        
                aFilters.push(oBusinessAreaFilter);
            }
        
            // Step 5: Add Status Filters
            var oStatusComboBox = this.byId("statusComboBox");
            var aSelectedStatuses = oStatusComboBox.getSelectedKeys();
            if (aSelectedStatuses.length > 0) {
                var aStatusFilters = aSelectedStatuses.map(function (sKey) {
                    return new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sKey);
                });
        
                var oStatusFilter = new sap.ui.model.Filter({
                    filters: aStatusFilters,
                    and: true  // OR operator for multiple Statuses
                });
        
                aFilters.push(oStatusFilter);
            }
        
            // Step 6: Apply Combined Filter to the Table
            var oTable = this.byId("scopeItemsTable");
            var oBinding = oTable.getBinding("rows");
        
            if (oBinding) {
                if (aFilters.length > 0) {
                    console.log("Applying Combined Filter:", aFilters);  // Log filter for debugging
                    oBinding.filter(new sap.ui.model.Filter(aFilters, true), sap.ui.model.FilterType.Application);
                } else {
                    // If no filters are applied, clear existing filters
                    console.log("Clearing filters.");  // Log for debugging
                    oBinding.filter([]);
                }
            } else {
                console.error("Table binding not found.");  // Debugging information
            }
        },
        



        onAfterRendering: function () {
            this._applyCustomStyles(); // Ensure this is called after rendering
        },

        onCountrySelectionChange: function (oEvent) {
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var oTable = this.byId("scopeItemsTable");
            var aColumns = oTable.getColumns();
            // var oColumnMapping = this.getView().getModel("countryModel").getProperty("/columnMapping");

            var oColumnMapping = this.getOwnerComponent().getModel("countryModel").getProperty("/columnMapping");

            // var oModel = this.getOwnerComponent().getModel("countryModel");
            // this.getView().setModel(oModel,"countryModel");
            console.log("Selected keys: ", aSelectedKeys);




            var updateColumnVisibility = function () {
                var bAnyKeySelected = aSelectedKeys.length > 0;

                // If no key is selected, show all columns
                if (!bAnyKeySelected) {
                    aColumns.forEach(function (oColumn, i) {
                        if (i >= 4) {  // Assuming country columns start from index 6
                            oColumn.setVisible(true);  // Show all columns if no country is selected
                        }
                    });
                } else {
                    // If any key is selected, hide all columns first
                    aColumns.forEach(function (oColumn, i) {
                        if (i >= 5) {  // Assuming country columns start from index 6
                            oColumn.setVisible(false);  // Hide all columns initially
                        }
                    });

                    // Show only the columns that match the selected country keys
                    aColumns.forEach(function (oColumn, i) {
                        if (i >= 4) {  // Assuming country columns start from index 6
                            var sKey = Object.keys(oColumnMapping).find(function (key) {
                                return oColumnMapping[key] === (i + 1);  // Adjust +1 based on your mapping logic
                            });

                            // If the column matches the selected country key, show it
                            if (sKey && aSelectedKeys.includes(sKey)) {
                                oColumn.setVisible(true);  // Show the matching country column
                            }
                        }
                    });
                }
            };





            updateColumnVisibility();
        }
    });
});