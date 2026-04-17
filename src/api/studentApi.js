import api from "../api/axios";

const API_URL = "/students";

// ➕ CRÉER ÉTUDIANT
export const createStudent = (data) =>
  api.post(API_URL, data);

// 📄 LISTE
export const getStudents = () =>
  api.get(API_URL);

// 🗑 SUPPRIMER
export const deleteStudent = (id) =>
  api.delete(`${API_URL}/${id}`);

// ✏️ MODIFIER
export const updateStudent = (id, data) =>
  api.put(`${API_URL}/${id}`, data);

// 📷 UPLOAD PHOTO
export const uploadPhoto = (id, file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return api.put(`${API_URL}/${id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
