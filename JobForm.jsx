import React, { useState, useEffect } from 'react';
import jobsService from '../../services/jobsService';
import organizationService from '../../services/organizationService';
import locationService from '../../services/locationService';
import './cardsandloki.css';
import '../../pages/account/Formik.css';
import JobInfo from './JobInfo';
import { FaList, FaAddressCard, FaLocationArrow, FaPlay, FaPeopleArrows } from 'react-icons/fa';
import ContactInformation from './ContactInformation';
import LocationForm from './LocationForm';
import Introduction from './Introduction';
import Review from './Review';
import Loki from 'react-loki';
import PropTypes, { string } from 'prop-types';
import sabioDebug from 'sabio-debug';
import { useLocation } from 'react-router-dom';
const _logger = sabioDebug.extend('AddJob');

const AddJob = (props) => {
    _logger('Add Job Prop Types', props);

    const tableName = ['JobTypes'];
    const tableNameL = ['LocationTypes'];

    const [jobTypes, setJobTypes] = useState([]);
    const [locationTypes, setLocationTypes] = useState([]);
    const [stateTypes, setStateTypes] = useState([]);

    useEffect(() => {
        if (jobTypes.length === 0) {
            jobsService.getAllJobTypes(tableName).then(onGetAllJobTypesSuccess).catch(onGetAllJobTypesError);
        }

        if (locationTypes.length === 0) {
            jobsService
                .getAllLocationTypes(tableNameL)
                .then(onGetAllLocationTypesSuccess)
                .catch(onGetAllLocationTypesError);
        }
        if (stateTypes.length === 0) {
            locationService.getStates().then(onGetAllStatesTypesSuccess).catch(onGetAllStatesTypesError);
        }
        organizationService.getOrganizationByUserId(props.currentUser.id).then(onGetOrgSuccess).catch(onGetOrgError);
    }, []);

    const onGetOrgSuccess = (response) => {
        _logger(response);
        setFormData((prevState) => {
            const newJobObject = {
                ...prevState,
            };
            const target = response.item;
            newJobObject.organizationId = target.id;
            newJobObject.companyName = target.name;
            newJobObject.companyAvatarUrl = target.logo;
            return newJobObject;
        });
    };

    const onGetOrgError = (error) => {
        _logger(error);
    };

    const onGetAllJobTypesSuccess = (response) => {
        const array = response.item.jobTypes;
        const types = [];
        for (let i = 0; i < array.length; i++) {
            const jobType = array[i];
            types.push(jobType);
        }
        setJobTypes(types);
    };

    const onGetAllJobTypesError = (error) => {
        _logger(error);
    };

    const onGetAllLocationTypesSuccess = (response) => {
        const array = response.item.locationTypes;
        const locationTypes = [];

        for (let i = 0; i < array.length; i++) {
            const locationType = array[i];
            locationTypes.push(locationType);
        }
        setLocationTypes(locationTypes);
    };

    const onGetAllLocationTypesError = (error) => {
        _logger(error);
    };

    const onGetAllStatesTypesSuccess = (response) => {
        const array = response.items;
        const types = [];
        for (let i = 0; i < array.length; i++) {
            const stateType = array[i];
            types.push(stateType);
        }
        setStateTypes(types);
    };

    const onGetAllStatesTypesError = (error) => {
        _logger(error);
    };

    const [formData, setFormData] = useState({
        jobTypeId: '',
        organizationId: 0,
        companyName: '',
        companyAvatarUrl: '',
        locationTypeId: '',
        lineOne: '',
        lineTwo: '',
        city: '',
        zip: '',
        stateId: 0,
        latitude: 0,
        longitude: 0,
        title: '',
        description: '',
        requirements: '',
        isActive: true,
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        estimatedStartDate: '',
        estimatedFinishDate: '',
    });

    const mergeValues = (values) => {
        setFormData((prevState) => {
            const jobData = { ...prevState, ...values };
            return jobData;
        });
    };

    const { state } = useLocation();

    useEffect(() => {
        if (state?.type !== 'JOB') {
            return;
        } else {
            setFormData((prevState) => {
                const newJobObject = {
                    ...prevState,
                };

                const target = state.payload;
                newJobObject.jobTypeId = target.jobType.id;
                newJobObject.companyName = target.companyName;
                newJobObject.companyAvatarUrl = target.companyAvatarUrl;
                newJobObject.locationTypeId = target.location.locationTypeId;
                newJobObject.lineOne = target.location.lineOne;
                newJobObject.lineTwo = target.location.lineTwo;
                newJobObject.city = target.location.city;
                newJobObject.zip = target.location.zip;
                newJobObject.stateId = target.location.state.id;
                newJobObject.latitude = target.location.latitude;
                newJobObject.longitude = target.location.longitude;
                newJobObject.title = target.title;
                newJobObject.description = target.description;
                newJobObject.requirements = target.requirements;
                newJobObject.isActive = target.isActive;
                newJobObject.contactName = target.contactName;
                newJobObject.contactPhone = target.contactPhone;
                newJobObject.contactEmail = target.contactEmail;
                newJobObject.estimatedStartDate = target.estimatedStartDate;
                newJobObject.estimatedFinishDate = target.estimatedFinishDate;
                return newJobObject;
            });
        }
    }, []);

    const complexSteps = [
        {
            label: 'Step 0',
            icon: <FaPlay className="mt-3" />,
            component: <Introduction formData={formData} />,
        },
        {
            label: 'Step 1',
            icon: <FaPeopleArrows className="mt-3" />,
            component: <JobInfo formData={formData} array={jobTypes} />,
        },
        {
            label: 'Step 2',
            icon: <FaLocationArrow className="mt-3" />,
            component: <LocationForm formData={formData} locations={locationTypes} states={stateTypes} />,
        },
        {
            label: 'Step 3',
            icon: <FaAddressCard className="mt-3" />,
            component: <ContactInformation formData={formData} />,
        },
        {
            label: 'Step 4',
            icon: <FaList className="mt-3" />,
            component: <Review formData={formData} array={jobTypes} locations={locationTypes} states={stateTypes} />,
        },
    ];

    return (
        <React.Fragment>
            <div className="card  col-sm-8 col-lg-4">
                <section id="jobAdminFormContent" className="card-body">
                    <div className="Demo">
                        <Loki
                            steps={complexSteps}
                            onNext={mergeValues}
                            onBack={mergeValues}
                            noActions
                            onFinish={mergeValues}
                        />
                    </div>
                </section>
            </div>
        </React.Fragment>
    );
};
AddJob.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(string),
    }),
};

export default AddJob;
