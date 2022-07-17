import { useState, useEffect } from "react";
import Table from "./Table/Table";
import Alert from "../../../../../../../../Alert/Alert";

function Step6({ token, fetchedTeaching, fetchedEducation, fetchedDegrees }) {
    const [education, setEducation] = useState(fetchedEducation || []);
    const [teaching, setTeaching] = useState(fetchedTeaching || []);
    const [degrees, setDegrees] = useState(fetchedDegrees || []);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const getAll = async () => {
        await getTeachingAll();
        await getEducatingAll();
        await getDegreeAll();
    };

    useEffect(() => {
        getAll();
    }, []);

    const getEducatingAll = async () => {
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/education",
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();

            console.log(data);
            setEducation(data);
        } catch (error) {
            console.log("error fetching cities", error);
        }
    };

    const getTeachingAll = async () => {
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/teaching",
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();

            console.log(data);
            setTeaching(data);
        } catch (error) {
            console.log("error fetching cities", error);
        }
    };

    const getDegreeAll = async () => {
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/degree",
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();

            console.log(data);
            setDegrees(data);
        } catch (error) {
            console.log("error fetching cities", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    // console.log("*************education**********")
    // console.log(education)
    // *********************** Education APIs ***********************
    const addEducation = async (rowInd) => {
        const { field, grade, university, start, end, file } =
            education[rowInd];

        const formData = new FormData();
        formData.append("field", field);
        formData.append("grade", grade);
        formData.append("university", university);
        formData.append("start", start);
        formData.append("end", end);
        formData.append("file", file);

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/education`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error adding education ", error);
        }
    };

    const deleteEducation = async (id) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/education/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error deleting education ", error);
        }
    };

    const readEducations = async () => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/education`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setEducation(() => data);
        } catch (error) {
            console.log("Error reading education ", error);
        }
    };

    const editEducation = async (rowInd, id) => {
        const { field, grade, university, start, end, file } =
            education[rowInd];

        const formData = new FormData();
        formData.append("field", field);
        formData.append("grade", grade);
        formData.append("university", university);
        formData.append("start", start);
        formData.append("end", end);
        if (typeof file !== "string") {
            formData.append("file", file);
        }

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/education/${id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error editing education ", error);
        }
    };
    // *********************** Education APIs ***********************

    // *********************** Teaching APIs ***********************
    const addTeaching = async (rowInd) => {
        const { name, position, start, end } = teaching[rowInd];
        const body = {
            name,
            position,
            start,
            end,
        };

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/teaching`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error adding teaching ", error);
        }
    };

    const deleteTeaching = async (id) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/teaching/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error deleting teaching ", error);
        }
    };

    const readTeachings = async () => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/teaching`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setTeaching(() => data);
        } catch (error) {
            console.log("Error reading teaching ", error);
        }
    };

    const editTeaching = async (rowInd, id) => {
        const { name, position, start, end } = teaching[rowInd];
        const body = {
            name,
            position,
            start,
            end,
        };

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/teaching/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error editing teaching ", error);
        }
    };
    // *********************** Teaching APIs ***********************

    // *********************** Degree APIs ***********************
    const addDegree = async (rowInd) => {
        const { name, desc, file } = degrees[rowInd];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("desc", desc);
        formData.append("file", file);

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/degree`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error adding degree ", error);
        }
    };

    const deleteDegree = async (id) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/degree/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error deleting degree ", error);
        }
    };

    const readDegrees = async () => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/degree`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setDegrees(() => data);
        } catch (error) {
            console.log("Error reading degree ", error);
        }
    };

    const editDegree = async (rowInd, id) => {
        const { name, desc, file } = degrees[rowInd];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("desc", desc);
        if (typeof file !== "string") {
            formData.append("file", file);
        }

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/degree/${id}`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error editing degree ", error);
        }
    };
    // *********************** Degree APIs ***********************

    return (
        <div>
            <div className="container">
                {/* Alert */}
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={
                        addEducation ||
                        editEducation ||
                        deleteEducation ||
                        addTeaching ||
                        editTeaching ||
                        deleteTeaching ||
                        addDegree ||
                        editDegree ||
                        deleteDegree
                    }
                />

                <Table
                    newRowText="اضافه کردن سابقه تحصیل"
                    headers={[
                        "رشته تحصیلی",
                        "مقطع تحصیلی",
                        "دانشگاه",
                        "مدت تحصیل",
                        "مدرک",
                    ]}
                    inputNames={[
                        "field",
                        "grade",
                        "university",
                        "start",
                        "end",
                        "file",
                    ]}
                    inputTypes={["text", "text", "text", "time", "file"]}
                    rows={education}
                    setRows={setEducation}
                    onAdd={addEducation}
                    onDelete={deleteEducation}
                    read={readEducations}
                    onEdit={editEducation}
                    showAlert={showAlert}
                />
                <Table
                    title="سابقه ی تدریس"
                    headers={[
                        "آموزشگاه/شرکت/سازمان",
                        "موقعیت شغلی",
                        "مدت تحصیل",
                    ]}
                    newRowText="اضافه کردن سابقه تدریس"
                    inputNames={["name", "position", "start", "end"]}
                    inputTypes={["text", "text", "time"]}
                    rows={teaching}
                    setRows={setTeaching}
                    onAdd={addTeaching}
                    onDelete={deleteTeaching}
                    read={readTeachings}
                    onEdit={editTeaching}
                    showAlert={showAlert}
                />
                <Table
                    title="مدارک آموزشی"
                    headers={["نام مدرک", "توضیح", "عکس"]}
                    newRowText="اضافه کردن مدرک"
                    inputNames={["name", "desc", "file"]}
                    inputTypes={["text", "text", "file"]}
                    rows={degrees}
                    setRows={setDegrees}
                    onAdd={addDegree}
                    onDelete={deleteDegree}
                    read={readDegrees}
                    onEdit={editDegree}
                    showAlert={showAlert}
                />
            </div>
        </div>
    );
}

export default Step6;
