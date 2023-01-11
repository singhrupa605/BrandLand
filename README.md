
# About The Project

>A small web application which is used to upload two excel files i.e.
 
* Brands file : consists the data of all existing brands.

* Domains file : An excel file only consisting the list of brands domain, under the "domains" column, and other columns need to be filled via automation.

After hitting the process button the domains table will be populated with the brands information respective to each domain in the domains list.
The resulted table can be then exported to .csv file.


# Purpose & Description of the project

## Purpose :
> The purpose of this project is to automate a small task of populating an excel file with the information of the domains given the domains file.\

## Description :

 >A user instead of manually entering the domains' information in the file , can simply upload two files i.e. `Brands File` (that will be used to get the information of the domains like `Brand ID` & `Brand Name`, `Industry` of the domains) and  `Domains File` (consisting the list of domains) that will in turn populate all the columns of the Domains file including `Suspicious Domain?` , `Sensitive Category` & `New or Existing` 

### Parameters for populating the columns of the domains file.
* Suspicious Domain? : 
   
         If a domain is reachable on web -  No
         If a domain is unreachable on web - Yes

* New Or Exsiting :  
         
         If a domain is not suspicious and is present in the `Top Level Domain` column of the `brands file` : Existing
         If a domain is not suspicious and is NOT present in the `Top Level Domain` column of the `brands file` : New
         If a domain is suspicious : NA

* Brand Name :

        If the `New or Existing` field of domain has the value `Existing` : get `Brand Name` from `Brands File`
        If the `New or Existing` field of domain is `New` : Field is editable and blank initially.
        If the `New or Existing` field of domain is `NA` : NA

* Brand ID :

        If the `New or Existing` field of domain has the value `Existing` : get `Brand ID` from `Brands File`
        If the `New or Existing` field of domain is `New` : Field is editable and blank initially.
        If the `New or Existing` field of domain is `NA` : NA

* Industry :
         
        If the `New or Existing` field of domain has the value `Existing` : get `Industry` from `Brands File`
        If the `New or Existing` field of domain is `New` : Field is editable and blank initially.  
        If the `New or Existing` field of domain is `NA` : NA

* Sensitive Category? :

        Sensitive Industries : ["Cannabis And Cannabis Products", "Dating", "Firearms & Weapons", "Weight Loss Products", "Weight Loss Programs", "Gambling (Online)", "Politics", "Alternative & Natural Medicine", "Sexual Health", "Affiliate Marketing", "Money Making Offers", "Online Advertising Companies", "Intimate Apparel", "Specialized Merchants", "Tobacco & Smoking Products"]

        If the domain is `Existing` or `New` && its Industry is  present in the `Sensitive Industries` list : Yes
        If the domain is `Existing` or `New` && its Industry is NOT present in the `Sensitive Categories` list : No
        If the domain is 'NA` : NA



# Built-With
 
 > Frontend (React.Js)

![alt text](https://camo.githubusercontent.com/268ac512e333b69600eb9773a8f80b7a251f4d6149642a50a551d4798183d621/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52656163742d3230323332413f7374796c653d666f722d7468652d6261646765266c6f676f3d7265616374266c6f676f436f6c6f723d363144414642) 
 
 > Backend (Node.Js)
 
 ![alt text](https://img.icons8.com/color/1x/nodejs.png)


 > Database  (MongoDB)

 ![alt text](https://img.icons8.com/color/30/mongodb.png)  
 


# Pre-requisites

> node :  v18.12.1.


# Installation

 From the root project's root folder run the following commands:

 ## Install Frontend

###  `cd frontend` > `npm install`

 ## Install backend

### `cd backend` >  `npm install`


# Getting Started

This project is not deployed on the web . Can only run on local server. 

## Start backend

From the backend folder of the project :
            
### `npm start`

Starts your local server on [http://localhost:8082](http://localhost:8082). `Nodemon` in the `package.json` file will detect any changes made in the backend and will restart the server automatically. 


## Start frontend

From the frontend folder of the project :

 ###  `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


# Walk Through 

1. Upload the brands file

 ![alt text](/Page1.1.png)
 ![alt text](/Page1.2.png)

2. Upload the domains file

![alt text](/Page2.1.png)
![alt text](/Page2.2.png)


3. Click on "View Table" Button

![alt text](/Page3.png)

4. Process Individual row

![alt text](/Page4.1.png)

5. Process All the rows

![alt text](/Page4.2.png)

6. Export the table to excel file

![alt text](/Page4.3.png)

        






