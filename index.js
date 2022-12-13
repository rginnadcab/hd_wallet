const express = require("express");
const bodyParser = require("body-parser");
const { isAuthenticated } = require("./middleware/auth");
const catchAsyncErrors = require("./middleware/catchAsyncErrors");
const bip39 = require("bip39");
const app = express();
const port = 3000;

const errorMiddleware = require("./middleware/errors");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',isAuthenticated, catchAsyncErrors((req,res) => {

    const HDWalletProvider = require("truffle-hdwallet-provider");
    const infuraURL = 'https://rinkeby.infura.io/v3/369e4956d599401c9fe721cb0294bf67';
    var mnemonic = "melody soda arrow embark soup bulb notice hungry bunker bachelor evidence pyramid"; // 12 word mnemonic

    if(!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Mnemonic invalid or undefined");
    }
   
   // var provider = new HDWalletProvider(mnemonic, "http://localhost:8545",0,1);
    var provider = new HDWalletProvider(mnemonic, infuraURL ,0,1);

    //const web3 = new Web3(provider);
    const wallets = provider.wallets;
    var accounts = [];
    for (const wallet in wallets) {
    let account = wallets[wallet];
    console.log(wallets);
    accounts.push({
        privateKey: account._privKey.toString("hex"),
        publicKey: account._pubKey.toString("hex"),
        publicAddress: wallet,
    });
    }    

    res.status(200).json({
        success  : "true",
        accounts
    })
}))



// Middleware for Errors
app.use(errorMiddleware);

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})