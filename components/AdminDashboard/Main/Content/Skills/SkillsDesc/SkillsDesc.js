import { useState } from "react";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import Modal from "../../../../../Modal/Modal";

function SkillsDesc({ fetchedSkills: { data, ...restData }, token }) {
    const [skills, setSkills] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState({});

    const readSkills = async (page = 1) => {
        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (Number(filters[key]) !== 0) {
                searchQuery += `${key}=${filters[key]}&`;
            }
        });
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/content/skill/description/inf`,
            query: { page },
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/teaching/skill?${searchQuery}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setSkills(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading skills", error);
        }
    };

    return (
        <div>
            <Box
                title="توضیحات مهارت ها"
                buttonInfo={{
                    name: "لیست مهارت ها",
                    url: "/content/skill",
                    color: "primary",
                }}
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات تخصص</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کلید سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.seo_key || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.seo_desc || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.title_seo || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">مهارت</th>
                                <th className="table__head-item">تخصص</th>
                                <th className="table__head-item">h1</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {skills?.map((sk) => (
                                <tr className="table__body-row" key={sk?.id}>
                                    <td className="table__body-item">
                                        {sk?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.speciality?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.h1 || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/skill/description/inf/${sk?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>{" "}
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedSkill(sk);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {skills.length !== 0 && (
                    <Pagination read={readSkills} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default SkillsDesc;
