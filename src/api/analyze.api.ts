/* eslint-disable @typescript-eslint/no-explicit-any */
import BackendAPI from "./axiosClient";

export const analyzeImageApi = async (leftImage: File, rightImage: File, scanned: boolean = false) => {
    try {
        const formData = new FormData();
        formData.append("leftImage", leftImage);
        formData.append("rightImage", rightImage);
        formData.append("scanned", scanned.toString());
        const { data, status } = await BackendAPI.post(`/analyze`, formData);
        if (status === 200 && data.data) {
            return data.data;
        }
        throw new Error("Failed to analyze images");
    } catch (error: any) {
        console.log(error);
        throw new Error(error?.response?.data?.message || error.message, { cause: error });
    }
}