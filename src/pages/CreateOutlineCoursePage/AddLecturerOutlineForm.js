import {Select} from 'antd';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'


const {Option} = Select;
const AddLecturerOutlineForm = ({setLecturers, lecturers}) => {

    const {accounts} = useSelector((state) => state.accounts);
    const dispatch = useDispatch();

    useEffect(() => {
        if(lecturers) setLecturers(JSON.parse(lecturers))
    }, [])

    useEffect(() => {
        dispatch(actions.fetchAccounts({typeAccount: "GV", fullnameSearch: ""}))
    }, [])

     function handleChange(lecturerIds) {
        const lecturers = lecturerIds.map((id) => {
            return accounts.find((acc) => acc.uuid === id)
        })

         setLecturers(lecturers)
    }

    return (
        <Select
            mode="multiple"
            style={{width: '50%'}}
            placeholder="Chọn giảng viên phụ trách"
            onChange={handleChange}
            optionLabelProp="label"
            defaultValue={
                lecturers ? JSON.parse(lecturers).map(lec => lec.uuid) : []
            }
        >
            {
                accounts.map((employee, index) => {
                    return (

                            <Option value={employee.uuid} label={employee.fullname} key={index}>
                                <div className="demo-option-label-item">

                                    {`${employee.fullname} (${employee.vnu_mail})`}

                                </div>
                            </Option>
                    )

                })
            }

        </Select>
    );
}

export default AddLecturerOutlineForm