import { useState, useEffect } from "react";
import Table from "./Table/Table";
import Alert from "../../../../../../../../Alert/Alert";

function Step6({ token, alertData, showAlert, BASE_URL }) {
    const [education, setEducation] = useState([]);
    const [fetchedEducation, setFetchedEducation] = useState([]);
    const [teaching, setTeaching] = useState([]);
    const [fetchedTeaching, setFetchedTeaching] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [fetchedDegrees, setFetchedDegrees] = useState([]);
    const [educLoaded, seteducLoaded] = useState(false);
    const [teachingLoaded, setTeachingLoaded] = useState(false);
    const [degreesLoaded, setDegreesLoaded] = useState(false);

    const readAll = async () => {
        await readTeachings();
        await readEducations();
        await readDegrees();
    };

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
        if (file && typeof file !== "string") {
            formData.append("file", file);
        }

        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/education`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (error) {
            console.log("Error adding education ", error);
        }
    };

    const deleteEducation = async (id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/education/${id}`,
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
        seteducLoaded(false);
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/education`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setEducation(() => data);
            setFetchedEducation(() => data);
        } catch (error) {
            console.log("Error reading education ", error);
        }
        seteducLoaded(true);
    };

    const editEducation = async (rowInd, id) => {
        const { field, grade, university, start, end, file } =
            education[rowInd];

        const formData = new FormData();
        if (field && field !== fetchedEducation[rowInd]["field"]) {
            formData.append("field", field);
        }
        if (grade && grade !== fetchedEducation[rowInd]["grade"]) {
            formData.append("grade", grade);
        }
        if (
            university &&
            university !== fetchedEducation[rowInd]["university"]
        ) {
            formData.append("university", university);
        }
        if (
            (start && Number(start) !== fetchedEducation[rowInd]["start"]) ||
            (end && Number(end) !== fetchedEducation[rowInd]["end"])
        ) {
            formData.append("start", Number(start));
            formData.append("end", Number(end));
        }
        if (file && typeof file !== "string") {
            formData.append("file", file);
        }

        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/education/${id}`,
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
            const res = await fetch(`${BASE_URL}/teacher/profile/teaching`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (error) {
            console.log("Error adding teaching ", error);
        }
    };

    const deleteTeaching = async (id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/teaching/${id}`,
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
        setTeachingLoaded(false);
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/teaching`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setTeaching(() => data);
            setFetchedTeaching(() => data);
        } catch (error) {
            console.log("Error reading teaching ", error);
        }
        setTeachingLoaded(true);
    };

    const editTeaching = async (rowInd, id) => {
        const { name, position, start, end } = teaching[rowInd];

        const formData = new FormData();
        if (name && name !== fetchedTeaching[rowInd]["name"]) {
            formData.append("name", name);
        }
        if (position && position !== fetchedTeaching[rowInd]["position"]) {
            formData.append("position", position);
        }
        if (
            (start && Number(start) !== fetchedTeaching[rowInd]["start"]) ||
            (end && Number(end) !== fetchedTeaching[rowInd]["end"])
        ) {
            formData.append("start", Number(start));
            formData.append("end", Number(end));
        }

        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/teaching/${id}`,
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
        if (file && typeof file !== "string") {
            formData.append("file", file);
        }

        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/degree`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (error) {
            console.log("Error adding degree ", error);
        }
    };

    const deleteDegree = async (id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/degree/${id}`,
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
        setDegreesLoaded(false);
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/degree`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setDegrees(() => data);
            setFetchedDegrees(() => data);
        } catch (error) {
            console.log("Error reading degree ", error);
        }
        setDegreesLoaded(true);
    };

    const editDegree = async (rowInd, id) => {
        const { name, desc, file } = degrees[rowInd];

        const formData = new FormData();
        if (name && name !== fetchedDegrees[rowInd]["name"]) {
            formData.append("name", name);
        }
        if (desc && desc !== fetchedDegrees[rowInd]["desc"]) {
            formData.append("desc", desc);
        }
        if (file && typeof file !== "string") {
            formData.append("file", file);
        }

        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/degree/${id}`,
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

    useEffect(() => {
        readAll();
    }, []);

    return (
        <div>
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

            {educLoaded ? (
                <Table
                    title="سابقه تحصیل"
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
            ) : (
                <div>
                    <h2>در حال خواندن سابقه تحصیل...</h2>
                </div>
            )}
            {teachingLoaded ? (
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
            ) : (
                <div>
                    <h2>در حال خواندن سابقه تدریس...</h2>
                </div>
            )}
            {degreesLoaded ? (
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
            ) : (
                <div>
                    <h2>در حال خواندن مدارک آموزشی...</h2>
                </div>
            )}
        </div>
    );
}

export default Step6;
