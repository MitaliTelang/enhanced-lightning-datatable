import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts from '@salesforce/apex/SampleData.getAccounts';

const appColumns = [
    { label: 'Account Name', fieldName: 'accountlink', hideDefaultActions: true, sortable: true, type: 'url', initialWidth: 170, sortBy: 'name', typeAttributes: { label: { fieldName: 'name' }, target: '_self' } },
    { label: 'AccountNumber', fieldName: 'AccountNumber', hideDefaultActions: true, sortable: true,  initialWidth: 170 },
    { label: 'Active', fieldName: 'Active', hideDefaultActions: true, sortable: true, type: 'boolean', sortBy:'activeValue', initialWidth: 230 },
    { label: 'BillingAddress', fieldName: 'BillingAddress', hideDefaultActions: true, sortable: true, initialWidth: 150 },
    { label: 'YearStarted', fieldName: 'YearStarted', hideDefaultActions: true, sortable: true, initialWidth: 250 },
];


export default class SampleDataTable extends NavigationMixin(LightningElement) {

    @track selectedRows = [];
    allSelected = false;
    applicationIdString = '';
    isrowselected = false;
    isMultipleRecords = false;
    allRowSelected = 0;
    @track allRecords = [];
    @track allRecordsPage = [];
    @track allRecordFetch = [];
    @track _records = [];
    @track _lodgedRecords = [];
    @track appColumns = appColumns;
    @track hideCheckbox = true;
    @track allcolumnslen;
    @track sorteddirection = 'asc';
    @track sortedby;
    @track selectedRecordArr = [];
    @track defaultsortdirection = 'asc';
    @track appPageSize = 10;
    @track pagination = true;
    error;


    connectedCallback() {

        getAccounts()
            .then(response => {
                // Process the result from Apex
                if (response != '' && response != null) {
                    let allrecordsFetched = [];
                    this.allRecordFetch = response;
                    this.allcolumnslen = this.allRecordFetch.length;
                    for (let i = 0; i < this.allcolumnslen; i++) {
                        var res = this.allRecordFetch[i];
                        var accountlink = '/' + res.Id;
                        var activeValue;
                        if(res.Active__c)
                        {
                            activeValue = 1;
                        } else {
                            activeValue = 0;
                        }
                        allrecordsFetched.push({
                            id: res.Id,
                            name: res.Name,
                            accountlink: accountlink,
                            AccountNumber: res.AccountNumber,
                            Active: res.Active__c,
                            activeValue: activeValue,
                            BillingAddress: res.BillingAddress,
                            YearStarted: res.YearStarted,
                            rownum: i,
                        });

                    }
                    this.allRecords = allrecordsFetched;
                    this.allRecordsPage = allrecordsFetched;
                }
            })
            .catch(error => {
                console.error(error);
            });


    }

    realignrecords(event) {
        this.allRecordsPage = event.detail.sortedrecords;
    }

    getselectedrowsevent(event) {
        
        console.log(JSON.stringify(event.detail));        

    }

}