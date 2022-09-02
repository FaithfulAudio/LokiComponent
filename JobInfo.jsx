import React from 'react';
import { withFormik, Field } from 'formik';
import PropTypes from 'prop-types';
import logger from 'sabio-debug';
import { jobInfoSchema } from '../../schemas/jobAdminSchema';

const _logger = logger.extend('JobInfo');

const JobInformation = (props) => {
    _logger(props);
    const {
        isSubmitting,
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        backLabel,
        nextLabel,
        onBack,
    } = props;

    const jobTypes = props.array;

    const mapJobTypeId = (jobType, index) => {
        return (
            <option value={jobType.id} key={`locationTypeId_${jobType.id}_${index}`}>
                {jobType.name}
            </option>
        );
    };

    const handleBack = () => {
        onBack(values);
    };

    return (
        <form onSubmit={handleSubmit} className="p-1">
            <div className="form-group">
                <select
                    name="jobTypeId"
                    onChange={handleChange}
                    className="jobAdminFormField"
                    onBlur={handleBlur}
                    value={values.jobTypeId}>
                    <option value="">Please select a Job Type</option>
                    {jobTypes.map(mapJobTypeId)}
                </select>
            </div>
            <div className="form-group">
                <Field
                    placeholder="Job Title"
                    type="text"
                    className="jobAdminFormField"
                    name="title"
                    onBlur={handleBlur}
                />
            </div>
            <div className="form-group">
                <Field
                    as="textarea"
                    rows="5"
                    placeholder="Job Description"
                    type="text"
                    className="jobAdminFormField"
                    name="description"
                    onBlur={handleBlur}
                />
            </div>
            <div className="form-group">
                <Field
                    placeholder="Job Requirements"
                    type="text"
                    className="jobAdminFormField"
                    name="requirements"
                    onBlur={handleBlur}
                />
            </div>
            <div>
                <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                    {backLabel}
                </button>
                <span> </span>
                <button type="submit" className="btn btn-success ml-1" disabled={isSubmitting}>
                    {nextLabel}
                </button>
            </div>
        </form>
    );
};

JobInformation.propTypes = {
    values: PropTypes.shape({
        jobTypeId: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        requirements: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({
        jobTypeId: PropTypes.string,
        companyName: PropTypes.string,
        companyAvatarUrl: PropTypes.string,
        description: PropTypes.string,
        title: PropTypes.string,
        requirements: PropTypes.string,
    }),
    isSubmitting: PropTypes.bool,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    backLabel: PropTypes.string.isRequired,
    nextLabel: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    array: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default withFormik({
    mapPropsToValues: (props) => ({
        jobTypeId: props.formData.jobTypeId,
        description: props.formData.description,
        title: props.formData.title,
        requirements: props.formData.requirements,
    }),

    validationSchema: jobInfoSchema,

    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(JobInformation);
