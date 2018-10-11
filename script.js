window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    const ccpUrl = "https://implementation.awsapps.com/connect/ccp#/";
    const acUrl = "https://implementation.awsapps.com/";

    // Add any Amazon Connect contact attributes to be excluded

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

        let contactId = contact.getContactId();
        let queueName = contact.getQueue().name;
        let acCallRecordingLink = constructRecordingLink(contactId);
        let acAttribute = contact.getAttributes();

  
        logInfoMsg("ContactId is " + contactId);   
        logInfoMsg("Contact is from queue " + queueName);          
        logInfoMsg("Download call recording " + acCallRecordingLink);
        logInfoMsg("Contact attributes are " + JSON.stringify(acAttribute));
        logInfoMsg("Attr1" + JSON.stringify(acAttribute.dnis));
         
        updateContactAttribute(contact.getAttributes());   

        contact.onConnected(updateUi);
        contact.onEnded(clearContactAttribute);
    }

    function subscribeToAgentEvents(agent){
         logInfoMsg("Subscribing to agent events...");

         let agentName = agent.getName();
         let agentConfig = agent.getConfiguration();

         logInfoMsg("Agent name " + agentName);  
         logInfoMsg("Agent configuration " + agentConfig);
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

    function constructRecordingLink(callContactId) {
    if (acUrl) {
    // normalize minimal flexibility in source Url.
    if (!acUrl.endsWith("/")) {
      acUrl = acUrl + "/";
    }

    // sample URL= https://acsf-rd.awsapps.com/connect/get-recording?format=mp3&callLegId=6ba247f2-5726-41da-89b5-321460d1ab22
    var fullUrl =
      acUrl +
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
