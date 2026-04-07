import axios from "axios";
const eventHandler = async ({ eventName, data, socketId }) => {
       try {
              const res = await axios.post(
                     `${process.env.NEXT_PUBLIC_NODE_SOCKET_URL}/notification`,
                     { eventName, data, socketId }
              );
       } catch (error) {
              console.error("eventHandler error:",error?.response?.data || error.message);
              return {
                     success: false,
                     message: "Event failed",
              };
       }
};

export default eventHandler;
