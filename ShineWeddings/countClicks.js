var dict = {};
var order = 0;
console.log(dict);

window.onload = function () {
    var arr = [];
    //if(flag) {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var open = window.indexedDB.open("MyDatabase", 1);

    // Create the schema
    open.onupgradeneeded = function () {
        var db = open.result;
        var store = db.createObjectStore("MyObjectStore", {keyPath: "id", autoIncrement: true});
        var index = store.createIndex("NameIndex", ["Order.imgID", "Order.order"]);
    };

    open.onsuccess = function () {
        // Start a new transaction
        var db = open.result;
        if (db.objectStoreNames.length != 0) {
            var tx = db.transaction("MyObjectStore", "readwrite");
            var store = tx.objectStore("MyObjectStore");
            var index = store.index("NameIndex");

            var getOrderedImgs = store.getAll();

            getOrderedImgs.onsuccess = function () {
                len = getOrderedImgs.result.length;
                for (i = 0; i < len; i++) {
                    arr[i] = [getOrderedImgs.result[i].Order.imgID, getOrderedImgs.result[i].Order.order];
                }
                for (i = 0; i < arr.length; i++) {
                    $('#' + arr[i][0]).insertBefore(("div#main div:nth-child(" + (i + 1) + ")"));
                }
            };
            // Close the db when the transaction is done
            tx.oncomplete = function () {
                db.close();
            };
        }
        else {
            db.close();
        }
    }
    //}
}

function image(img) {
    var src = img.src;
    var imgID = img.id;
    var arr = [];
    check = imgID in dict;
    if (check)
        dict[imgID] = dict[imgID] + 1;
    else {
        order += 1;
        dict[imgID] = 1;
        enterData(imgID, order);
    }
    var myJSON = JSON.stringify(dict);
    var items = Object.keys(dict).map(function (key) {
        return [key, dict[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    console.clear();
    console.log("Sorted List:");
    console.log(items);
}

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback

function enterData(x, y) {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var open = indexedDB.open("MyDatabase", 1);

    open.onsuccess = function () {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("MyObjectStore", "readwrite");
        var store = tx.objectStore("MyObjectStore");
        var index = store.index("NameIndex");

        // Add some data
        store.put({Order: {imgID: x, order: y}});

        // Close the db when the transaction is done
        tx.oncomplete = function () {
            db.close();
        };
    }
}

