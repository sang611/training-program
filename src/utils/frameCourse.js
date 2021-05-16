export function generateDataFrame(trainingProgram) {
    let requireSummary = {};
    if (trainingProgram.require_summary) {
        requireSummary = JSON.parse(trainingProgram.require_summary)
    }
    let course_c = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'C');
    let course_lv = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'LV');
    let course_kn_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN' && course.training_program_course.course_type === 'B');
    let course_kn_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN' && course.training_program_course.course_type === 'L');

    //let course_nn = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN');
    let course_nn_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN' && course.training_program_course.course_type === 'B');
    let course_nn_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN' && course.training_program_course.course_type === 'L');

    //let course_n = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N');
    let course_n_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'B');
    let course_n_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'L');
    let course_n_BT = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'BT');
    let course_n_KLTN = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'KLTN');
    return (
        [{course_name_vi: 'Khối kiến thức chung', credits: requireSummary.common, h: 1}]
            .concat(course_c)
            .concat([{
                course_name_vi: 'Khối kiến thức theo lĩnh vực',
                credits: requireSummary.field,
                h: 1
            }])
            .concat(course_lv)
            .concat([{
                course_name_vi: 'Khối kiến thức theo khối ngành',
                credits: requireSummary.major_unit,
                h: 1
            }])
            .concat([{course_name_vi: 'Các học phần bắt buộc', credits: requireSummary.major_unit_B, h: 2}])
            .concat(course_kn_B)
            .concat([{course_name_vi: 'Các học phần tự chọn', credits: requireSummary.major_unit_L, h: 2}])
            .concat(course_kn_L)
            .concat([{
                course_name_vi: 'Khối kiến thức theo nhóm ngành',
                credits: requireSummary.major_group,
                h: 1
            }])
            .concat([{course_name_vi: 'Các học phần bắt buộc', credits: requireSummary.major_group_B, h: 2}])
            .concat(course_nn_B)
            .concat([{course_name_vi: 'Các học phần tự chọn', credits: requireSummary.major_group_L, h: 2}])
            .concat(course_nn_L)
            .concat([{
                course_name_vi: 'Khối kiến thức ngành',
                credits: requireSummary.major,
                h: 1
            }])
            .concat([{course_name_vi: 'Các học phần bắt buộc', credits: requireSummary.major_B, h: 2}])
            .concat(course_n_B)
            .concat([{course_name_vi: 'Các học phần tự chọn', credits: requireSummary.major_L, h: 2}])
            .concat(course_n_L)
            .concat([{course_name_vi: 'Các học phần bổ trợ', credits: requireSummary.major_BT, h: 2}])
            .concat(course_n_BT)
            .concat([{course_name_vi: 'KLTN/Các học phần thay thế', credits: requireSummary.major_KLTN, h: 2}])
            .concat(course_n_KLTN)
    )
}