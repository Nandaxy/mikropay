import { BASE_URL } from "./config";
import axios from "axios";

export const postAction = async ({ endpoint, data }) => {
  console.log(data);

  try {
    const token = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error making POST request:", error);
  }
};

export const getAction = async ({ endpoint }) => {
  try {
    const token = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
  }
};

export const mikrotikAction = async ({
  router,
  method,
  endpoint,
  bodyData,
}) => {
  const routerData = router;
  // console.log(routerData);

  try {
    const token = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}api/mikrotik/action`,
      { routerData, method, endpoint, bodyData },
      { headers }
    );

    return response.data;
  } catch (error) {
    //   console.error("Error during MikroTik API request via proxy:", error);
  }
};
