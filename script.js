window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    const ccpUrl = "https://implementation.awsapps.com/connect/ccp#/";
    var acEndpoint = "https://implementation.awsapps.com/connect/";

    //add any contact attributes to be excluded

    const CONFIG = 
          {
            "hiddenCA": ["secret"]
          };


    connect.core.initCCP(containerDiv, {
        ccpUrl: ccpUrl,        
        loginPopup: true,         
        softphone: {
            allowFramedSoftphone: true
        }
    });

    connect.contact(subscribeToContactEvents);   
    connect.agent(subscribeToAgentEvents);

    function subscribeToContactEvents(contact) {
        window.myCPP.contact = contact;

        logInfoMsg("New contact offered. Subscribing to events for contact");
        if (contact.getActiveInitialConnection()
            && contact.getActiveInitialConnection().getEndpoint()) {
            logInfoMsg("New contact is from " + contact.getActiveInitialConnection().getEndpoint().phoneNumber);
        } else {
            logInfoMsg("This is an existing contact for this agent");
        }

        var contactId = contact.getContactId();
        logInfoMsg("Contact is from queue " + contact.getQueue().name);    
        logInfoMsg("ContactID is " + contactId);   
        var recordingLinkDesc = ConstructRecordingLink(taskACCallContactId);
        logInfoMsg(recordingLinkDesc(contactId));
        logInfoMsg("Contact attributes are " + JSON.stringify(contact.getAttributes()));
         
        updateContactAttribute(contact.getAttributes());   

        contact.onConnected(updateUi);
        contact.onEnded(clearContactAttribute);
    }

    function subscribeToAgentEvents(agent){
         console.log("Subscribing to agent events...");
         var name = agent.getName();
         console.log("Agent Name Is " + name);
         var config = agent.getConfiguration();
         console.log("Agent configuration is " + agent.username + " " + agent.name);
    }


    function updateContactAttribute(msg){
        const tableRef = document.getElementById('attributesTable').getElementsByTagName('tbody')[0];             
        for (let key in msg) {
            if (msg.hasOwnProperty(key) && CONFIG.hiddenCA.indexOf(key)==-1) {
                        let row = tableRef.insertRow(tableRef.rows.length);
                        let cell1 = row.insertCell(0);
                        let cell2 = row.insertCell(1);
                        cell1.innerHTML = key;
                        cell2.innerHTML = msg[key]['value'];
                }
            }
        }

    function updateUi(contact){
        logInfoMsg("Connecting agent and updating UI...");
       // logInfoMsg("LATEST attributes are " + JSON.stringify(window.myCPP.contact.getAttributes()));
        logInfoMsg("Latest call attributes are " + JSON.stringify(contact.getAttributes()));
        clearContactAttribute();
        updateContactAttribute(contact.getAttributes());
        console.log('Agent has been connected'); 

    }
        
    function clearContactAttribute(){
        let old_tbody= document.getElementById('attributesTable').getElementsByTagName('tbody')[0];
        let new_tbody = document.createElement('tbody');    
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody);     
    }


    function logMsgToScreen(msg) {
        logMsgs.innerHTML =  new Date().toLocaleTimeString() + ' : ' + msg + '<br>' + logMsgs.innerHTML;
    }

    function logInfoMsg(msg) {
        connect.getLog().info(msg);
        logMsgToScreen(msg);
    }

    function ConstructRecordingLink(callContactId) {
    if (acEndpoint) {
    // normalize minimal flexibility in source Url.
    if (!acEndpoint.endsWith("/")) {
      acEndpoint = acEndpoint + "/";
    }

    // sample URL= https://acsf-rd.awsapps.com/connect/get-recording?format=mp3&callLegId=6ba247f2-5726-41da-89b5-321460d1ab22
    var fullUrl =
      acEndpoint +
      "connect/get-recording?format=mp3&callLegId=" +
      callContactId;
    return "Listen to Call Recording: " + fullUrl;
  }
}




// LogMessages section display controls

const showLogsBtn = document.getElementById('showAttributes');
const showLogsDiv = document.getElementById('hiddenAttributes');
const hideLogsBtn = document.getElementById('hideAttributes');
const hideLogsDiv = document.getElementById('visibleAttributes');

showLogsBtn.addEventListener('click',replaceDisplay);
hideLogsBtn.addEventListener('click',replaceDisplay);

    function replaceDisplay(){
            showLogsDiv.style.display = showLogsDiv.style.display === 'none' ? '' : 'none';
            hideLogsDiv.style.display = hideLogsDiv.style.display === 'none' ? '' : 'none';
    }
