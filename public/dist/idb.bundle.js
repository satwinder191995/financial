(()=>{let e;const n=indexedDB.open("budget_tracker",1);function t(){const n=e.transaction(["pending"],"readwrite").objectStore("pending").getAll();n.onsuccess=function(){n.result.length>0&&fetch("/api/transaction/bulk",{method:"POST",body:JSON.stringify(n.result),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((e=>e.json())).then((()=>{e.transaction(["new_budget"],"readwrite").objectStore("new_budget").clear(),console.log("All saved pizza has been submitted!")}))}}n.onupgradeneeded=function(e){e.target.result.createObjectStore("pending",{autoIncrement:!0})},n.onsuccess=function(n){e=n.target.result,navigator.onLine&&t()},n.onerror=function(e){console.log(e.target.errorCode)},window.addEventListener("online",t)})();