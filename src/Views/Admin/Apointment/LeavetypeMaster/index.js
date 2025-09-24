import { useState } from "react";

const LeavetypeMaster = () => {
  const [formData, setFormData] = useState({ leaveTypeName: "", leaveTypeCode: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null, newStatus: null });

  const itemsPerPage = 5;

  const [leaveTypes, setLeaveTypes] = useState([
    { id: 1, leaveTypeName: "Paid Leave", leaveTypeCode: "PL", status: "y" },
    { id: 2, leaveTypeName: "Maternity Leave", leaveTypeCode: "ML", status: "y" },
    { id: 3, leaveTypeName: "Paternity Leave", leaveTypeCode: "PTL", status: "y" },
  ]);

  const filteredData = leaveTypes.filter((lt) =>
    lt.leaveTypeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Status toggle confirmation
  const handleSwitchChange = (id, newStatus) => {
    setConfirmDialog({ isOpen: true, id, newStatus });
  };

  const handleConfirm = (confirmed) => {
    if (confirmed && confirmDialog.id !== null) {
      setLeaveTypes((prev) =>
        prev.map((lt) =>
          lt.id === confirmDialog.id ? { ...lt, status: confirmDialog.newStatus } : lt
        )
      );
    }
    setConfirmDialog({ isOpen: false, id: null, newStatus: null });
  };

  // Edit
  const handleEdit = (lt) => {
    setEditingLeaveType(lt);
    setFormData({ leaveTypeName: lt.leaveTypeName, leaveTypeCode: lt.leaveTypeCode });
    setShowForm(true);
  };

  // Save
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.leaveTypeName || !formData.leaveTypeCode) return;

    if (editingLeaveType) {
      setLeaveTypes((prev) =>
        prev.map((lt) =>
          lt.id === editingLeaveType.id
            ? { ...lt, leaveTypeName: formData.leaveTypeName, leaveTypeCode: formData.leaveTypeCode }
            : lt
        )
      );
    } else {
      setLeaveTypes([
        ...leaveTypes,
        { id: Date.now(), leaveTypeName: formData.leaveTypeName, leaveTypeCode: formData.leaveTypeCode, status: "y" },
      ]);
    }

    setEditingLeaveType(null);
    setShowForm(false);
    setFormData({ leaveTypeName: "", leaveTypeCode: "" });
  };

  // Pagination rendering
  const renderPagination = () =>
    [...Array(totalPages)].map((_, i) => (
      <li key={i + 1} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
          {i + 1}
        </button>
      </li>
    ));

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
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="card-title">Leave Type Master</h4>
          {!showForm ? (
            <div className="d-flex gap-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search Leave Type"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  setFormData({ leaveTypeName: "", leaveTypeCode: "" });
                  setShowForm(true);
                }}
              >
                <i className="mdi mdi-plus"></i> Add
              </button>
              <button className="btn btn-info" onClick={() => setShowModal(true)}>
                <i className="mdi mdi-file-document"></i> Reports
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              <i className="mdi mdi-arrow-left"></i> Back
            </button>
          )}
        </div>

        {/* Body */}
        <div className="card-body">
          {!showForm ? (
            <>
              {/* Table */}
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Leave Type Name</th>
                    <th>Leave Type Code</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((lt) => (
                    <tr key={lt.id}>
                      <td>{lt.leaveTypeName}</td>
                      <td>{lt.leaveTypeCode}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={lt.status === "y"}
                            onChange={() =>
                              handleSwitchChange(lt.id, lt.status === "y" ? "n" : "y")
                            }
                          />
                          <label className="form-check-label">
                            {lt.status === "y" ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(lt)}
                          disabled={lt.status !== "y"}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <nav className="d-flex justify-content-between align-items-center mt-3">
                <span>
                  Page {currentPage} of {totalPages} | Total: {filteredData.length}
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
            // Form
            <form onSubmit={handleSave} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">
                  Leave Type Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.leaveTypeName}
                  onChange={(e) => setFormData({ ...formData, leaveTypeName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Leave Type Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.leaveTypeCode}
                  onChange={(e) => setFormData({ ...formData, leaveTypeCode: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-primary me-2">
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
                <h5 className="modal-title">Leave Type Reports</h5>
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
                    {leaveTypes.find((l) => l.id === confirmDialog.id)?.leaveTypeName}
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

export default LeavetypeMaster;
