const isReachable = require('is-reachable');
const dns = require("dns");


const lookupPromise = name => new Promise((resolve, reject) =>
   dns.lookup(name.domain, err => resolve(!err))
);

const allDomainVerify = generatedNames =>
   Promise.all(generatedNames.map(lookupPromise)).then(arr =>
      arr.map((bool, i) => bool && generatedNames[i].domain).filter(Boolean)
   );


/*
   Function to check if a particular domain is reachable or not
        @param  {Array} : array of all the domains from domains file
        @return {Array} : list of all the reachable domains
*/
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}
const isDomainReachable = async (domains) => {
   try {
      let data = [];
      data = [...await allDomainVerify(domains)]
      // const prms = domains.map(doms => isReachable(doms.domain))
      // const content = await Promise.all(prms)
      // for (let i = 0; i < domains.length; i++) {
      //    if (content[i] === true) {
      //       data.push(domains[i].domain)
      //    }
      // }


      //    let dataCount = 0
      //    console.log("domains Before", domains.length)
      //    while(dataCount < domains.length)
      //    {
      //       console.log("dataCount Before",dataCount)

      //          let sliced = domains.slice(dataCount,dataCount+500)
      //          dataCount = dataCount + sliced.length
      //          data = [...await domainVerify(sliced),...data]
      //          // await sleep(500);
      //          console.log(dataCount)
      //       console.log("dataCount",dataCount)
      //    }
      return data;
   } catch (err) {
      console.log(err)
      return []
   }
}



const isSingleDomainReachable = async (domain) => {
   try {
      const val = await new Promise((resolve, reject) =>
         dns.lookup(domain, err => resolve(!err))
      );
      return val
   } catch (err) {
      console.log(err)
      return null
   }
}







module.exports = { isDomainReachable, isSingleDomainReachable }