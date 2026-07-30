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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29, 0, 0.0, 8016.586206896551, 2837, 17559, 7489.0, 16110.0, 16946.0, 17559.0, 0.269943218840175, 0.7287721510518477, 0.2345640766080238], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Click Admin", 2, 0, 0.0, 14204.5, 10850, 17559, 14204.5, 17559.0, 17559.0, 17559.0, 0.08103727714748783, 0.39086241389789306, 0.1348510940032415], "isController": true}, {"data": ["Click admin from menu-1", 2, 0, 0.0, 5486.0, 3106, 7866, 5486.0, 7866.0, 7866.0, 7866.0, 0.10135306339634116, 0.3315749632595145, 0.08432891602898697], "isController": false}, {"data": ["Click admin from menu", 2, 0, 0.0, 14204.5, 10850, 17559, 14204.5, 17559.0, 17559.0, 17559.0, 0.07278815008916548, 0.35107487626014483, 0.12112403100775193], "isController": false}, {"data": ["Launch Orange HRM site", 2, 0, 0.0, 6159.5, 4925, 7394, 6159.5, 7394.0, 7394.0, 7394.0, 0.2704895861509332, 0.6037147940898026, 0.19335779010008114], "isController": false}, {"data": ["Enter Login Data and login", 2, 0, 0.0, 16221.5, 16110, 16333, 16221.5, 16333.0, 16333.0, 16333.0, 0.11027790030877811, 0.4800965620864579, 0.2284174087450375], "isController": false}, {"data": ["Enter username", 1, 0, 0.0, 5942.0, 5942, 5942, 5942.0, 5942.0, 5942.0, 5942.0, 0.1682935038707506, 0.1607334441265567, 0.11915311553349041], "isController": false}, {"data": ["Search and Filter Users (by Role and Status)", 1, 0, 0.0, 4710.0, 4710, 4710, 4710.0, 4710.0, 4710.0, 4710.0, 0.21231422505307856, 0.2019473195329087, 0.17561537951167727], "isController": false}, {"data": ["Search name", 1, 0, 0.0, 5340.0, 5340, 5340, 5340.0, 5340.0, 5340.0, 5340.0, 0.18726591760299627, 0.19878716058052434, 0.14300971441947566], "isController": false}, {"data": ["Login", 2, 0, 0.0, 19786.0, 18947, 20625, 19786.0, 20625.0, 20625.0, 20625.0, 0.08943743851176102, 0.5742687091941687, 0.25818073070387265], "isController": true}, {"data": ["Enter details and search", 1, 0, 0.0, 10050.0, 10050, 10050, 10050.0, 10050.0, 10050.0, 10050.0, 0.09950248756218905, 0.20026819029850745, 0.15829057835820895], "isController": true}, {"data": ["Launch", 2, 0, 0.0, 6159.5, 4925, 7394, 6159.5, 7394.0, 7394.0, 7394.0, 0.2704530087897228, 0.6036331558485464, 0.1933316430020284], "isController": true}, {"data": ["Logout-1", 2, 0, 0.0, 6611.5, 5734, 7489, 6611.5, 7489.0, 7489.0, 7489.0, 0.0628002637611078, 0.26993687592237886, 0.012633646811316608], "isController": false}, {"data": ["Add details and save", 1, 0, 0.0, 33406.0, 33406, 33406, 33406.0, 33406.0, 33406.0, 33406.0, 0.029934742261869124, 0.12473783714003472, 0.09448153026402444], "isController": true}, {"data": ["Enter Login Data and login-1", 2, 0, 0.0, 6752.0, 5773, 7731, 6752.0, 7731.0, 7731.0, 7731.0, 0.20498103925386904, 0.5616960899866763, 0.1935709618735267], "isController": false}, {"data": ["Logout-0", 2, 0, 0.0, 4291.0, 3465, 5117, 4291.0, 5117.0, 5117.0, 5117.0, 0.06785411365564038, 0.10781117472434266, 0.013716603053435113], "isController": false}, {"data": ["Enter Login Data and login-0", 2, 0, 0.0, 9468.0, 8377, 10559, 9468.0, 10559.0, 10559.0, 10559.0, 0.16178611875101118, 0.2610065118912797, 0.18232537210807312], "isController": false}, {"data": ["Click Add", 1, 0, 0.0, 4264.0, 4264, 4264, 4264.0, 4264.0, 4264.0, 4264.0, 0.23452157598499063, 0.7640273217636022, 0.19627440490150092], "isController": true}, {"data": ["Add user", 1, 0, 0.0, 4264.0, 4264, 4264, 4264.0, 4264.0, 4264.0, 4264.0, 0.23452157598499063, 0.7640273217636022, 0.19627440490150092], "isController": false}, {"data": ["Enter Password", 1, 0, 0.0, 6395.0, 6395, 6395, 6395.0, 6395.0, 6395.0, 6395.0, 0.1563721657544957, 0.15118012118842847, 0.12919028537920252], "isController": false}, {"data": ["/web/index.php/api/v2/dashboard/employees/time-at-work-25", 2, 0, 0.0, 3564.5, 2837, 4292, 3564.5, 4292.0, 4292.0, 4292.0, 0.2008435428800964, 0.41522048855191807, 0.16377378740710985], "isController": false}, {"data": ["Enter Name", 1, 0, 0.0, 10115.0, 10115, 10115, 10115.0, 10115.0, 10115.0, 10115.0, 0.09886307464162135, 0.10494547083539298, 0.07540240360850223], "isController": false}, {"data": ["Logout", 4, 0, 0.0, 10903.5, 10852, 10955, 10903.5, 10955.0, 10955.0, 10955.0, 0.10821046936291087, 0.6370574360881914, 0.04364348031922088], "isController": true}, {"data": ["Click admin from menu-0", 2, 0, 0.0, 8718.5, 7745, 9692, 8718.5, 9692.0, 9692.0, 9692.0, 0.10198878123406425, 0.1582618880673126, 0.08485785313615503], "isController": false}, {"data": ["Create admin user", 1, 0, 0.0, 10954.0, 10954, 10954, 10954.0, 10954.0, 10954.0, 10954.0, 0.09129085265656382, 0.10805128263647981, 0.07845307650173453], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
