import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Cards from "../ui/Cards";
import TransactionForm from "../ui/TransactionForm";
import { MdLogout } from "react-icons/md";
import { LOGOUT_USER } from "../../graphql/mutations/user.mutation";
import GET_USER from "../../graphql/queries/user.query";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { data: userData } = useQuery(GET_USER);
  const [logoutUser, { loading: logoutLoading, error: logoutError }] =
    useMutation(LOGOUT_USER, {
      refetchQueries: ["AuthUser", "Transactions"],
      variables: {},
    });
  const { profilePicture } = userData?.authUser;

  console.log(userData, "userData");
  const transactions = userData?.authUser?.transactions;

  let data = [0, 0, 0]; // Default values in case transactions is undefined

if (transactions) {
  const categoryCounts = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const savingsCount = categoryCounts['saving'] || 0;
  const expenseCount = categoryCounts['expense'] || 0;
  const investmentCount = categoryCounts['investment'] || 0;

  const totalCount = savingsCount + expenseCount + investmentCount;

  if (totalCount > 0) {
    const savingsPercentage = (savingsCount / totalCount) * 100;
    const expensePercentage = (expenseCount / totalCount) * 100;
    const investmentPercentage = (investmentCount / totalCount) * 100;

    data = [savingsPercentage, expensePercentage, investmentPercentage];
  }

  console.log(data, "Pie Chart Data");
}

  const chartData = {
    labels: ["Saving", "Expense", "Investment"],
    datasets: [
      {
        label: "%",
        data: data,
        backgroundColor: [
          "rgba(75, 192, 192)",
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
        ],
        borderColor: [
          "rgba(75, 192, 192)",
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch {
      toast.error(logoutError.message);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
            <img
              src={profilePicture}
              className="w-11 h-11 rounded-full border cursor-pointer"
              alt="Avatar"
			  loading="lazy"
            />
          {!logoutLoading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {logoutLoading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
            <Doughnut data={chartData} />
          </div>

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;
