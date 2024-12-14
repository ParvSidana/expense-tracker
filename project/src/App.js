import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDesc] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTransactions();
      // console.log(typeof data, data);
      // data.reverse(); not good prac
      setTransactions(data);
    };

    fetchData();
  }, [loading, loadingDel]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_APP_URL}/api/transactions`
      ); //get req

      if (!res) throw new Error("Cant fetch transactions");
      const data = await res.json();
      // console.log("response", data); //array
      return data;
    } catch (error) {
      console.error("Error while fetching transactions", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date || !description) {
      toast("All fields are required");
      return;
    }
    setLoading(true);

    // console.log(process.env.REACT_APP_APP_URL);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_APP_URL}/api/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, date, description }),
        }
      );
      console.log(res);

      if (!res.ok) {
        toast.error("Invalid form data");
        throw new Error("response not found");
      }
      const data = await res.json();
      setAmount("");
      setDate("");
      setDesc("");

      toast.success("Expense Added");
      // console.log(data);
    } catch (error) {
      console.error("Error while submitting form", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (transactionId) => {
    setLoadingDel(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_APP_URL}/api/transaction/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("before setT in deleTran", transactions);

      if (!res.ok) {
        toast.error("Deletion Failed");
        throw new Error("Failed to delete transaction");
      }

      toast.success("Expense deleted successfully");

      // setTransactions((prevTransactions) =>
      //   prevTransactions.filter(
      //     (transaction) => transaction._id !== transactionId
      //   )
      // );
      // console.log("After setT in deleTran", transactions);
    } catch (error) {
      console.error("Error while deleting card", error);
    } finally {
      setLoadingDel(false);
    }
  };

  let balance = (transactions || []).reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  balance = balance.toFixed(2);

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen bg-neutral-900">
      <div className="text-white w-full px-4 m-4 sm:w-3/4 lg:w-1/2">
        <h1 className="text-5xl font-bold py-10 text-center items-center justify-center font-mono flex">
          <span className="text-4xl my-auto ">₹</span>
          {balance}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-8 rounded-lg shadow-md"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={amount}
                className="flex-1 border border-gray-500 rounded px-4 py-2 bg-gray-900 text-white focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="(+)/(-) Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                type="datetime-local"
                value={date}
                className="flex-1 border border-gray-500 rounded px-4
                 py-2 bg-gray-900 text-white focus:outline-none focus:ring focus:ring-blue-500 "
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <textarea
                type="text"
                value={description}
                className="w-full border border-gray-500 rounded px-4 py-2 bg-gray-900 text-white focus:outline-none focus:ring focus:ring-blue-500 resize-none"
                placeholder="Description"
                rows="5"
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button type="submit" className="w-full">
              {loading ? (
                <div
                  className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white
                  font-bold py-3 rounded-lg shadow-md focus:outline-none
                  focus:ring focus:ring-blue-500"
                >
                  Add Expense
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Transactions Section */}
        <div className="mt-10 space-y-6 ">
          {transactions &&
            transactions.length > 0 &&
            transactions.map((transaction, ind) => (
              <div
                // SELECT A UNQUE KEY
                key={transaction._id}
                className="relative max-w-md mx-auto rounded-lg overflow-hidden shadow-lg bg-slate-800"
              >
                <div className="px-6 py-4 flex justify-between">
                  <p className="text-white text-xl pl-1 w-5/6">
                    {transaction.description}
                  </p>
                  <div
                    className={`font-mono font-semibold text-3xl pl-1
                   ${
                     transaction.amount >= 0 ? "text-green-500" : "text-red-500"
                   }`}
                  >
                    {transaction.amount >= 0
                      ? "+" + transaction.amount.toFixed(2)
                      : transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div className="px-6 pt-4 pb-2 flex justify-end">
                  <span className="text-sm font-medium text-gray-400">
                    {dayjs(new Date(transaction.date)).format(
                      "MMM D, YYYY h:mm A	"
                    )}
                  </span>
                </div>
                <div className="absolute bottom-3 left-7 ">
                  <button
                    onClick={() => deleteTransaction(transaction._id)}
                    className="bg-blue-500 text-white p-2 items-center flex justify-center
                      rounded-md hover:bg-red-700"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default App;
