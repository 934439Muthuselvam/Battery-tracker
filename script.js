const getBatteryPercentage = async () => {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        return battery.level * 100; // Convert fraction to percentage
    } else {
        throw new Error("Battery API not supported in this browser.");
    }
};

const getLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => reject("Unable to fetch location.")
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
};

document.getElementById('submit-btn').addEventListener('click', async () => {
    const userName = document.getElementById('user-name').value;

    if (!userName) {
        document.getElementById('result').textContent = "Please enter your name.";
        return;
    }

    try {
        const batteryLevel = await getBatteryPercentage();
        const location = await getLocation();

        document.getElementById('result').textContent = `Hello, ${userName}. Battery Level: ${batteryLevel}%. Location: Latitude ${location.latitude}, Longitude ${location.longitude}`;

        // Optionally send data to backend (if server is set up)
        const response = await fetch('/api/save-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                batteryLevel,
                location,
            }),
        });

        if (response.ok) {
            console.log('Data sent successfully');
        } else {
            console.error('Failed to send data');
        }
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});
