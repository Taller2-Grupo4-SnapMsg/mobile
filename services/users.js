import axios from "axios";

const listUsers = async (page) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/users?page=${page}`
    );
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Service is not available at the moment";
    console.log(message);
    throw new Error(message);
  }
};

export default { listUsers };
