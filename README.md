# enhanced-lightning-datatable

Custom LWC for datatable with a reusable lightning datatable template

This datatable template is a custom wrapper on Lightning datatable.

## Functionalities:
- Pagination
- Sorting - all columns with toggle
- Select checkbox
- Radio select


## Inputs needed:
- columns: Columns info for the datatable
- source: All records to be displayed in the datatable
- hidecheckboxcolumn = Boolean - Ability to have select record capability
- maxrowselection = number of records that can be selected at a point. Default = 1
- sorteddirection = the sort direction. Default = asc
- sortedby = the name of the field for the sorting
- defaultsortdirection= Default sorting direction. Default - asc unless specified otherwise
- ongetselectedrows= event for selected rows
- allsource = All records to be displayed in the datatable
- apppagesize= Page size for paginated pages
- pagination = Boolean value to decide if the datatable needs to be paginated
- onsortalldata = event for sorting


## The capabilities of the datatable template
- Row Select
- Pagination
- Select Row
- Sorting


## Any parent LWC needs to the following code to create a lightning datatable:
```HTML
<c-custom-data-table-template columns={appColumns} source={allRecords} hidecheckboxcolumn={hideCheckbox}
            maxrowselection={allcolumnslen} sorteddirection={sorteddirection} sortedby={sortedby}
            defaultsortdirection={defaultsortdirection} ongetselectedrows={getselectedrowsevent}
            allsource={allRecordsPage} apppagesize={appPageSize} pagination={pagination} onsortalldata={realignrecords}>
</c-custom-data-table-template>
```


In the parent LWC js file the inputs needed for the template need to be set up.
The function to handle the onselect and onsort events need to be set up as well.
