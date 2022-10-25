import axios from 'axios';

const API_SERVER_ADDRESS = process.env.REACT_APP_API_HOST;

const productReceiveDataConnect = () => {
    return {
        postList: async function(data){
            return await axios.post(`${API_SERVER_ADDRESS}/api/v1/product-receive/list`, data,{
                withCredentials: true
            })
        },
        searchList: async function(productOptionCid) {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/product-receive/list/${productOptionCid}`,{
                withCredentials: true
            })
        },
        // memo 수정 <- TODO::path로 변경해도 될듯
        putOne: async function (data) {
            return await axios.put(`${API_SERVER_ADDRESS}/api/v1/product-receive/one`, data, {
                withCredentials: true
            })
        },
        
        // [221025] FEAT
        createBatch: async function(data){
            return await axios.post(`${API_SERVER_ADDRESS}/api/v2/product-receive/batch`, data,{
                withCredentials: true
            })
        },
    }
}

export {
    productReceiveDataConnect
}