import React, { useState } from 'react';
import { withFormik, Field } from 'formik';
import PropTypes from 'prop-types';
import logger from 'sabio-debug';
import LocationAutoComplete from '../locations/LocationAutoComplete';
import { locationFormSchema } from '../../schemas/jobAdminSchema';
const _logger = logger.extend('JobLocation');

const LocationInformation = (props) => {
    _logger('JobLocation ', props);
    const {
        values,
        isSubmitting,
        handleBlur,
        handleSubmit,
        handleChange,

        backLabel,
        nextLabel,
        onBack,
    } = props;

    const [address, setAddress] = useState({
        lineOne: null,
        city: null,
        stateId: null,
        zip: null,
    });

    const locationTypes = props.locations || [];

    const mapLocationTypeId = (locationType, index) => {
        return (
            <option value={locationType.id} key={`locationTypeId_${locationType.id}_${index}`}>
                {locationType.name}
            </option>
        );
    };

    const stateTypes = props.states || [];

    const mapStateTypeId = (stateType, index) => {
        return (
            <option value={stateType.id} key={`locationTypeId_${stateType.id}_${index}`}>
                {stateType.name}
            </option>
        );
    };

    const autoChange = (address) => {
        const stateIndex = stateTypes.findIndex((state) => {
            return state.name === address.state;
        });
        const state = stateTypes[stateIndex];
        const fs = { ...address };
        fs.stateId = state.id;
        fs.locationTypeId = values.locationTypeId;
        props.setValues(fs);
        setAddress((prevState) => {
            const newJobObject = {
                ...prevState,
            };
            if (fs.lineOne !== undefined || fs.lineOne !== 'undefined') {
                newJobObject.lineOne = fs.lineOne;
            }
            if (fs.city !== undefined || fs.city !== 'undefined') {
                newJobObject.city = fs.city;
            }
            if (fs.stateId !== undefined || fs.stateId !== 'undefined') {
                newJobObject.stateId = fs.stateId;
            }
            if (fs.zip !== undefined || fs.zip !== 'undefined') {
                newJobObject.zip = fs.zip;
            }

            return newJobObject;
        });
    };

    const handleBack = () => {
        onBack(values);
    };

    return (
        <form onSubmit={handleSubmit} className="p-1">
            <div>
                <LocationAutoComplete handleChange={autoChange} />
            </div>
            {address.lineOne || props.formData.lineOne !== '' ? (
                <div className="form-group">
                    <Field
                        placeholder="Line One"
                        type="text"
                        className="jobAdminFormField"
                        name="lineOne"
                        onBlur={handleBlur}
                        disabled
                    />
                </div>
            ) : null}
            <div className="form-group">
                <Field
                    placeholder="Line Two (Optional)"
                    type="text"
                    className="jobAdminFormField"
                    name="lineTwo"
                    onBlur={handleBlur}
                />
            </div>
            {address.city || props.formData.city !== '' ? (
                <div className="form-group">
                    <Field
                        placeholder="City"
                        type="text"
                        disabled
                        className="jobAdminFormField"
                        name="city"
                        onBlur={handleBlur}
                    />
                </div>
            ) : null}
            {address.stateId || props.formData.stateId !== 0 ? (
                <div className="form-group">
                    <select name="stateId" disabled onChange={handleChange} onBlur={handleBlur} value={values.stateId}>
                        <option value="">State</option>
                        {stateTypes.map(mapStateTypeId)}
                    </select>
                </div>
            ) : null}

            {address.zip || props.formData.zip !== '' ? (
                <div className="form-group">
                    <Field
                        placeholder="Zip Code"
                        type="text"
                        className="jobAdminFormField"
                        name="zip"
                        onBlur={handleBlur}
                        disabled
                    />
                </div>
            ) : null}
            <div className="form-group">
                <select
                    name="locationTypeId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="jobAdminFormField"
                    value={values.locationTypeId}>
                    <option value="">Please select a Location Type</option>
                    {locationTypes.map(mapLocationTypeId)}
                </select>
            </div>

            <button className="btn-secondary btn" type="button" onClick={handleBack} disabled={isSubmitting}>
                {backLabel}
            </button>
            <span> </span>
            <button className="btn-success btn" type="submit" disabled={isSubmitting}>
                {nextLabel}
            </button>
        </form>
    );
};

LocationInformation.propTypes = {
    formData: PropTypes.shape({
        lineOne: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        stateId: PropTypes.number.isRequired,
        zip: PropTypes.string.isRequired,
    }).isRequired,
    values: PropTypes.shape({
        locationTypeId: PropTypes.string,
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        stateId: PropTypes.number,
        zip: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
    }),
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({
        locationTypeId: PropTypes.string,
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        stateId: PropTypes.string,
        zip: PropTypes.string,
        latitude: PropTypes.string,
        longitude: PropTypes.string,
    }),
    isSubmitting: PropTypes.bool,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    handleSubmit: PropTypes.func,
    setValues: PropTypes.func,
    backLabel: PropTypes.string,
    nextLabel: PropTypes.string,
    onBack: PropTypes.func,
    onNext: PropTypes.func,
    locations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })
    ),
    states: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })
    ),
};

export default withFormik({
    mapPropsToValues: (props) => ({
        locationTypeId: props?.formData?.locationTypeId || '',
        lineOne: props.formData.lineOne,
        lineTwo: props.formData.lineTwo,
        city: props.formData.city,
        stateId: props.formData.stateId,
        zip: props.formData.zip,
        latitude: props.formData.latitude,
        longitude: props.formData.longitude,
    }),

    validationSchema: locationFormSchema,

    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(LocationInformation);
