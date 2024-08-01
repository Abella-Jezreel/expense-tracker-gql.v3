import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { DELETE_TRANSACTION } from "../../graphql/mutations/transaction.mutation";
import { useMutation } from "@apollo/client";

const categoryColorMap = {
	saving: "from-green-700 to-green-400",
	expense: "from-pink-800 to-pink-600",
	investment: "from-blue-700 to-blue-400",
};

const Card = ({ transaction }) => {
	const { category, description, amount, user, location, date, paymentType, _id } = transaction;
	const cardClass = categoryColorMap[category];

	const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
		refetchQueries: ["Transactions", "AuthUser"],
		variables: {
		  transactionId: _id,
		},
	  });

	const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	  };

	  const formatDate = (timestamp) => {
		const date = new Date(parseInt(timestamp, 10));
		return date.toLocaleDateString('en-GB', {
		  day: '2-digit',
		  month: 'short',
		  year: 'numeric'
		});
	  };

	 const onClickDelete = () => {
		deleteTransaction();
	  };


	return (
		<div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-row items-center justify-between'>
					<h2 className='text-lg font-bold text-white'>{capitalizeFirstLetter(category)}</h2>
					<div className='flex items-center gap-2'>
						<FaTrash className={"cursor-pointer"} onClick={onClickDelete}/>
						<Link to={`/transaction/${_id}`}>
							<HiPencilAlt className='cursor-pointer' size={20} />
						</Link>
					</div>
				</div>
				<p className='text-white flex items-center gap-1'>
					<BsCardText />
					Description: {capitalizeFirstLetter(description)}
				</p>
				<p className='text-white flex items-center gap-1'>
					<MdOutlinePayments />
					Payment Type: {capitalizeFirstLetter(paymentType)}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaSackDollar />
					Amount: ${amount}
				</p>
				<p className='text-white flex items-center gap-1'>
					<FaLocationDot />
					Location: {location}
				</p>
				<div className='flex justify-between items-center'>
					<p className='text-xs text-black font-bold'>{formatDate(date)}</p>
					<img
						src={user?.profilePicture}
						className='h-8 w-8 border rounded-full'
						alt=''
					/>
				</div>
			</div>
		</div>
	);
};
export default Card;