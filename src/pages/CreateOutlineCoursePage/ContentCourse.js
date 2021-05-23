import JoditEditor from "jodit-react";
import {useState, useEffect, useRef, useMemo} from 'react';
import {Col, Form, Row} from "antd";

import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const ContentCourse = ({
                           setDetailContent,
                           setExamFormality,
                           setGoal,
                           setTeachingFormality,
                           setSummaryContent,
                           setDocument,
                           setCoursePolicy,
                           content
                       }) => {

    const onChange = (value) => {
        if (setTeachingFormality) setTeachingFormality(value);
        if (setDetailContent) setDetailContent(value);
        if (setExamFormality) setExamFormality(value);
        if (setGoal) setGoal(value);
        if (setSummaryContent) setSummaryContent(value);
        if (setDocument) setDocument(value);
        if (setCoursePolicy) setCoursePolicy(value);

    }

    useEffect(() => {
        if(content) {
            if (setTeachingFormality) setTeachingFormality(content);
            if (setDetailContent) setDetailContent(content);
            if (setExamFormality) setExamFormality(content);
            if (setGoal) setGoal(content);
            if (setSummaryContent) setSummaryContent(content);
            if (setDocument) setDocument(content);
            if (setCoursePolicy) setCoursePolicy(content);
        }
    }, [])

    return useMemo(() => (
        <>
            {/*<Form.Item>
                    <JoditEditor
                        tabIndex={1}
                        config={config}
                        value=""
                        onChange={onChange}
                    />
                </Form.Item>*/}
            <Row>
                <Col span={18}>
                    <CKEditor
                        editor={ClassicEditor}
                        config={{
                            placeholder: "Nhập nội dung",
                        }}
                        data={content}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            onChange(data);
                        }}
                    />
                </Col>
            </Row>

        </>
    ), [])
}

export default ContentCourse;