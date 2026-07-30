/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.55172413793103, "KoPercent": 3.4482758620689653};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Click Admin"], "isController": true}, {"data": [0.0, 500, 1500, "Click admin from menu-1"], "isController": false}, {"data": [0.0, 500, 1500, "Click admin from menu"], "isController": false}, {"data": [0.0, 500, 1500, "Launch Orange HRM site"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Login Data and login"], "isController": false}, {"data": [0.0, 500, 1500, "Enter username"], "isController": false}, {"data": [0.0, 500, 1500, "Search and Filter Users (by Role and Status)"], "isController": false}, {"data": [0.0, 500, 1500, "Search name"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0, 500, 1500, "Enter details and search"], "isController": true}, {"data": [0.0, 500, 1500, "Launch"], "isController": true}, {"data": [0.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.0, 500, 1500, "Add details and save"], "isController": true}, {"data": [0.0, 500, 1500, "Enter Login Data and login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Login Data and login-0"], "isController": false}, {"data": [0.0, 500, 1500, "Click Add"], "isController": true}, {"data": [0.0, 500, 1500, "Add user"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Password"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/api/v2/dashboard/employees/time-at-work-25"], "isController": false}, {"data": [0.0, 500, 1500, "Enter Name"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": true}, {"data": [0.0, 500, 1500, "Click admin from menu-0"], "isController": false}, {"data": [0.0, 500, 1500, "Create admin user"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29, 1, 3.4482758620689653, 6971.551724137932, 1792, 17931, 5652.0, 13413.0, 16128.5, 17931.0, 0.2651767997732281, 0.7161630974479019, 0.23044021063267525], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Click Admin", 2, 0, 0.0, 10839.5, 10354, 11325, 10839.5, 11325.0, 11325.0, 11325.0, 0.09162963302331974, 0.4419519116232189, 0.152477436202868], "isController": true}, {"data": ["Click admin from menu-1", 2, 0, 0.0, 6637.0, 4702, 8572, 6637.0, 8572.0, 8572.0, 8572.0, 0.11285407967498025, 0.36920035831170295, 0.09389812097957341], "isController": false}, {"data": ["Click admin from menu", 2, 0, 0.0, 10839.5, 10354, 11325, 10839.5, 11325.0, 11325.0, 11325.0, 0.09768009768009768, 0.471134768009768, 0.16254578754578752], "isController": false}, {"data": ["Launch Orange HRM site", 2, 0, 0.0, 7400.0, 4421, 10379, 7400.0, 10379.0, 10379.0, 10379.0, 0.19269679159841988, 0.42999235234608346, 0.13774809711918298], "isController": false}, {"data": ["Enter Login Data and login", 2, 0, 0.0, 16128.5, 14326, 17931, 16128.5, 17931.0, 17931.0, 17931.0, 0.10169319164081965, 0.44272289876442766, 0.210685650455077], "isController": false}, {"data": ["Enter username", 1, 0, 0.0, 6271.0, 6271, 6271, 6271.0, 6271.0, 6271.0, 6271.0, 0.15946420028703556, 0.1523007694147664, 0.11290189961728592], "isController": false}, {"data": ["Search and Filter Users (by Role and Status)", 1, 0, 0.0, 3937.0, 3937, 3937, 3937.0, 3937.0, 3937.0, 3937.0, 0.254000508001016, 0.2415981394462789, 0.21009612331724664], "isController": false}, {"data": ["Search name", 1, 0, 0.0, 3204.0, 3204, 3204, 3204.0, 3204.0, 3204.0, 3204.0, 0.3121098626716604, 0.3313119343008739, 0.2383495240324594], "isController": false}, {"data": ["Login", 2, 0, 0.0, 19495.0, 17821, 21169, 19495.0, 21169.0, 21169.0, 21169.0, 0.09447777410364212, 0.6066321921205536, 0.2727768936888847], "isController": true}, {"data": ["Enter details and search", 1, 0, 0.0, 7141.0, 7141, 7141, 7141.0, 7141.0, 7141.0, 7141.0, 0.1400364094664613, 0.28185062491247725, 0.22277276466881388], "isController": true}, {"data": ["Launch", 2, 0, 0.0, 7400.0, 4421, 10379, 7400.0, 10379.0, 10379.0, 10379.0, 0.19269679159841988, 0.42999235234608346, 0.13774809711918298], "isController": true}, {"data": ["Logout-1", 2, 0, 0.0, 4657.0, 3272, 6042, 4657.0, 6042.0, 6042.0, 6042.0, 0.03756009615384616, 0.16172115619365987, 0.00755603496844952], "isController": false}, {"data": ["Add details and save", 1, 1, 100.0, 31258.0, 31258, 31258, 31258.0, 31258.0, 31258.0, 31258.0, 0.03199181009661527, 0.13330962273657945, 0.10097415061744194], "isController": true}, {"data": ["Enter Login Data and login-1", 2, 0, 0.0, 4507.5, 3890, 5125, 4507.5, 5125.0, 5125.0, 5125.0, 0.2915026963999417, 0.798785709080309, 0.27527647208861683], "isController": false}, {"data": ["Logout-0", 2, 0, 0.0, 3047.0, 1792, 4302, 3047.0, 4302.0, 4302.0, 4302.0, 0.03863315884023257, 0.06138295843072109, 0.007809632695242327], "isController": false}, {"data": ["Enter Login Data and login-0", 2, 0, 0.0, 11619.5, 10435, 12804, 11619.5, 12804.0, 12804.0, 12804.0, 0.12677484787018256, 0.20452348504056794, 0.14293121275988843], "isController": false}, {"data": ["Click Add", 1, 0, 0.0, 3557.0, 3557, 3557, 3557.0, 3557.0, 3557.0, 3557.0, 0.281135788585887, 0.91588768625246, 0.2352864949395558], "isController": true}, {"data": ["Add user", 1, 0, 0.0, 3557.0, 3557, 3557, 3557.0, 3557.0, 3557.0, 3557.0, 0.281135788585887, 0.91588768625246, 0.2352864949395558], "isController": false}, {"data": ["Enter Password", 1, 0, 0.0, 5546.0, 5546, 5546, 5546.0, 5546.0, 5546.0, 5546.0, 0.18031013342949875, 0.17432327353047242, 0.14896716101694915], "isController": false}, {"data": ["/web/index.php/api/v2/dashboard/employees/time-at-work-25", 2, 0, 0.0, 3366.5, 3238, 3495, 3366.5, 3495.0, 3495.0, 3495.0, 0.13595268846441438, 0.2810662514444973, 0.11085985826932228], "isController": false}, {"data": ["Enter Name", 1, 0, 0.0, 6028.0, 6028, 6028, 6028.0, 6028.0, 6028.0, 6028.0, 0.16589250165892502, 0.17609877861645654, 0.12652543339416059], "isController": false}, {"data": ["Logout", 4, 0, 0.0, 7704.5, 7574, 7835, 7704.5, 7835.0, 7835.0, 7835.0, 0.0726717779150467, 0.42836606591330256, 0.029310004178627228], "isController": true}, {"data": ["Click admin from menu-0", 2, 0, 0.0, 4202.5, 2753, 5652, 4202.5, 5652.0, 5652.0, 5652.0, 0.12679896024852597, 0.19676127718252712, 0.10550069739428138], "isController": false}, {"data": ["Create admin user", 1, 1, 100.0, 13413.0, 13413, 13413, 13413.0, 13413.0, 13413.0, 13413.0, 0.07455453664355477, 0.0882422836054574, 0.06407030492805488], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 13,413 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 100.0, 3.4482758620689653], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29, 1, "The operation lasted too long: It took 13,413 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Create admin user", 1, 1, "The operation lasted too long: It took 13,413 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
