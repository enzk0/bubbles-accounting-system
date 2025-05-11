import React from "react";
import Modal from "./Modal";

function EditModal({ jobOrderId, isVisible, ref }) {
    return (
        <div>
            <Modal isVisible={isVisible} ref={ref}>
                <div>This is so sigma</div>
                <div>{jobOrderId}</div>
            </Modal>
        </div>
    );
}

export default EditModal;
