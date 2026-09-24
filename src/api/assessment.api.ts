/* eslint-disable @typescript-eslint/no-explicit-any */
import BackendAPI from "./axiosClient";

export const assessFeetApi = async (formData: any) => {
    try {
        const { data, status } = await BackendAPI.post(`/assess`, formData);
        if (status === 200 && data.data) {
            return data.data;
        }
        throw new Error("Failed to analyze images");
    } catch (error: any) {
        console.log(error?.response);
        throw new Error(error?.response?.data?.message || error.message, { cause: error });
    }
}