import axios from "axios";

const backendAxios = axios.create({
  baseURL:
    import.meta.env.VITE_PRODUCTION === "development"
      ? "http://localhost:8000"
      : "http://localhost:8000",
});

export const getSingleRecipe = (recipeId) => {
  return new Promise((resolve, reject) => {
    try {
      backendAxios.get(`/api/recipe/${recipeId}`).then((res) => {
        resolve(res.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

//SmartEats get list of questions
export const getQuestions = () => {
  return new Promise((resolve, reject) => {
    try {
      backendAxios.get(`/api/smart/questions`).then((res) => {
        resolve(res.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const answerQuestions = () => {
  return new Promise((resolve, reject) => {
    try {
      backendAxios.post(`/api/smart/answers`).then((res) => {
        resolve(res.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const startConversation = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log("running2");
      backendAxios
        .get(`/conversation/start`)
        .then((response) => {
          console.log(response);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);

          reject(error);
        });
    } catch (error) {
      console.log("rejecting");
      reject(error);
    }
  });
};

export const replyConversation = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      backendAxios
        .post(`/conversation`, payload)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);

          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const adjustRecipe = (payload) => {
  return new Promise((resolve, reject) => {
    try {
      backendAxios
        .post(`/adjust`, payload)
        .then((response) => {
          console.log("adjustRecipe response.data", response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
