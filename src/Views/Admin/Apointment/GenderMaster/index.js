import { useState, useEffect } from "react";

const GenderMaster = () => {
  const [formData, setFormData] = useState({ genderName: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingGender, setEditingGender] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  const [genderData, setGenderData] = useState([
    { id: 1, genderName: "Male", status: "y" },
    { id: 2, genderName: "Female", status: "y" },
    { id: 3, genderName: "Transgender", status: "y" },
    { id: 4, genderName: "Non-binary", status: "y" },
    { id: 5, genderName: "Other", status: "y" },
    { id: 6, genderName: "Prefer not to say", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, genderId: null, newStatus: null });

  const filteredGender = genderData.filter((gender) =>
    gender.genderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTotalPages = Math.ceil(filteredGender.length / itemsPerPage);

  const currentItems = filteredGender.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, genderId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.genderId !== null) {
      setGenderData((prevData) =>
        prevData.map((gender) =>
          gender.id === confirmDialog.genderId ? { ...gender, status: confirmDialog.newStatus } : gender
        )
      );
    }
    setConfirmDialog({ isOpen: false, genderId: null, newStatus: null });
  };

  const handleEdit = (gender) => {
    setEditingGender(gender);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const genderName = e.target.elements.genderName.value;
    if (!genderName) return;

    if (editingGender) {
      setGenderData((prevData) =>
        prevData.map((gender) =>
          gender.id === editingGender.id ? { ...gender, genderName } : gender
        )
      );
    } else {
      setGenderData([
        ...genderData,
        { id: Date.now(), genderName, status: "y" },
      ]);
    }

    setEditingGender(null);
    setShowForm(false);
    setFormData({ genderName: "" });
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= filteredTotalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(i)}>{i}</button>
        </li>
      );
    }
    return pages;
  };

  const handlePageNavigation = () => {
    const page = parseInt(pageInput);
    if (page > 0 && page <= filteredTotalPages) {
      setCurrentPage(page);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Gender Master</h4>
          {!showForm && (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Gender"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="btn btn-success" onClick={() => setShowForm(true)}>
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          )}
          {showForm && (
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              <i className="mdi mdi-arrow-left"></i> Back
            </button>
          )}
        </div>
        <div className="card-body">
          {!showForm ? (
            <>
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((gender) => (
                    <tr key={gender.id}>
                      <td>{gender.genderName}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={gender.status === "y"}
                            onChange={() => handleSwitchChange(gender.id, gender.status === "y" ? "n" : "y")}
                          />
                          <label className="form-check-label">
                            {gender.status === "y" ? "Active" : "Deactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(gender)}
                          disabled={gender.status !== "y"}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <nav className="d-flex justify-content-between align-items-center mt-3">
                <span>
                  Page {currentPage} of {filteredTotalPages} | Total Records: {filteredGender.length}
                </span>
                <ul className="pagination mb-0">{renderPagination()}</ul>
                <div className="d-flex">
                  <input
                    type="number"
                    className="form-control me-2"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    placeholder="Go to page"
                  />
                  <button className="btn btn-primary" onClick={handlePageNavigation}>Go</button>
                </div>
              </nav>
            </>
          ) : (
            <form onSubmit={handleSave} className="row">
              <div className="form-group col-md-4">
                <label>Gender Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="genderName"
                  className="form-control"
                  defaultValue={editingGender?.genderName || ""}
                  onChange={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-12 mt-2 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary me-2" disabled={!isFormValid}>Save</button>
                <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gender Reports</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Report content goes here */}
                <p>Report will be implemented...</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button className="btn-close" onClick={() => handleConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                  <strong>
                    {genderData.find((g) => g.id === confirmDialog.genderId)?.genderName}
                  </strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>No</button>
                <button className="btn btn-primary" onClick={() => handleConfirm(true)}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderMaster;
