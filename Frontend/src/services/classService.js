import api from "./api";

export async function getClasses() {
    const response = await api.get("/classes");

    return response.data;
}

export async function createClass(classData) {
    const response = await api.post("/classes", classData);

    return response.data;
}