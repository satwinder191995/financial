// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('pending', { autoIncrement: true });
  };
  // upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      // uploadPizza();
      uploadBudget();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };
  // This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['pending'], 'readwrite');
  
    // access the object store for `new_pizza`
    const budgetObjectStore = transaction.objectStore('pending');
  
    // add record to your store with add method
    budgetObjectStore.add(record);
  }

  function uploadBudget() {
    // open a transaction on db
    const transaction = db.transaction(["pending"], "readwrite");
  
    // access object store
    const store = transaction.objectStore("pending");
  
    // get all records from store and set to a variable
    const getAll = store.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(() => {
            // delete records if successful
            const transaction = db.transaction(["new_budget"], "readwrite");
            const store = transaction.objectStore("new_budget");
            store.clear();
            console.log('All saved pizza has been submitted!');
          });
      }
    };
  }
//   function deletePending() {
//     const transaction = db.transaction(["new_budget"], "readwrite");
//     const store = transaction.objectStore("new_budget");
//     store.clear();
//   }
  
  // listen for app coming back online
  window.addEventListener("online", uploadBudget);