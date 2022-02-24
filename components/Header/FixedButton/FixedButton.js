import React, { useState } from "react";
import styles from "./FixedButton.module.css";
import Modal from "../../Modal/Modal";
import HeaderModalContent from "../HeaderModalContent/HeaderModalContent";

function FixedButton() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {/* Chatbox Toggle Button For Large Screens */}
            <div className={styles["chatbox-toggle-btn"]}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                    <path
                        d="M60.19,53.75a3,3,0,1,0,3.06,3A3,3,0,0,0,60.19,53.75Zm-11.37,0a3,3,0,1,0,3.06,3A3,3,0,0,0,48.81,53.75Zm45.94,4A35,35,0,1,0,52.75,92v12.76s14.55-4.25,30.53-19.28C94.68,74.74,94.75,59.41,94.75,59.41l0,0C94.74,58.87,94.75,58.3,94.75,57.72Zm-10.14.6s0,10.64-8,18.09A57.93,57.93,0,0,1,53,89.8V80.34A24.29,24.29,0,1,1,84.61,57.16c0,.4,0,.8,0,1.19ZM70.69,53.75a3,3,0,1,0,3.06,3A3,3,0,0,0,70.69,53.75Z"
                        transform="translate(0.25 0.25)"
                        style={{ fill: "#ffffff" }}
                    ></path>
                </svg>
            </div>

            {/* Modal Toggle Button For Small Screens */}
            <div
                className={styles["modal-btn"]}
                onClick={() => setShowModal(!showModal)}
            >
                <img
                    src="/icons/whatsapp-icon.png"
                    alt="Whatsapp icon"
                    className={styles["modal-btn-icon"]}
                />
            </div>
            <Modal show={showModal} setter={setShowModal}>
                <HeaderModalContent />
            </Modal>
        </>
    );
}

export default FixedButton;
