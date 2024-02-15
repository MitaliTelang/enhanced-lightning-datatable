import { LightningElement, track, api } from 'lwc';
import template from "./customDataTableTemplate.html";
export default class CustomDataTableTemplate extends LightningElement {
    @track displayRows = [];
    @api columns;
    @api hideheader;
    @api hidecheckboxcolumn;
    @api showrownumbercolumn;
    @api maxrowselection;
    @api sorteddirection;
    @api hideemptycolumns;
    @api defaultsortdirection;
    @api selectedrows;
    @track selectedRecord = [];
    @track selectedRecs = [];
    @track columnsBackup;
    @api allsource;
    @track source_data;
    @track selecteddata;

    @api apppagesize;
    @api pagination;

    allcolumnslen;
    appPageNumber = 1;
    appTotalPages = 0;
    appTotalRecords = 0;

    @api source;

    get source() {
        this.allcolumnslen = this.allsource.length;
        this.appTotalRecords = this.allcolumnslen;
        if (!this.pagination) {
            this.apppagesize = this.allcolumnslen;
        }
        this.appTotalPages = Math.ceil(this.allcolumnslen / this.apppagesize);
        this.appPaginationHelper();
        return this.source_data;
    }
    set source(val) {
        //  Note that we get null if there data is not yet present in the Omniscript
        if (val === null || val === undefined) {
            return;
        }
        var count = 0;
        var node = {};
        var cNode = {};
        var fName;
        var cloneColumns;

        if ((typeof this.hideemptycolumns == "boolean" && this.hideemptycolumns == true) ||
            (typeof this.hideemptycolumns == "string" && this.hideemptycolumns == "true")) {
            //pre columns removal
            var columnsLength = this.columns != null ? this.columns.length : 0;
            var columnsBackupLength = this.columnsBackup != null ? this.columnsBackup.length : 0;
            if (columnsLength > columnsBackupLength) {
                this.columnsBackup = this.columns;
            }
            if (columnsLength < columnsBackupLength) {
                this.columns = this.columnsBackup;
            }

            //remove columns if all rows are blank
            if (this.columns != null) {
                cloneColumns = this.columns.slice();
                for (var i = this.columns.length - 1; i >= 0; i--) {
                    count = 0;
                    for (var j = 0; j < val.length; j++) {
                        node = val[j];
                        cNode = this.columns[i];
                        fName = cNode['fieldName'];
                        var nodeValue = node[fName];
                        if (nodeValue != null && nodeValue.toString().trim() != "") {
                            count++;
                        }
                    }
                    if (count == 0) {
                        cloneColumns.splice(i, 1);
                    }
                }
                this.columns = cloneColumns;
            }
        }
        this.source_data = val;
    }

    connectedCallback() {
        this.maxrowselection = this.maxrowselection == null ? 1 : this.maxrowselection;

    }

    render() {
        return template;
    }

    handleSelection(event) {

        event.preventDefault();


        if (event.detail.config.action === 'selectAllRows') {
            for (let l = 0; l < this.allsource.length; l++) {
                this.selectedRecs.push(this.allsource[l]);
            }
        } else if (event.detail.config.action === 'deselectAllRows') {
            this.selectedRecs = [];
        } else {
            if (event.detail.config.action === 'rowSelect') {

                for (let l = 0; l < event.detail.selectedRows.length; l++) {

                    if (event.detail.selectedRows[l].id === event.detail.config.value) {
                        this.selectedRecs.push(event.detail.selectedRows[l]);
                    }

                }
            } else if (event.detail.config.action === 'rowDeselect') {
                var index;
                for (let j = 0; j < this.selectedRecs.length; j++) {
                    if (this.selectedRecs[j].id === event.detail.config.value) {
                        index = j;

                        break;
                    }
                }
                this.selectedRecs.splice(index, 1);

            }


        }
        if (event.detail.config.action) {
            this.dispatchEvent(new CustomEvent("getselectedrows", {
                bubbles: true,
                detail: this.selectedRecs
            }));
        }
    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                return primer(x[field]);
            }
            : function (x) {
                return x[field];
            };

        return function (a, b) {
            a = key(a);
            b = key(b);
            if (a == null) {
                return 1;
            }
            else if (b == null) {
                return -1;
            } else {
                return reverse * ((a > b) - (b > a));
            }
        };
    }

    onHandleSort(event) {

        const { fieldName: sortedBy, sortDirection } = event.detail;

        const sortFieldName = this.columns.find(field => sortedBy === field.fieldName).sortBy ? this.columns.find(field => sortedBy === field.fieldName).sortBy : sortedBy;
        const cloneData = [...this.allsource];

        cloneData.sort(this.sortBy(sortFieldName, sortDirection === 'asc' ? 1 : -1));
        this.allsource = cloneData;
        this.sorteddirection = sortDirection;
        this.sortedBy = sortedBy;
        this.appPaginationHelper();
        this.dispatchEvent(new CustomEvent("sortalldata", {
            bubbles: true,
            detail: { sortedrecords: this.allsource }
        }));

    }


    constructor() {
        super();

        if (this.columnsBackup === null) {
            this.columnsBackup = this.columns;
        }

    }


    get appDisableLast() {
        return this.appPageNumber == this.appTotalPages || this.appTotalPages == 0;
    }

    get appDisableFirst() {
        return this.appPageNumber <= 1;
    }


    appFirstPage() {
        this.appPageNumber = 1;
        this.appPaginationHelper();
    }


    appLastPage() {
        this.appPageNumber = this.appTotalPages;
        this.appPaginationHelper();
    }

    appPreviousPage() {
        this.appPageNumber = this.appPageNumber - 1;
        this.appPaginationHelper();
    }

    appNextPage() {
        this.appPageNumber = this.appPageNumber + 1;
        this.appPaginationHelper();
    }

    appPaginationHelper() {
        this.source_data = [];
        let clonedata = [];
        let selectedRecords = [];

        if (this.appPageNumber == 1 && this.appTotalPages <= 0) {
            this.appPageNumber = 0;
        } else if (this.allsource.length > 0 && this.appPageNumber <= this.appTotalPages && this.appPageNumber <= 1) {
            this.appPageNumber = 1;
        } else if (this.appPageNumber >= this.appTotalPages) {
            this.appPageNumber = this.appTotalPages;
        } else if (this.allsource.length <= 0) {
            this.appPageNumber = 0;
        }
        var pgn;
        var pgnVar;
        if (this.appPageNumber <= 1) {
            pgn = 0;
            pgnVar = 1;
        } else {
            pgn = this.appPageNumber - 1;
            pgnVar = this.appPageNumber;
        }


        for (let i = pgn * this.apppagesize; i < pgnVar * this.apppagesize; i++) {
            if (i === this.appTotalRecords) {
                break;
            }
            clonedata.push(this.allsource[i]);

        }


        this.source_data = clonedata;

        for (let k = 0; k < this.source_data.length; k++) {
            for (let j = 0; j < this.selectedRecs.length; j++) {
                if (this.source_data[k].id == this.selectedRecs[j].id) {
                    selectedRecords.push(this.selectedRecs[j].id);
                }
            }

        }
        this.selectedRecord = selectedRecords;
    }

    /****Circular pagination code ***/
    get pageList() {
        return Array.from({ length: this.appTotalPages }, (value, index) => {
            let classList = index + 1 === this.appPageNumber ? "slds-button slds-button_icon btn-circle currentPage" : "slds-button slds-button_icon btn-circle"
            return { "pageNumber": index + 1, "classList": classList }
        })
    }
    pageClickHandler(event) {
        this.appPageNumber = Number(event.currentTarget.dataset.index);
        this.appPaginationHelper();
    }
}