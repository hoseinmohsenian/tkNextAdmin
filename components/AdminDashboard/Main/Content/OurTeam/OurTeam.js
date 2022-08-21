import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import Box from "../Elements/Box/Box";
import DeleteModal from "../../../../DeleteModal/DeleteModal";
import API from "../../../../../api/index";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function OurTeam({ fetchedMembers }) {
    const [members, setMembers] = useState(fetchedMembers);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(
        Array(fetchedMembers?.length).fill(false)
    );
    const [dModalVisible, setDModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState({});

    const deleteMember = async (member_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const { status, response } = await API.delete(
                `/admin/our-team/${member_id}`
            );

            if (status === 200) {
                const filteredMember = members.filter(
                    (member) => member.id !== member_id
                );
                setMembers(filteredMember);
                showAlert(true, "danger", "این عضو حذف شد");
                setDModalVisible(false);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            let temp = [...loadings];
            temp[i] = false;
        } catch (error) {
            console.log("Error deleting member", error);
        }
        setLoadings(() => temp);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    ourTeams: "تیم ما",
                }}
            />

            <Box
                title="تیم ما"
                buttonInfo={{
                    name: "عضو جدید",
                    url: "/tkpanel/ourTeams/create",
                    color: "primary",
                }}
            >
                <DeleteModal
                    visible={dModalVisible}
                    setVisible={setDModalVisible}
                    title="حذف عضو"
                    bodyDesc={`آیا از حذف عضو «${selectedMember.name}» اطمینان دارید؟`}
                    handleOk={() => {
                        deleteMember(selectedMember?.id, selectedMember.index);
                    }}
                    confirmLoading={loadings[selectedMember.index]}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {members?.map((member, i) => (
                                <tr
                                    className="table__body-row"
                                    key={member?.id}
                                >
                                    <td className="table__body-item">
                                        {member.name}
                                    </td>
                                    <td className="table__body-item">
                                        {member.title}
                                    </td>
                                    <td className="table__body-item">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                width={90}
                                                height={90}
                                                style={{
                                                    width: 90,
                                                    height: 90,
                                                }}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/ourTeams/${member?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() => {
                                                setSelectedMember({
                                                    ...member,
                                                    index: i,
                                                });
                                                setDModalVisible(true);
                                            }}
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {members?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        عضوی پیدا نشد !
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteMember}
            />
        </div>
    );
}

export default OurTeam;
