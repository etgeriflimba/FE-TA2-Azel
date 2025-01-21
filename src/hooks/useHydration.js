import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const dispatch = useDispatch();

  const hydrateAuth = async () => {
    try {
      // Check for user token
      const userToken = localStorage.getItem("api_token_user");
      const adminToken = localStorage.getItem("api_token_admin");
  
      // Determine the token and endpoint
      let token = null;
      let endpoint = null;
  
      if (userToken) {
        token = userToken;
        endpoint = '/v1/pasien/profil';
      } else if (adminToken) {
        token = adminToken;
        endpoint = '/v1/admin/profil';
      }
  
      // If no valid token found, exit
      if (!token || !endpoint) return;
  
      // Fetch user/admin profile data
      const userResponse = await axiosInstance.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      console.log(userResponse);
  
      // Dispatch user or admin data
      dispatch({
        type: "USER_LOGIN",
        payload: {
          id: userResponse.data.data.id,
          role: endpoint.includes('admin') ? 'Admin' : 'User',
          name: userResponse.data.data.nama,
          username: userResponse.data.data.username,
          profile_url: `${import.meta.env.VITE_API_URL}/v1/public/${endpoint.includes('admin') ? 'admin' : 'pasien'}/foto-profil/${userResponse.data.data.id}`,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsHydrated(true);
    }
  };
  

  useEffect(() => {
    hydrateAuth();
  }, []);

  return {
    isHydrated,
  };
};
