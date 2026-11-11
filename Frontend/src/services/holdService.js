import api from "./api";

export async function createHold(classId, studentId) {
    const response = await api.post(
        `/classes/${classId}/holds`,
        {},
        {
            headers: {
                "X-Student-Id": studentId,
            },
        }
    );

    return response.data;
}
export async function getMyHolds(studentId) {
    const response = await api.get("/me/holds", {
        headers: {
            "X-Student-Id": studentId,
        },
    });

    return response.data;
}
export async function confirmHold(holdId, studentId) {
    const response = await api.post(
        `/holds/${holdId}/confirm`,
        {},
        {
            headers: {
                "X-Student-Id": studentId,
            },
        }
    );

    return response.data;
}

export async function cancelHold(holdId, studentId) {
    const response = await api.delete(
        `/holds/${holdId}`,
        {
            headers: {
                "X-Student-Id": studentId,
            },
        }
    );

    return response.data;
}