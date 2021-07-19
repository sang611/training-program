import {Pagination, Row, Select} from 'antd';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'


const {Option} = Select;
const AddLecturerOutlineForm = ({setLecturers, lecturers}) => {

    const {accounts, loadingAll, totalAccounts} = useSelector(state => state.accounts);
    const [pageLec, setPageLec] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [lecSelected, setLecSelected] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.fetchAccounts(
            {
                typeAccount: "GV",
                fullname: searchText,
                page: pageLec
            }
        ))
    }, [])

    function handleChange(lecturerIds) {
        const lecturers = lecturerIds.map((id) => {
            return accounts.find((acc) => acc.uuid === id)
        })
        setLecturers(lecturers)
    }

    function handleSelect(value) {
        const lecturer = accounts.find((acc) => acc.uuid === value)
        setLecturers([...lecturers, lecturer]);
    }

    function handleDeselect(value) {
        const lecturer = accounts.find((acc) => acc.uuid === value)
        setLecturers([...lecturers].filter(lec => lec.uuid !== lecturer.uuid));
    }

/*
    useEffect(() => {
        const lecturers = lecSelected.map((id) => {
            return accounts.find((acc) => acc.uuid === id)
        })
        setLecturers(lecturers)
    }, [lecSelected])
*/

    function handleSearch (value) {
        setSearchText(value)
        setPageLec(1);
        dispatch(actions.fetchAccounts(
            {
                typeAccount: "GV",
                fullname: value,
                page: 1
            }
        ))
    }

    function handlePaginate (page) {
        setPageLec(page);
        dispatch(actions.fetchAccounts(
            {
                typeAccount: "GV",
                fullname: searchText,
                page: page
            }
        ))
    }

    return (
        <Select
            mode="multiple"
            style={{width: '60%'}}
            size="large"
            placeholder="Chọn giảng viên phụ trách"
            optionLabelProp="label"
            filterOption={false}
            searchValue={searchText}
            defaultValue={
                lecturers.map(lec => lec.uuid)
            }
            onSelect={handleSelect}
            onDeselect={handleDeselect}
            onSearch={handleSearch}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <br/>
                    <Row justify="space-around">
                        <Pagination
                            total={totalAccounts}
                            size='small'
                            current={pageLec}
                            onChange={handlePaginate}
                        />
                    </Row>
                </>
            )}
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
            {
                lecturers
                    .filter((lec_of_course) => {
                        return !accounts.map(acc => acc.uuid).includes(lec_of_course.uuid)
                    })
                    .map((employee) => {
                        return (
                            <>
                                <Select.Option
                                    value={employee.uuid}
                                    label={employee.fullname}
                                    key={employee.uuid}
                                >
                                    <div className="demo-option-label-item">
                                        {`${employee.fullname} (${employee.vnu_mail})`}
                                    </div>
                                </Select.Option>
                            </>
                        )
                    })
            }

        </Select>
    );
}

export default AddLecturerOutlineForm