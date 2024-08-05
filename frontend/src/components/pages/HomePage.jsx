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
import { useApolloClient } from "@apollo/client";
import { GET_CATEGORY_STATS } from "../../graphql/queries/transaction.query";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const { data: userData } = useQuery(GET_USER, {
  });
  const { data: categoryStatsData, loading: categoryStatsDataLoading } =
  useQuery(GET_CATEGORY_STATS, {
      // refetchQueries: ["Transaction", "Transactions"],
    });
  const client = useApolloClient();
  const [logoutUser, { loading: logoutLoading, error: logoutError }] =
    useMutation(LOGOUT_USER, {
      variables: {},
    });
  const { profilePicture } = userData?.authUser;

  const totalAmount =
    categoryStatsData?.categoryStatistics?.map((stat) => stat.totalAmount) ||
    [];

  const categoryColors = {
    saving: "rgba(75, 192, 192)",
    expense: "rgba(255, 99, 132)",
    investment: "rgba(54, 162, 235)",
  };

  function getColorForCategory(category) {
    return categoryColors[category] || "rgba(0, 0, 0)";
  }
  const categories = categoryStatsData?.categoryStatistics?.map((stat) => stat.category) || [];

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  let categoryLabels = categories.map(capitalizeFirstLetter);

  const backgroundColors = categories.map(getColorForCategory);
  const borderColors = categories.map(getColorForCategory);
  
  const chartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: " $",
        data: totalAmount,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
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
      await client.cache.reset();
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
          {categoryStatsDataLoading && (
            <div className="w-full h-full flex justify-center items-center">
              <div className="w-10 h-10 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
            </div>
          )}
          {totalAmount.length > 0 ? (
            <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
              <Doughnut data={chartData} />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-lg">No data to display</p>
            </div>
          )}

          <TransactionForm />
        </div>
        <Cards />
      </div>
    </>
  );
};
export default HomePage;
