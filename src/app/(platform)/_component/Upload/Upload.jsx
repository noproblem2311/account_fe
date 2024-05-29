import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload as AntUpload, Modal } from 'antd';

const { Dragger } = AntUpload;

const Upload = ({ fileList, setFileList }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const props = {
        name: 'file',
        multiple: true,
        listType: 'picture',
        beforeUpload: (file) => {
            setFileList((prevFileList) => [...prevFileList, file]);
            message.success(`${file.name} file added successfully.`);
            return false; // Return false to prevent automatic upload
        },
        onRemove: (file) => {
            setFileList((prevFileList) =>
                prevFileList.filter((item) => item.uid !== file.uid)
            );
            message.info(`${file.name} file removed.`);
        },
        fileList,
        onPreview: handlePreview,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                </p>
            </Dragger>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};

export default Upload;