import React, { useContext, useState, useEffect } from 'react';
import './sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import myLogo  from '../../assets/images/xs/ERPlogo.png';

const Sidebar = () => {


  return (
    <>
      <div className="sidebar shadow px-4 py-4 py-md-5 me-0">
        <div className="d-flex flex-column h-100">
          <Link to="index" className="mb-0 brand-icon d-flex align-items-center justify-content-start">
            <span className="logo-icon">
              <img
                src={myLogo}
                alt="Logo"
                style={{ width: 65, height: 40, objectFit: "contain", borderRadius: "8px" }}
                className="me-0 pe-0"
              />
            </span>
            <span className="logo-text">Arigen-Erp</span>
          </Link>
          {/* Menu: main ul */}
          <ul className="menu-list flex-grow-1 mt-3">
            <li className="collapsed">
              <Link
                className="m-link active"
                data-bs-toggle="collapse"
                data-bs-target="#dashboard"
                to="#"
              >
                <i className="icofont-ui-home fs-5" /> <span>Dashboard</span>
                <span className="arrow icofont-rounded-down ms-auto text-end fs-5" />
              </Link>
              {/* Menu: Sub menu ul */}
              <ul className="sub-menu collapse show" id="dashboard">
                <li>
                  <Link className="ms-link active" to="index">
                    Erp Dashboard
                  </Link>
                </li>

              </ul>
            </li>
            <li className="collapsed">
              <Link
                className="m-link"
                data-bs-toggle="collapse"
                data-bs-target="#menu-Doctor"
                to="#"
              >
                <i className="icofont-doctor-alt fs-5" /> <span>Masters</span>
                <span className="arrow icofont-rounded-down ms-auto text-end fs-5" />
              </Link>
              {/* Menu: Sub menu ul */}
              <ul className="sub-menu collapse" id="menu-Doctor">
                
                <li>
                  <Link className="ms-link" to="MaritalMaster">
                    Marital Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="RelationMaster">
                    Relation Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="GenderMaster">
                    Gender Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="ReligionMaster">
                    Religion Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="HolidayMaster">
                    Holiday Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="CourseMaster">
                    Course Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="LeaveMaster">
                    Leave Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="QualificationMaster">
                    Qulification Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="InstituteMaster">
                    Institute Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="CountryMaster">
                    Country Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="StateMaster">
                    State Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="DistrictMaster">
                    District Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="VillageMaster">
                    Village Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="CasteMaster">
                    Caste Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="CategoryMaster">
                    Category Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="BlockMaster">
                    Block Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="LeavetypeMaster">
                    LeaveType Master
                  </Link>
                </li>

                <li>
                  <Link className="ms-link" to="CentreMaster">
                    Centre Master
                  </Link>
                </li>



               
              </ul>
            </li>
          
           
           
           
           
            
          </ul>
          {/* Menu: menu collepce btn */}
          <button
            type="button"
            className="btn btn-link sidebar-mini-btn text-light"
          >
            <span className="ms-2">
              <i className="icofont-bubble-right" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
export default Sidebar;