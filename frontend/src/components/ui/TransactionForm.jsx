import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../../graphql/mutations/transaction.mutation";
import { GET_TRANSACTIONS, GET_CATEGORY_STATS } from "../../graphql/queries/transaction.query";

const TransactionForm = () => {
  const initialData = {
    description: "",
    paymentType: "cash",
    category: "saving",
    amount: "",
    location: "",
    date: "",
  };
  const [formData, setFormData] = useState(initialData);
  const { description, paymentType, category, amount, location, date } =
    formData;

  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    // refetchQueries: ["Transactions", "AuthUser", "CategoryStatistics"],
    update(cache, { data: { createTransaction } }) {
      try {
        // Log the cache data before the update
        const dataBefore = cache.readQuery({ query: GET_TRANSACTIONS });
        console.log("Cache data before update:", dataBefore);
    
        if (dataBefore && dataBefore.transactions) {
          const { transactions } = dataBefore;
    
          cache.writeQuery({
            query: GET_TRANSACTIONS,
            data: {
              transactions: [...transactions, createTransaction],
            },
          });
    
          // Log the cache data after the update
          const dataAfter = cache.readQuery({ query: GET_TRANSACTIONS });
          console.log("Cache data after update:", dataAfter);
        } else {
          console.warn("No transactions found in cache.");
        }
    
        // Read and update category statistics
        const existingStats = cache.readQuery({ query: GET_CATEGORY_STATS });
        console.log('Category Stats before update:', existingStats);

        // Update the cache with the new transaction data
        const newStats = existingStats.categoryStatistics.map(stat => {
          if (stat.category === createTransaction.category) {
            return {
              ...stat,
              totalAmount: stat.totalAmount + createTransaction.amount,
            };
          }
          return stat;
        });

        cache.writeQuery({
          query: GET_CATEGORY_STATS,
          data: { categoryStatistics: newStats },
        });

        // Log the category stats after the update
        const updatedStats = cache.readQuery({ query: GET_CATEGORY_STATS });
        console.log('Category Stats after update:', updatedStats);
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    onError(error) {
      console.error("Error creating transaction:", error);
    },
    variables: {
      input: {
        ...formData,
        amount: parseFloat(formData.amount),
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    try {
      await createTransaction(formData);
      setFormData(initialData);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <form
      className="w-full max-w-lg flex flex-col gap-5 px-3"
      onSubmit={handleSubmit}
    >
      {/* TRANSACTION */}
      <div className="flex flex-wrap">
        <div className="w-full">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="description"
          >
            Transaction
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={handleInputChange}
            required
            placeholder="Rent, Groceries, Salary, etc."
          />
        </div>
      </div>
      {/* PAYMENT TYPE */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="paymentType"
          >
            Payment Type
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="paymentType"
              name="paymentType"
              value={paymentType}
              onChange={handleInputChange}
            >
              <option value={"card"}>Card</option>
              <option value={"cash"}>Cash</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="category"
              name="category"
              value={category}
              onChange={handleInputChange}
            >
              <option value={"saving"}>Saving</option>
              <option value={"expense"}>Expense</option>
              <option value={"investment"}>Investment</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* AMOUNT */}
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase text-white text-xs font-bold mb-2"
            htmlFor="amount"
          >
            Amount($)
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="location"
            name="location"
            value={location}
            onChange={handleInputChange}
            type="text"
            placeholder="New York"
          />
        </div>

        {/* DATE */}
        <div className="w-full flex-1">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            id="date"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none
						 focus:bg-white"
            placeholder="Select date"
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <button
        className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br
          from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600
						disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
