
window.myCPP = window.myCPP || {};

    //replace with the CCP URL for the current Amazon Connect instance
    const ccpUrl = "https://implementation.awsapps.com/connect/ccp#/";

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
        //logInfoMsg("Current agent name is:" + agent.getName());
        //logInfoMsg("Current agent configuration:");
        //logInfoMsg(agent.getConfiguration());
        logInfoMsg("New contact offered. Subscribing to events for contact");
        if (contact.getActiveInitialConnection()
            && contact.getActiveInitialConnection().getEndpoint()) {
            logInfoMsg("New contact is from " + contact.getActiveInitialConnection().getEndpoint().phoneNumber);
        } else {
            logInfoMsg("This is an existing contact for this agent");
        }
        logInfoMsg("Contact is from queue " + contact.getQueue().name);    
        logInfoMsg("ContactID is " + contact.getContactId());   
        logInfoMsg("Contact attributes are " + JSON.stringify(contact.getAttributes()));

         
        updateContactAttribute(contact.getAttributes());   
        //contact.onConnected(call a function that updates the window and sends parameters somewhere-loggs them for now)
        contact.onAccepted(printLatestAttributes);
        contact.onConnected(updateUi);
        logInfoMsg("ON-ACCEPTED-Contact attributes are " + JSON.stringify(contact.getAttributes()));
        contact.onEnded(clearContactAttribute);
    }

    function subscribeToAgentEvents(){
         logInfoMsg("Subscribing to agent events...");
         var name = agent.getName();
         logInfoMsg("Agent Name Is " + name);
         var config = agent.getConfiguration();
         logInfoMsg("Agent configuration is " + agent.username + " " + agent.name);
    }

    function printLatestAttributes(){
        clearContactAttribute();
        logInfoMsg("Clearing old attributes...");
        updateContactAttribute(contact.getAttributes());
        logInfoMsg("ON-CONNECTED-New Contact attributes are " + JSON.stringify(contact.getAttributes()));

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

    function updateUi(){
        var container =document.getElementById('attributesTable').getElementsByTagName('tbody')[0];

         var content = container.innerHTML;
        container.innerHTML= updateContactAttribute(getAttributes()); 
    
    console.log("Refreshed");           

        gridDiv
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

