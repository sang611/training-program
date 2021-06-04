import Title from "antd/lib/typography/Title";
import {Button, message, Select} from "antd";
import {useState} from 'react'
import axios from "axios";
import {classCodes} from '../../constants/index'

const AddTrainingProgramClass = ({trainingProgram}) => {
    const [classes, setClasses] = useState(null);
    const [disable, setDisable] = useState(true);

    function handleChange(value) {
        setClasses(value)

        if(JSON.stringify(value) === trainingProgram.classes){
            setDisable(true);
        }
        else {
            setDisable(false);
        }

    }

    function onAddClasses() {
        axios.put(`/training-programs/${trainingProgram.uuid}/classes`, {
            classes: classes
        })
            .then((res) => {
                message.success(res.data.message)
            })
            .catch((error) => {
                message.error(error.response.data.message)
            })
    }

    return (
        <>
            <Title level={4}>
                Danh sách các lớp áp dụng
            </Title>
            {
                trainingProgram.classes ?
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '50%' }}
                        placeholder="Chọn các lớp theo CTĐT này"
                        onChange={handleChange}
                        defaultValue={
                            JSON.parse(trainingProgram.classes)
                        }
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            classCodes.map((classCode, index) => {
                                return (
                                    <Select.Option value={classCode} key={index}>{classCode}</Select.Option>
                                )
                            })
                        }
                    </Select>
                    :
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '50%' }}
                        placeholder="Chọn các lớp theo CTĐT này"
                        onChange={handleChange}
                    >
                        {
                            classCodes.map((classCode, index) => {
                                return (
                                    <Select.Option value={classCode} key={index}>{classCode}</Select.Option>
                                )
                            })
                        }
                    </Select>

            }



            <Button type="primary" onClick={onAddClasses} disabled={disable}>
                Thêm
            </Button>

        </>
    )
}

export default AddTrainingProgramClass;
