
const csvFilePath='./data.csv'
const csv=require('csvtojson')
var http=require("http");

http.createServer(function(request,response){
	response.writeHead(200,{'Content-Type':'text/plain'});
	// response.end('Hello World!..\n');
}).listen(8080);
console.log(
'Server Running Successfully');

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    // console.log(jsonObj);

    let newObj = jsonObj.map(item => {
        let remap = {
            VendorName: item['Vendor Name'],
            ModelName: item['Model Name'],
            MachineCycle: item['MYCT: machine cycle time in nanoseconds'],
            MinMem: item['MMIN: minimum main memory in kilobytes'],
            MaxMem: item['MMAX: maximum main memory in kilobytes'],
            CacheMem: item['CACH: cache memory in kilobytes'],
            CacheMin: item['CHMIN: minimum channels in units'],
            CacheMax: item['CHMAX: maximum channels in units'],
            Prp: item['PRP: published relative performance'],
            Erp: item['ERP: estimated relative performance from the original article'],
            diff: item['PRP: published relative performance'] - item['ERP: estimated relative performance from the original article']
        }

        return remap
    })
    
    // console.log(newObj);
    getSmallestMachine(newObj)
    top10CacheMem(newObj)
    top10diffPer(newObj)
})

let getSmallestMachine = (newObj) => {

    let listModel = []
    let min = Math.min.apply(null, newObj.map(item => item.MachineCycle))
    // console.log(min)

    let minMac = newObj.filter(a => a.MachineCycle == min)
    if(minMac && minMac.length > 0){
        for(let i in minMac){
            listModel.push(minMac[i].ModelName)
        }
    }
    console.log("Model with Smallest Machine Cycle Time : " + listModel)

}

let top10CacheMem = (newObj) => {

    let listModel = []
    // let minMac = newObj.sort((a, b) => b.CacheMem.localeCompare(a.CacheMem));
    let minMac = newObj.sort((a, b) => b.CacheMem - (a.CacheMem));
    
    if(minMac && minMac.length > 0){
        for(let i in minMac){
            if(i == 10) break;
            listModel.push(minMac[i].ModelName)
        }
    }
    console.log("Top 10 Model with Highest Cache Memory : " + listModel)

}

let top10diffPer = (newObj) => {

    let listModel = []
    let minMac = newObj.sort((a, b) => b.diff - (a.diff));
    
    if(minMac && minMac.length > 0){
        for(let i in minMac){
            if(i == 10) break;
            // console.log(minMac[i]);
            listModel.push(minMac[i].ModelName)
        }
    }
    console.log("Top 10 difference of Relative Performance : " + listModel)
}

