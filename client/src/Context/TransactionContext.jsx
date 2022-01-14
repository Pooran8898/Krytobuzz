import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/constants";


export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
}


export const TransactionProvider = ({ children }) => {
    const [currentAccount, setcurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setisLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);
    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const transactionsContract = getEthereumContract();

                const availableTransactions = await transactionsContract.getAllTransactions();

                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.reciever,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18)
                }));
                setTransactions(structuredTransactions);
            } else {
                console.log("Ethereum is not present");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };
    const CheckIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                return alert("Please Install Metamask");
            }
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setcurrentAccount(accounts[0]);
                getAllTransactions();
            }
            else {
                console.log("No accounts Found");
            }
        }
        catch (err) {
            console.log(err);
            throw new Error("No Ethereum Object");
        }
    }
    const checkIfTransactionsExists = async () => {
        try {
            if (ethereum) {
                const transactionsContract = getEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCount();
                window.localStorage.setItem("transactionCount", currentTransactionCount);
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };
    const connectWallet = async () => {
        try {
            if (!ethereum) {
                return alert("Please Install Metamask");
            }
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setcurrentAccount(accounts[0]);
        }
        catch (err) {
            console.log(err);
            throw new Error("No Ethereum Object");
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) {
                return alert("Please Install Metamask");
            }
            const { addressTo, amount, keyword, message } = formData;
            const parsedAmount = ethers.utils.parseEther(amount);
            const transactionContract = getEthereumContract();
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: parsedAmount._hex,
                }]
            })
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setisLoading(true);
            //console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            //console.log(`Success - ${transactionHash.hash}`);
            setisLoading(false);
            const maintransactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(maintransactionCount.toNumber());
            setFormData({ addressTo: "", amount: "", keyword: "", message: "" });
        }
        catch (err) {
            console.log(err);
            throw new Error("No Ethereum Object");
        }
    }
    useEffect(() => {
        CheckIfWalletIsConnected();
        checkIfTransactionsExists();
    }, [transactionCount])
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading, transactionCount, transactions }}>
            {children}
        </TransactionContext.Provider >
    )
}
