import requests

# Define the URL you want to send the request to
url = 'http://localhost:3001'

# Send the request  100 times
for i in range(10000000):
    try:
        # Send the GET request
        response = requests.get(url)
        
        # Check if the request was successful (status code  200)
        if response.status_code ==  200:
            print(f"Request {i+1} was successful.")
            print(response.text)
        else:
            print(f"Request {i+1} failed with status code {response.status_code}.")
            
    except requests.exceptions.RequestException as e:
        # Handle any exceptions that occur during the request
        print(f"An error occurred on request {i+1}: {e}")
