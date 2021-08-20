export function generateDataFrame(trainingProgram) {
    let requireSummary = {};
    if (trainingProgram.require_summary) {
        requireSummary = JSON.parse(trainingProgram.require_summary)
    }
    let course_c = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'C');
    let course_lv = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'LV');
    let course_kn_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN' && course.training_program_course.course_type === 'B');
    let course_kn_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN' && course.training_program_course.course_type === 'L');


    let course_nn_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN' && course.training_program_course.course_type === 'B');
    let course_nn_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN' && course.training_program_course.course_type === 'L');


    let course_n_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'B');
    let course_n_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'L');
    let course_n_BT = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'BT');
    let course_n_KLTN = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'KLTN');

    const getTotalCreditsByType = (courses) => {
        return courses.reduce((a, b) => {
            return a + b.credits;
        }, 0)
    }

    return (
        [{
            course_name_vi: 'Khối kiến thức chung',
            credits: (requireSummary.common || 0) + "/" + getTotalCreditsByType(course_c),
            h: 1
        }]
            .concat(course_c)
            .concat([{
                course_name_vi: 'Khối kiến thức theo lĩnh vực',
                credits: (requireSummary.field || 0) + "/" + getTotalCreditsByType(course_lv),
                h: 1
            }])
            .concat(course_lv)
            .concat([{
                course_name_vi: 'Khối kiến thức theo khối ngành',
                credits: (requireSummary.major_unit || 0) + "/" + getTotalCreditsByType(course_kn_B.concat(course_kn_L)),
                h: 1
            }])
            .concat([{
                course_name_vi: 'Các học phần bắt buộc',
                credits: (requireSummary.major_unit_B || requireSummary.major_unit || 0) + "/" + getTotalCreditsByType(course_kn_B),
                h: 2
            }
            ])
            .concat(course_kn_B)
            .concat([{
                course_name_vi: 'Các học phần tự chọn',
                credits: (requireSummary.major_unit_L || 0) + "/" + getTotalCreditsByType(course_kn_L),
                h: 2
            }
            ])
            .concat(course_kn_L)
            .concat([{
                course_name_vi: 'Khối kiến thức theo nhóm ngành',
                credits: (requireSummary.major_group || 0) + "/" + getTotalCreditsByType(course_nn_B.concat(course_nn_L)),
                h: 1
            }])
            .concat([{
                course_name_vi: 'Các học phần bắt buộc',
                credits: (requireSummary.major_group_B || requireSummary.major_group || 0) + "/" + getTotalCreditsByType(course_nn_B),
                h: 2
            }])
            .concat(course_nn_B)
            .concat([{
                course_name_vi: 'Các học phần tự chọn',
                credits: (requireSummary.major_group_L || 0) + "/" + getTotalCreditsByType(course_nn_L),
                h: 2
            }])
            .concat(course_nn_L)
            .concat([{
                course_name_vi: 'Khối kiến thức ngành',
                credits: (requireSummary.major || 0) + "/" + getTotalCreditsByType(course_n_B.concat(course_n_L).concat(course_n_BT).concat(course_n_KLTN)),
                h: 1
            }])
            .concat([{
                course_name_vi: 'Các học phần bắt buộc',
                credits: (requireSummary.major_B || requireSummary.major || 0) + "/" + getTotalCreditsByType(course_n_B),
                h: 2
            }])
            .concat(course_n_B)
            .concat([{
                course_name_vi: 'Các học phần tự chọn',
                credits: (requireSummary.major_L || 0) + "/" + getTotalCreditsByType(course_n_L),
                h: 2
            }])
            .concat(course_n_L)
            .concat([{
                course_name_vi: 'Các học phần bổ trợ',
                credits: (requireSummary.major_BT || 0) + "/" + getTotalCreditsByType(course_n_BT),
                h: 2
            }])
            .concat(course_n_BT)
            .concat([{
                course_name_vi: 'KLTN/Các học phần thay thế',
                credits: (requireSummary.major_KLTN || 0) + "/" + getTotalCreditsByType(course_n_KLTN),
                h: 2
            }])
            .concat(course_n_KLTN)
    )
}