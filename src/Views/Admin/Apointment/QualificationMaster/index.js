import { useState } from "react";

const QualificationMaster = () => {
  const [formData, setFormData] = useState({ qualificationName: "", qualificationCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [editingQualification, setEditingQualification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 5;

  const [qualificationData, setQualificationData] = useState([
    { id: 1, qualificationName: "Bachelor of Science", qualificationCode: "BSC", status: "y" },
    { id: 2, qualificationName: "Master of Business Administration", qualificationCode: "MBA", status: "y" },
    { id: 3, qualificationName: "Doctor of Philosophy", qualificationCode: "PhD", status: "y" },
  ]);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    qualificationId: null,
    newStatus: null,
  });

  const filteredQualifications = qualificationData.filter((q) =>
    `${q.qualificationName} ${q.qualificationCode}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQualifications.length / itemsPerPage);

  const currentItems = filteredQualifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, qualificationId: id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.qualificationId !== null) {
      setQualificationData((prev) =>
        prev.map((q) =>
          q.id === confirmDialog.qualificationId ? { ...q, status: confirmDialog.newStatus } : q
        )
      );
    }
    setConfirmDialog({ isOpen: false, qualificationId: null, newStatus: null });
  };

  const handleEdit = (qualification) => {
    setEditingQualification(qualification);
    setFormData({
      qualificationName: qualification.qualificationName,
      qualificationCode: qualification.qualificationCode,
    });
    setShowForm(true);
    setIsFormValid(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { qualificationName, qualificationCode } = formData;
    if (!qualificationName || !qualificationCode) return;

    if (editingQualification) {
      setQualificationData((prev) =>
        prev.map((q) =>
          q.id === editingQualification.id ? { ...q, qualificationName, qualificationCode } : q
        )
      );
    } else {
      setQualificationData([
        ...qualificationData,
        { id: Date.now(), qualificationName, qualificationCode, status: "y" },
      ]);
    }

    setEditingQualification(null);
    setShowForm(false);
    setFormData({ qualificationName: "", qualificationCode: "" });
    setIsFormValid(false);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  const handlePageNavigation = () => {
    const page = parseInt(pageInput);
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Qualification Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Qualification"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ qualificationName: "", qualificationCode: "" });
                  setShowForm(true);
                  setIsFormValid(false);
                }}
              >
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          ) : (
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
                    <th>Qualification Name</th>
                    <th>Qualification Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((qualification) => (
                    <tr key={qualification.id}>
                      <td>{qualification.qualificationName}</td>
                      <td>{qualification.qualificationCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={qualification.status === "y"}
                            onChange={() =>
                              handleSwitchChange(
                                qualification.id,
                                qualification.status === "y" ? "n" : "y"
                              )
                            }
                          />
                          <label className="form-check-label">
                            {qualification.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(qualification)}
                          disabled={qualification.status !== "y"}
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
                  Page {currentPage} of {totalPages} | Total Records: {filteredQualifications.length}
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
                  <button className="btn btn-primary" onClick={handlePageNavigation}>
                    Go
                  </button>
                </div>
              </nav>
            </>
          ) : (
            <form onSubmit={handleSave} className="row">
              <div className="form-group col-md-4">
                <label>
                  Qualification Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.qualificationName}
                  onChange={(e) =>
                    setFormData({ ...formData, qualificationName: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>
                  Qualification Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.qualificationCode}
                  onChange={(e) =>
                    setFormData({ ...formData, qualificationCode: e.target.value })
                  }
                  onInput={() => setIsFormValid(true)}
                  required
                />
              </div>
              <div className="form-group col-md-12 mt-2 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary me-2" disabled={!isFormValid}>
                  Save
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Reports Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Qualification Reports</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Report feature will be implemented...</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
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
                  Are you sure you want to{" "}
                  {confirmDialog.newStatus === "y" ? "activate" : "deactivate"}{" "}
                  <strong>
                    {qualificationData.find((q) => q.id === confirmDialog.qualificationId)
                      ?.qualificationName}
                  </strong>
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>
                  No
                </button>
                <button className="btn btn-primary" onClick={() => handleConfirm(true)}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificationMaster;
