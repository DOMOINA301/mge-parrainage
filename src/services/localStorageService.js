import localforage from 'localforage';

localforage.config({
  name: 'MGEDatabase',
  storeName: 'mge_data',
  driver: localforage.INDEXEDDB
});

// ==================== UTILISATEURS ====================
export const getUsers = async () => {
  const users = await localforage.getItem('users');
  return users || [];
};

export const saveUser = async (user) => {
  const users = await getUsers();
  const existingIndex = users.findIndex(u => u.email === user.email);
  
  if (existingIndex !== -1) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    user.id = user.id || Date.now().toString();
    user.createdAt = user.createdAt || new Date().toISOString();
    users.push(user);
  }
  await localforage.setItem('users', users);
  return user;
};

export const deleteUser = async (userId) => {
  let users = await getUsers();
  users = users.filter(u => u.id !== userId);
  await localforage.setItem('users', users);
};

export const findUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find(u => u.email === email);
};

export const createDefaultAdmin = async () => {
  const users = await getUsers();
  const adminExists = users.find(u => u.email === 'admin@gmail.com');
  
  if (!adminExists) {
    const admin = {
      id: 'admin_001',
      nom: 'Administrateur',
      email: 'admin@gmail.com',
      password: btoa('admin123'),
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    };
    users.push(admin);
    await localforage.setItem('users', users);
    console.log('✅ Admin créé localement');
  }
};

// Création d'admin avec clé secrète
export const createAdminWithSecretKey = async (secretKey, userData) => {
  const ADMIN_SECRET_KEY = 'MGE_ADMIN_SECRET_2026';
  
  if (secretKey !== ADMIN_SECRET_KEY) {
    return { success: false, message: 'Clé secrète invalide' };
  }
  
  const users = await getUsers();
  const existingUser = users.find(u => u.email === userData.email);
  
  if (existingUser) {
    return { success: false, message: 'Cet email existe déjà' };
  }
  
  const newAdmin = {
    id: Date.now().toString(),
    nom: userData.nom,
    email: userData.email,
    password: btoa(userData.password),
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    active: true
  };
  
  users.push(newAdmin);
  await localforage.setItem('users', users);
  return { success: true, message: 'Admin créé avec succès' };
};

// ==================== ÉLÈVES ====================
export const getStudents = async () => {
  const students = await localforage.getItem('students');
  return students || [];
};

export const getStudentById = async (id) => {
  const students = await getStudents();
  return students.find(s => s.id === id);
};

export const saveStudent = async (student) => {
  const students = await getStudents();
  
  if (student.id) {
    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      students[index] = { ...students[index], ...student, updatedAt: new Date().toISOString() };
    }
  } else {
    student.id = Date.now().toString();
    student.createdAt = new Date().toISOString();
    students.push(student);
  }
  await localforage.setItem('students', students);
  return student;
};

export const deleteStudent = async (id) => {
  let students = await getStudents();
  students = students.filter(s => s.id !== id);
  await localforage.setItem('students', students);
  
  const situations = await getSituations();
  const remainingSituations = situations.filter(s => s.studentId !== id);
  await localforage.setItem('situations', remainingSituations);
};

// ==================== SITUATIONS ====================
export const getSituations = async () => {
  const situations = await localforage.getItem('situations');
  return situations || [];
};

export const getSituationById = async (id) => {
  const situations = await getSituations();
  return situations.find(s => s.id === id);
};

export const getSituationsByStudent = async (studentId) => {
  const situations = await getSituations();
  return situations.filter(s => s.studentId === studentId).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
};

export const saveSituation = async (situation) => {
  const situations = await getSituations();
  
  if (situation.id) {
    const index = situations.findIndex(s => s.id === situation.id);
    if (index !== -1) {
      situations[index] = { ...situations[index], ...situation, updatedAt: new Date().toISOString() };
    }
  } else {
    situation.id = Date.now().toString();
    situation.createdAt = new Date().toISOString();
    situations.push(situation);
  }
  await localforage.setItem('situations', situations);
  return situation;
};

export const updateSituationStatus = async (id, newStatus) => {
  const situations = await getSituations();
  const index = situations.findIndex(s => s.id === id);
  if (index !== -1) {
    situations[index].statut = newStatus;
    situations[index].updatedAt = new Date().toISOString();
    await localforage.setItem('situations', situations);
    return situations[index];
  }
  return null;
};

export const deleteSituation = async (id) => {
  let situations = await getSituations();
  situations = situations.filter(s => s.id !== id);
  await localforage.setItem('situations', situations);
};

// ==================== STATS ====================
export const getStats = async () => {
  const students = await getStudents();
  const situations = await getSituations();
  
  return {
    totalStudents: students.length,
    totalSituations: situations.length,
    actifs: students.filter(s => s.statut === 'actif').length,
    suspendus: students.filter(s => s.statut === 'suspendu').length,
  };
};

// ==================== INIT ====================
export const initDatabase = async () => {
  await createDefaultAdmin();
  console.log('📱 Base locale initialisée');
};