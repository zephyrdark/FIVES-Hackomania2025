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
      backendAxios.get(`/api/smart/answers`).then((res) => {
        resolve(res.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
