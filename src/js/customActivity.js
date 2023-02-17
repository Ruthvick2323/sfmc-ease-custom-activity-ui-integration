// activity data
var eventDefinitionKey = "";
var authTokens = {};
var payload = {};
var schema = {};

// setup activity
var connection = new Postmonger.Session();

// trigger activity
connection.trigger('ready');
connection.trigger('requestTokens');
connection.trigger('requestEndpoints');
connection.trigger('requestSchema');
connection.trigger('requestTriggerEventDefinition');

connection.on('initActivity', function(data) {
    if(data) {
        payload = data;
        console.log('*** initActivity payload ***', JSON.stringify(payload));
    }

    var hasInArguments = Boolean(
        payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
    console.log('*** inArguments ***', JSON.stringify(inArguments));

    connection.trigger('updateButton', {
        button: 'next',
        text: 'done',
        visible: true
    });
});

connection.on('requestedEndpoints', function(endpoints) {
    if(endpoints) {
        console.log('*** requestedEndpoints endpoints ***', JSON.stringify(endpoints));
    } else {
        console.warn('*** requestedEndpoints endpoints IS EMPTY ***');
    }
});

connection.on('requestedTokens', function(data) {
    if(data) {
        authTokens = data;
        console.log('*** requestedTokens authTokens ***', JSON.stringify(authTokens));
    } else {
        console.warn('*** requestedTokens authTokens IS EMPTY ***');
    }
});

connection.on('requestedSchema', function(data) {
    if(data) {
        schema = data['schema'];
        console.log('*** requestedSchema data[schema] ***', JSON.stringify(schema));

        var availableSelect = document.getElementById("availableFieldsListBox");
        schema.forEach(function(schemaJSON) {
            console.warn(JSON.stringify(schemaJSON));
            if(schemaJSON.key && schemaJSON.name) {
                var schemaOption = document.createElement('option');
                schemaOption.value = schemaJSON.key;
                schemaOption.innerHTML = schemaJSON.name;
                availableSelect.add(schemaOption);
            }
        });

        var availableOptionsLength = document.getElementById("availableFieldsListBox").options.length;
        if(availableOptionsLength > 0) {
            console.log("There are " + availableOptionsLength + " available options");
        } else {
            document.getElementById("cover").style.display = "block";
        }

    } else {
        console.warn('*** requestedSchema data IS EMPTY ***', JSON.stringify(data));
        document.getElementById("cover").style.display = "block";
    }
});

connection.on("requestedTriggerEventDefinition", function(eventDefinitionModel) {
    if(eventDefinitionModel) {
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log('*** requestedTriggerEventDefinition eventDefinitionKey *** ' + eventDefinitionKey);

        /*If you want to see all*/
        console.log('*** requestedTriggerEventDefinition eventDefinitionModel ***', JSON.stringify(eventDefinitionModel));
    } else {
        console.warn('*** requestedTriggerEventDefinition eventDefinitionKey IS EMPTY ***');
    }
});

connection.on('clickedNext', function() {
    var schemaName = document.getElementById('inputSchemaName').value;
    if(schemaName === "") {
        schemaName = document.getElementById('inputSchemaName').placeholder;
    } else {
        document.getElementById('inputSchemaName').placeholder = schemaName;
    }

    var communicationId = document.getElementById('inputCommunicationId').value;
    if(communicationId === "") {
        connection.trigger('destroy');
    }

    var selectedRecords = document.getElementById("selectedFieldsListBox");
    var selectedRecordsOptionLength = selectedRecords.options.length;
    if(selectedRecordsOptionLength <= 0) {
        connection.trigger('destroy');
    }

    var data = [];
    Array.from(selectedRecords).forEach(selectedRecord => {
        var dataFields = {
            "field": selectedRecord.innerHTML,
            "value": "{{" + selectedRecord.value + "}}",
            "fieldType": "string",
            "fieldLength": 250
        }
        data.push(dataFields);
    });

    metadata = {
        "communicationId": communicationId,
        "date": "{{DateTime.Now}}",
        "source": eventDefinitionKey,
        "data": data
    }

    var messages = [];
    messages.push(metadata);

    var payloadArgs = {
        "schemaName": schemaName,
        "communicationId": communicationId,
        "date": "{{DateTime.Now}}",
        "source": eventDefinitionKey,
        "data": data
    }

    payload['arguments'].execute.body = JSON.stringify(payloadArgs);
    payload['metaData'].isConfigured = true;

 console.log("*** clickedNext inputPayload ***" + JSON.stringify(payload));
 connection.trigger("updateActivity", payload);
});
