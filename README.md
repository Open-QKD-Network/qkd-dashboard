Open QKD Dashboard
=====

A web application designed to gather and visualize the Open-QKD network.

This is a guide on how to setup and run an open QKD dashboard. The only prerequisite to this is having run qkd-net on any issue-27 or any later issues (issue-33 for example).

Setting up
=====

For all systems, install NPM,

```sudo apt install npm ``` 

Additionally run each system on different terminals.

AWS API endpoint
-----
This system exists in 

```cd aws-server```

The config files should all be setup for AWS but if you plan on using this on other systems or need to modify existing paths, modify ```.env```.

To run this us the following command:
```npm run start```
If you're debugging or testing for development, use:
```npm run dev```

Run this system on every network endpoint that you are using.

Web Server Backend
-----
This system exists  in:

```cd web-server/server```

You only need to run this on a single device.

To start you need to setup mongodb on the device you run the backend in (if it's not setup already.)

To install mongodb use the following commands

```
sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common

sudo echo "deb http://security.ubuntu.com/ubuntu impish-security main" | sudo tee /etc/apt/sources.list.d/impish-security.list

sudo apt-get update

wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb

sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```
Run one of the two commands
```
sudo apt-get install -y mongodb-org 

sudo apt-get install -y mongodb
```

Once installed to start mongodb run one of the two commands:
```
sudo systemctl start mongod

sudo systemctl start mongodb

```
The ```.env``` file contains all the information regrading the configuration of the backend

Web Server Frontend
-----

This system exists  in:

```cd web-server/front-end```

You only need to run this on a single device.

First, install vue:
```
sudo npm install -g @vue/cli
sudo npm install vue
```

Make sure to modify the IP address in ```config.js``` to match that of the public IP address that hosts the backend

To Run the frontend: 
``` 
npm run serve -- --port=8000
```

There are other methods of running the frontend, check the README in front-end for more information.


Backend API
-----

The backend API was designed to run on 
```
http://54.85.3.207:8001/api/v1
```

The ```/locations/``` documentation
| Endpoint          	| Method 	| Body                          	|
|-------------------	|--------	|-------------------------------	|
| /fetch            	| GET    	| NULL                          	|
| /fetch/id/?id     	| GET    	| NULL                          	|
| /fetch/city/?city 	| GET    	| NULL                          	|
| /create           	| POST   	| city; longitude; latitude;    	|
| /update/?id       	| PATCH  	| city?; longitude?; latitude?; 	|
| /delete/?id       	| DELETE 	| NULL                          	|

The ```/ipInfo/``` documentation
| Endpoint          	| Method 	| Body                          	|
|-------------------	|--------	|-------------------------------	|
| /fetch            	| GET    	| NULL                          	|
| /fetch/id/?id     	| GET    	| NULL                          	|
| /fetch/ip/?ip      | GET    	| NULL                          	|
| /create           	| POST   	| ip; locationId;    	         |
| /update/?id       	| PATCH  	| ip?; locationId?; 	            |
| /delete/?id       	| DELETE 	| NULL                          	|

The ```/sites/``` documentation
| Endpoint          	| Method 	| Body                          	|
|-------------------	|--------	|-------------------------------	|
| /fetch            	| GET    	| NULL                          	|

As of now the best way to access the API is using postman (For the body information, provide it under x-www-form-urlencoded).
Here is a [link to a postman collection](https://www.postman.com/science-geoscientist-97417074/workspace/openqkdnetwork/collection/17576385-491b21f4-e7a1-4270-bebb-172467a83849?action=share&creator=17576385&ctx=documentation) with the endpoints listed above.
