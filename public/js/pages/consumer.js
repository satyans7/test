import { getDevicesData, getConsumerDeviceMapping, getAllAdmins,registerConsumerDeviceMapping,deregisterConsumerDeviceMapping ,postDeviceData} from '../client/client.js';

export function initializeConsumerPanel(sidebarid){
const alldevicesContainer = document.querySelector('.all-devices');
const registerTab = document.getElementById('registerdevice-form-container');
const deregisterTab = document.getElementById('deregisterdevice-form-container');
const deregisterform = document.getElementById('deregister-device-form')

function populateSearchContainer(data, searchResultsContainer, deviceIdInput) {
    data.forEach(val => {
            const row = document.createElement('div');
            row.className = 'search-result';
            row.textContent = val;
            row.addEventListener('click', () => {
                deviceIdInput.value = row.textContent;
                const allResults = searchResultsContainer.getElementsByClassName("search-result");
                for (let result of allResults) {
                    result.style.display = "none";
                }
            });
            searchResultsContainer.appendChild(row);
    });

    // Filter search results based on input value
    deviceIdInput.addEventListener("input", function () {
        const filter = deviceIdInput.value.toLowerCase();
        const searchResults = searchResultsContainer.getElementsByClassName("search-result");

        if (filter === "") {
            // Show all results if input is cleared
            for (let result of searchResults) {
                result.style.display = "";
            }
        } else {
            // Filter results based on input
            for (let result of searchResults) {
                const text = result.textContent.toLowerCase();
                if (text.includes(filter)) {
                    result.style.display = "";
                } else {
                    result.style.display = "none";
                }
            }
        }
    });
}


async function registerDomLoad()  {
    const searchResultsContainer = document.querySelector(".register-search-results");
    const deviceIdInput = document.getElementById("register-device-id");
    const data = await getDevicesData();
    const ids = Object.keys(data);
    populateSearchContainer(ids, searchResultsContainer, deviceIdInput);
};

async function registerbtn(){
    registerTab.style.display = 'block';
    const form = document.getElementById('register-device-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const user = getCurrentId();
        const ob = {
            device: document.getElementById('register-device-id').value
        }

        const res = await registerConsumerDeviceMapping(ob, user);
        await viewAlldevices();
        alert(res.message);
        form.reset();
    });

    document.getElementById('register-device-cancel-button').addEventListener('click', async () => {
      
        alldevicesContainer.style.display = 'block';
        registerTab.style.display = 'none';
        await viewAlldevices();
    });
};



//DEREGISTER Device

async function deregisterDomLoad (){
    const searchResultsContainer = document.querySelector(".deregister-search-results");
    const deviceIdInput = document.getElementById("deregister-device-id");
    const user = getCurrentId();
    const devices = await getConsumerDeviceMapping();
    const ids = devices[user];
    populateSearchContainer(ids, searchResultsContainer, deviceIdInput);
};

async function deregisterbtn(){
    
    deregisterTab.style.display = 'block';

    document.getElementById('deregister-device-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const deviceId = document.getElementById('deregister-device-id').value;
        const user = getCurrentId();
        console.log(deviceId);
        const object = {
            device: deviceId
        }

        try {
            const response = await deregisterConsumerDeviceMapping(user, object);
            await viewAlldevices();
            alert(response.message);
            deregisterform.reset();

        } catch (error) {
            console.error('Error deregistering device:', error);
            alert(`${error.message}`);
        }
    });

    //when cancel button is clicked
    document.getElementById('deregister-device-cancel-button').addEventListener('click', async () => {
        
        alldevicesContainer.style.display = 'block';
        deregisterTab.style.display = 'none';
        await viewAlldevices();
    });

};

function getCurrentId() {
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const pathname = url.pathname;
    const segments = pathname.split('/');
    const user = segments[segments.length - 1];
    return user;
}

async function viewAlldevices() {
    const ConsumerId = getCurrentId();
    const devicesData = await getDevicesData();
    console.log(devicesData);
    const consumerdeviceMapping = await getConsumerDeviceMapping();
    console.log(consumerdeviceMapping);
    let devices = [];
    devices = consumerdeviceMapping[ConsumerId];
    console.log(devices);
    alldevicesContainer.innerHTML = '';
    devices.forEach(key => {
        const device = devicesData[key];
        if (device) {
            showAllDevices(device, key);
        }
    });
}

async function showAllDevices(device, key) {
    const deviceCard = document.createElement('div');
    deviceCard.className = 'card';
    deviceCard.id = 'fetch-device-data';
    const cardHeading = document.createElement('div');
    cardHeading.className = 'card-heading';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const deviceName = document.createElement('h3');
    deviceName.textContent = device.name;
    const deviceLocation = document.createElement('h4');
    deviceLocation.textContent = device.location;
    
    deviceCard.addEventListener('click', () => {
        const route = `/api/device-profile/${key}`;
        window.location.href = route;
    });
    cardHeading.appendChild(deviceName);
    deviceCard.appendChild(cardHeading);
    cardBody.appendChild(deviceLocation);
    deviceCard.appendChild(cardBody);
    alldevicesContainer.appendChild(deviceCard);
}

function eventListeners(){
    if(sidebarid==='device-under-consumer-advanced') viewAlldevices();
    else if(sidebarid==='register-device-for-consumer')registerbtn();
    else if(sidebarid==='deregister-device-for-consumer')deregisterbtn();
}

function DOMContentLoaded (){
    if(sidebarid==='registersitebutton')registerDomLoad();
    else if(sidebarid==='deregistersitebutton')deregisterDomLoad();
}

DOMContentLoaded();
eventListeners();

}