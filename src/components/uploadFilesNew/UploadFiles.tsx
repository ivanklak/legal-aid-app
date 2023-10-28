import React, {useState} from 'react';
import styles from './UploadFiles.module.sass';
import {Modal, Upload, UploadFile} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadFiles = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewPdf, setPreviewPdf] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (file.type === 'application/pdf') {
            // const url = URL.createObjectURL(file.originFileObj);
            setPreviewPdf(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
            return;
        }

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    }

    const handleBeforeUpload = (file: RcFile, FileList: RcFile[]) => {
        // let reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onloadend = function () {
        //     this.setState({
        //         fileList:[file]
        //     });
        // }.bind(this);

        return false
    }

    const renderIcon = (file: UploadFile): React.ReactNode => {
        if (file.type === 'application/pdf') {
            const url = URL.createObjectURL(file.originFileObj);
            return (
                <div className={styles['preview_container']}>
                    <embed src={url} width="84"/>
                </div>
            )
        }
    }

    return (
        <>
            <Upload
                multiple
                type="select"
                accept="image/*,.png,.jpg,.gif,.pdf,.web"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                className={styles['upload-container']}
                beforeUpload={handleBeforeUpload}
                iconRender={renderIcon}
            >
                <div>
                    <PlusOutlined />
                </div>
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                {!!previewPdf ? (
                    <embed src={previewPdf} width="150" height="100" />
                ) : (
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                )}
            </Modal>
        </>
    )
}

export default UploadFiles;