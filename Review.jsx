import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import logger from 'sabio-debug';
import toastr from 'toastr';
import jobsService from '../../services/jobsService';
import { useLocation, useNavigate } from 'react-router-dom';
const _logger = logger.extend('JobReview');

const Review = (props) => {
    _logger('JobReview', props);
    const { onBack } = props;

    const [jobTypeName, setJobTypeName] = useState('');
    const [locationTypeName, setLocationTypeName] = useState('');
    const [stateTypeName, setStateTypeName] = useState('');

    _logger(jobTypeName, locationTypeName);

    useEffect(() => {
        const jobTypeInt = parseInt(props.formData.jobTypeId);
        const locationTypeInt = parseInt(props.formData.locationTypeId);
        const stateTypeInt = parseInt(props.formData.stateId);

        let index = props.array.findIndex((item) => item.id === jobTypeInt);
        if (index !== -1) {
            setJobTypeName(props.array[index].name);
        }
        let index2 = props.locations.findIndex((item) => item.id === locationTypeInt);
        if (index2 !== -1) {
            setLocationTypeName(props.locations[index2].name);
        }
        let index3 = props.states.findIndex((item) => item.id === stateTypeInt);
        if (index3 !== -1) {
            setStateTypeName(props.states[index3].name);
        }
    }, []);

    const companyInfo = {
        companyName: props.formData.companyName,
        companyAvatarUrl: props.formData.companyAvatarUrl,
    };

    const formInfo = {
        jobTypeId: props.formData.jobTypeId,
        organizationId: props.formData.organizationId,
        title: props.formData.title,
        description: props.formData.description,
        requirements: props.formData.requirements,
        isActive: props.formData.isActive,
        contactName: props.formData.contactName,
        contactPhone: props.formData.contactPhone,
        contactEmail: props.formData.contactEmail,
        estimatedStartDate: props.formData.estimatedStartDate,
        estimatedFinishDate: props.formData.estimatedFinishDate,
        locationTypeId: props.formData.locationTypeId,
        lineOne: props.formData.lineOne,
        lineTwo: props.formData.lineTwo,
        city: props.formData.city,
        stateId: props.formData.stateId,
        zip: props.formData.zip,
        latitude: props.formData.latitude,
        longitude: props.formData.longitude,
    };

    const { state } = useLocation();

    const onSubmit = (e) => {
        e.preventDefault();
        if (state?.type !== 'JOB') {
            if (formInfo.estimatedFinishDate === '') {
                formInfo.estimatedFinishDate = null;
            }
            if (formInfo.contactPhone === '') {
                formInfo.contactPhone = null;
            }
            if (formInfo.contactEmail === '') {
                formInfo.contactEmail = null;
            }
            if (formInfo.lineTwo === '') {
                formInfo.lineTwo = null;
            }
            if (formInfo.zip === '') {
                formInfo.zip = null;
            }
            jobsService.addV2(formInfo).then(onAddJobSuccess).catch(onAddJobError);
        } else {
            _logger(formInfo);
            if (formInfo.estimatedFinishDate === '') {
                formInfo.estimatedFinishDate = null;
            }
            if (formInfo.contactPhone === '') {
                formInfo.contactPhone = null;
            }
            if (formInfo.contactEmail === '') {
                formInfo.contactEmail = null;
            }
            if (formInfo.lineTwo === '') {
                formInfo.lineTwo = null;
            }
            if (formInfo.zip === '') {
                formInfo.zip = null;
            }
            formInfo.id = state?.id;
            formInfo.locationId = state?.locationId;
            jobsService.updateV2(state.id, formInfo).then(onUpdateJobSuccess).catch(onUpdateJobError);
        }
    };

    const navigate = useNavigate();

    const onAddJobSuccess = (response) => {
        toastr.success('Job Added', response);
        navigate(`/`);
    };
    const onAddJobError = (error) => {
        toastr.error('Failure to Add Job', error);
    };

    const onUpdateJobSuccess = (response) => {
        toastr.success('Job Updated', response);
    };
    const onUpdateJobError = (error) => {
        toastr.error('Failure to Update Job', error);
    };

    const handleBack = () => {
        onBack();
    };

    return (
        <div>
            <Card md={6}>
                <Card.Body>
                    <h4>Please Review Your Job Posting</h4>
                    <Card.Title title="Job Name" />
                    <img className="publicjob-card-img-top" src={companyInfo.companyAvatarUrl} alt="" />

                    <div>
                        <h5>{formInfo.title}</h5>
                        <h5>{companyInfo.companyName}</h5>
                    </div>

                    <Col>
                        <Row className="border-top align-items-center border-bottom">
                            <Col>
                                <h5 className="text-">Salary</h5>
                            </Col>

                            <Col className="text-right">
                                <span>$80,000/Year</span>
                            </Col>
                        </Row>
                        <Row className="border-top align-items-center border-bottom">
                            <Col>
                                <h5 className="text-">Estimated Start Date</h5>
                            </Col>

                            <Col className="text-right">
                                <span>{formInfo.estimatedStartDate}</span>
                            </Col>
                        </Row>
                        <Row className="border-top align-items-center border-bottom">
                            <Col>
                                <h5 className="text-">Estimated Finish Date</h5>
                            </Col>

                            <Col className="text-right">
                                <span>
                                    {formInfo.estimatedFinishDate ? formInfo.estimatedFinishDate : '(None Selected)'}
                                </span>
                            </Col>
                        </Row>
                        <Row className="border-top align-items-center border-bottom">
                            <Col>
                                <h5 className="text-">Job Type</h5>
                            </Col>

                            <Col className="text-right">
                                <span>Full-Time</span>
                            </Col>
                        </Row>
                        <Row className="border-top align-items-center border-bottom">
                            <Col>
                                <h5 className="text-">Location</h5>
                            </Col>

                            <Col className="text-right">
                                <span>
                                    {formInfo.city}, {stateTypeName}
                                </span>
                            </Col>
                        </Row>
                        <Row className="border-top align-items-center">
                            <Col>
                                <h5 className="text-">Contact Name</h5>
                            </Col>

                            <Col>
                                <h5 className="text-">Contact Phone</h5>
                            </Col>
                            <Col>
                                <h5 className="text-">Contact Email</h5>
                            </Col>
                        </Row>
                        <Row className="align-items-center border-bottom">
                            <Col>
                                <span className="text-">{formInfo.contactName}</span>
                            </Col>

                            <Col>
                                <span>{formInfo.contactPhone ? formInfo.contactPhone : '(None Selected)'}</span>
                            </Col>
                            <Col>
                                <span>{formInfo.contactEmail ? formInfo.contactEmail : '(None Selected)'}</span>
                            </Col>
                        </Row>
                        <Row className="align-items-center my-2">
                            <h3>Description</h3>
                            <p>{formInfo.description}</p>
                        </Row>
                        <Row className="align-items-center my-2">
                            <h3>Requirements</h3>
                            <p>{formInfo.requirements}</p>
                        </Row>
                    </Col>
                </Card.Body>
            </Card>

            <div>
                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    Back
                </button>
                <span> </span>
                <button type="submit" className="btn btn-success ml-1" onClick={onSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

Review.propTypes = {
    onBack: PropTypes.func,
    array: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    locations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    states: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    formData: PropTypes.shape({
        jobTypeId: PropTypes.string.isRequired,
        organizationId: PropTypes.number.isRequired,
        companyName: PropTypes.string.isRequired,
        companyAvatarUrl: PropTypes.string.isRequired,
        locationTypeId: PropTypes.string.isRequired,
        lineOne: PropTypes.string.isRequired,
        lineTwo: PropTypes.string,
        city: PropTypes.string.isRequired,
        zip: PropTypes.string,
        stateId: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        requirements: PropTypes.string.isRequired,
        isActive: PropTypes.bool.isRequired,
        contactName: PropTypes.string.isRequired,
        contactPhone: PropTypes.string,
        contactEmail: PropTypes.string,
        estimatedStartDate: PropTypes.string.isRequired,
        estimatedFinishDate: PropTypes.string,
    }),
};

export default Review;
