import React, { useContext } from "react";
import { TransactionContext } from "../../Context/TransactionContext";
import { dummyData } from "../../utils/dummyData";
import { TransactionCard } from "./TransactionCard";
import { v4 as uuid} from "uuid";


export const Transactions = () => {
    const { currentAccount, transactions } = useContext(TransactionContext);
    return (
        <>
            <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
                <div className="flex flex-col md:p-12 py-12 px-4">
                    {currentAccount ? (<>
                        <h3 className="text-white text-3xl text-center my-2">Latest Transactions</h3>
                    </>) : (<>
                        <h3 className="text-white text-3xl text-center my-2">Connect your account to see Latest Transactions</h3>
                    </>)}
                    <div className="flex flex-wrap justify-center items-center mt-10">
                        {[...dummyData,...transactions].reverse().map((el,i) => {
                            return <TransactionCard key={`${uuid()}`}  {...el} />
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}