# Open QKD Dashboard

A web application designed to gather and visualize the Open-QKD network.

This is a guide on how to setup and run an open QKD dashboard. The only prerequisite to this is having run `qkd-net` on `issue-27` or any later issues (`issue-33` for example).

## Setting up

You will need `npm` on every system that you will be using with the dashboard.

For Ubuntu systems this is as simple as:

```bash
sudo apt-get install npm
```

The dashboard is comprised of three parts: the aws server, the back-end server, and the front-end server.

The recommended setup is to install and setup the front-end and back-end server, residing in `web-server/front-end` and `web-server/server` respectively, on your local machine.
As for the aws server, residing in `aws-server`, you should run an instance of it on each node in the QKD network.

After which you will still notice that nothing is being shown on the front-end. To fix this you must load the data to the back-end via the [back-end API](#back-end-api).

This means adding in the location data for all the places the nodes reside in via the `locations` API route.
On top of that you need to add all the IP information for each node via the `ipInfo` API route.
After doing so just restart the back-end server and you should see all the nodes on the dashboard.

### AWS API endpoint

This system exists in `aws-server`

```bash
cd aws-server
```

The config files should all be setup for AWS but if you plan on using this on other systems or need to modify existing paths, modify `.env`.

To be able to run `aws-server` you will first need to run:

```
npm install
```

To run this use the following command:

```bash
npm run start
```

If you're debugging or testing for development, use:

```
npm run dev
```

Run this system on every node in the network.

### Web Server Back-End

This system exists in:

```bash
cd web-server/server
```

You only need to run this on a single device.

To start you need to setup `mongodb` on the device you run the back-end in (if it's not setup already.)

To install `mongodb` use the following commands

```bash
sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common

sudo echo "deb http://security.ubuntu.com/ubuntu impish-security main" | sudo tee /etc/apt/sources.list.d/impish-security.list

sudo apt-get update

wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb

sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

Run one of the two commands

```bash
sudo apt-get install -y mongodb-org 

sudo apt-get install -y mongodb
```

Once installed to start `mongodb` run one of the two commands:

```bash
sudo systemctl start mongod

sudo systemctl start mongodb
```

The `.env` file contains all the information regrading the configuration of the backend

Just like the `aws-server`, you will need to run:

```bash
npm install
```

And then you run the server using

```bash
npm run start
```

### Web Server Front-End

This system exists  in:

```bash
cd web-server/front-end
```

First, install:

```
npm install
```

To Run the front-end: 

``` 
npm run dev
```

There are other methods of running the front-end, check the [README](web-server/front-end/README.md) in front-end for more information.

### Back-End API

Note, query elements such as `?id` are not to be inputted as query parameters but as just their values.
For example, if you want to fetch the location info for the city `Waterloo` the URL would look like `/locations/fetch/city/Waterloo` instead of `/locations/fetch/city/?city=Waterloo`.

The `/locations/` documentation
| Endpoint          	| Method 	| Body                          	|
|-------------------	|--------	|-------------------------------	|
| /fetch            	| GET    	| NULL                          	|
| /fetch/id/?id     	| GET    	| NULL                          	|
| /fetch/city/?city 	| GET    	| NULL                          	|
| /create           	| POST   	| city; longitude; latitude;    	|
| /update/?id       	| PATCH  	| city?; longitude?; latitude?; 	|
| /delete/?id       	| DELETE 	| NULL                          	|

The `/ipInfo/` documentation
| Endpoint          	| Method 	| Body                          	|
|-------------------	|--------	|-------------------------------	|
| /fetch            	| GET    	| NULL                          	|
| /fetch/id/?id     	| GET    	| NULL                          	|
| /fetch/ip/?ip      | GET    	| NULL                          	|
| /create           	| POST   	| ip; locationId;    	         |
| /update/?id       	| PATCH  	| ip?; locationId?; 	            |
| /delete/?id       	| DELETE 	| NULL                          	|

The `/sites/` documentation
| Endpoint          	| Method 	| Body                          	|
|-------------------	|--------	|-------------------------------	|
| /fetch            	| GET    	| NULL                          	|


As of now the best way to access the API is using postman (For the body information, provide it under x-www-form-urlencoded).
Here is a [link to a postman collection](https://www.postman.com/science-geoscientist-97417074/workspace/openqkdnetwork/collection/17576385-491b21f4-e7a1-4270-bebb-172467a83849?action=share&creator=17576385&ctx=documentation) with the endpoints listed above. Feel free to create a local copy and edit your collection copy as needed.
