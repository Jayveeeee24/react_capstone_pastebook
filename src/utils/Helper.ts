// import axios from "axios";
// import { BASE_URL, Storage } from "./Config";

// export const loadToken = async () => {
//     setLoading(true);
//     const token = Storage.getString('userToken');

//     if (token) {
//       // const cleanedToken = token.replace(/^"(.*)"$/, '$1');
//       // axios.interceptors.request.use(request => {
//       //   console.log('Starting Request', request);
//       //   return request;
//       // });
//       axios.defaults.headers.common['Authorization'] = token;

//       axios.get(`${BASE_URL}/api/authentication/validate-token`)
//         .then((response: any) => {
//           if (response.data == true) {
//             setAuthState(true);
//           }
//         }).catch((e) => {
//           console.log('use effect error: ' + e.response.data.result)
//           Storage.clearAll();
//           setAuthState(false);
//           axios.defaults.headers.common['Authorization'] = '';

//         }).finally(() => {
//           setLoading(false);
//         })
//     } else {
//       setLoading(false);
//     }
//   };