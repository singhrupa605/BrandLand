const Domains = require("../models/alldomain.model")
const isReachable = require('is-reachable');


/*
   Function to find the data of recently added domain file to the database 
        @param  {null}
        @return {Array} : array of domains 
*/

const getLastDomain = async () => {
   try {
      console.log("Hello this is domains services")
      const data = await Domains.find().sort({ _id: -1 }).limit(1)
      return data[0].domains;
   }
   catch (err) {
      console.log(err)
      return null;
   }
}


/*
   Function to check if a particular domain is reachable or not
        @param  {Array} : array of all the domains from domains file
        @return {Array} : list of all the reachable domains
*/

const isDomainReachable = async (domains) => {
   try {
      let data = [];
      const prms = domains.map(doms => isReachable(doms.domain))
      const content = await Promise.all(prms)
      let count = 0;
      for (let i = 0; i < domains.length; i++) {
         if (content[i] === true) {
            count++;
            data.push(domains[i].domain)
         }
      }
      return data;
   } catch (err) {
      console.log(err)
   }
}




/*
   Function to upload the domains file data to the database

        @param  {Array} : array of all the domains from domains file
        @return {Object} :  Created document object
*/

const uploadDomains = async (domainsArray) => {
   try {
      const uploadResponse = await Domains.create({ domains: domainsArray });
      return uploadResponse;
   } catch (err) {
      console.log(err);
   }
}


module.exports = { uploadDomains, isDomainReachable, getLastDomain }